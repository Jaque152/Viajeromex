import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { CartItem } from '@/lib/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; 
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// --- CREDENCIALES KEYCOP ---
const KEYCOP_EMAIL = process.env.KEYCOP_EMAIL!;
const KEYCOP_PASSWORD = process.env.KEYCOP_PASSWORD!;
const KEYCOP_BASE_URL = 'https://pagos.keycop.com.mx/api/v1';

const resend = new Resend(process.env.RESEND_API_KEY);
const formatPrice = (price: number) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(price);

const getKeycopHeaders = (extraHeaders = {}) => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Origin': 'https://viajeromex.com', 
  ...extraHeaders
});

async function safeKeycopFetch(url: string, options: RequestInit, stepName: string) {
  const res = await fetch(url, options);
  const text = await res.text(); 
  
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error(`Respuesta cruda de Keycop en [${stepName}]:`, text);
    throw new Error(`Falla en ${stepName}. Keycop respondió: ${text.slice(0, 50)}...`);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { locale, contactInfo, billingInfo, orderNotes, cart, cardInfo, formattedTotal, manualFolioData} = body;

    const tempReferenceId = `REF-${Date.now()}`;

    // 1. SIGNIN EN KEYCOP
    const signinData = await safeKeycopFetch(`${KEYCOP_BASE_URL}/signin`, {
      method: 'POST',
      headers: getKeycopHeaders(),
      body: JSON.stringify({ email: KEYCOP_EMAIL, password: KEYCOP_PASSWORD })
    }, 'Login Keycop');
    
    if (!signinData.authToken) {
      throw new Error("Credenciales de Keycop incorrectas o bloqueadas.");
    }
    const authToken = signinData.authToken;

    // 2. TOKENIZACIÓN DE TARJETA KEYCOP
    const cardPayload = {
      cardData: {
        cardNumber: cardInfo.number,
        cardholderName: cardInfo.name,
        expirationMonth: cardInfo.expiry.split('/')[0],
        expirationYear: cardInfo.expiry.split('/')[1],
      }
    };

    const tokenData = await safeKeycopFetch(`${KEYCOP_BASE_URL}/card/tokenizer`, {
      method: 'POST',
      headers: getKeycopHeaders({ 'Authorization': `Bearer ${authToken}` }),
      body: JSON.stringify(cardPayload)
    }, 'Tokenización de Tarjeta');

    if (!tokenData.cardNumberToken) {
      throw new Error("Tarjeta rechazada por Keycop (Datos inválidos o encriptación fallida).");
    }
    const cardToken = tokenData.cardNumberToken;

    // 3. PREPARAR ITEMS PARA LA VENTA
    const keycopItems = manualFolioData 
      ? [{ title: `Pago Cotización: ${manualFolioData.folio}`, amount: manualFolioData.amount, quantity: 1, id: manualFolioData.folio }]
      : cart.items.map((item: CartItem) => ({
          title: item.experience.title,
          amount: item.pricePerPerson,
          quantity: item.people,
          id: item.packageId.toString(),
    }));

    const finalAmountToCharge = manualFolioData ? manualFolioData.amount : cart.total;

    // 4. PROCESAR LA VENTA
    const salePayload = {
      amount: Number(finalAmountToCharge.toFixed(2)),
      currency: 484, // MXN
      reference: tempReferenceId,
      customerInformation: {
        firstName: contactInfo.firstName,
        lastName: contactInfo.lastName || 'Sin apellido',
        middleName: '',
        email: contactInfo.email,
        phone1: contactInfo.phone,
        city: billingInfo.localidad || 'Ciudad de México',
        address1: billingInfo.direccion || 'Sin Especificar',
        postalCode: billingInfo.codigo_postal || '00000',
        state: billingInfo.estado || 'CDMX',
        country: 'MX',
        ip: '127.0.0.1' 
      },
      cardData: {
        cardNumberToken: cardToken,
        cvv: cardInfo.cvv
      },
      items: keycopItems,
      redirectUrl: 'https://viajeromex.com' 
    };

    const saleData = await safeKeycopFetch(`${KEYCOP_BASE_URL}/sale`, {
      method: 'POST',
      headers: getKeycopHeaders({ 'Authorization': `Bearer ${authToken}` }),
      body: JSON.stringify(salePayload)
    }, 'Procesar Venta');
    
    if (saleData.status !== 'APPROVED' && saleData.status !== 'PENDING') {
      console.error("❌ DETALLE DEL RECHAZO KEYCOP:", saleData); 
      throw new Error(`Pago declinado: ${saleData.message || saleData.responseCode || 'Tarjeta rechazada por el banco'}`);
    }

    // 5. GUARDAR EN SUPABASE
    const { data: customer, error: custError } = await supabase
      .from('customers_vm')
      .upsert({ 
        first_name: contactInfo.firstName, 
        last_name: contactInfo.lastName, 
        email: contactInfo.email, 
        phone: contactInfo.phone 
      }, { onConflict: 'email' })
      .select().single();

    if (custError) throw new Error("Error guardando cliente en la base de datos.");

    const { data: booking, error: bookError } = await supabase
      .from('bookings_vm')
      .insert({
        customer_id: customer.id,
        session_id: manualFolioData ? manualFolioData.folio : null,
        total_amount: finalAmountToCharge,
        payment_status: 'paid',
        transaction_id: saleData.transactionId || saleData.authorizationNumber || tempReferenceId,
        payment_provider: 'keycop', 
        payment_date: new Date().toISOString(),
        pais: billingInfo.pais,
        direccion: billingInfo.direccion,
        localidad: billingInfo.localidad,
        estado: billingInfo.estado,
        codigo_postal: billingInfo.codigo_postal,
        order_notes: orderNotes || null 
      })
      .select().single();

    if (bookError) throw new Error("Error guardando reserva en la base de datos.");

    if (cart.items.length > 0) {
      const validBookingItems = cart.items
        .filter((item: CartItem) => item.packageId > 0) 
        .map((item: CartItem) => ({
          booking_id: booking.id,
          package_id: item.packageId,
          scheduled_date: item.date,
          pax_qty: item.people,
          unit_price: item.pricePerPerson
        }));
      if (validBookingItems.length > 0) {
        const { error: itemsError } = await supabase.from('booking_items_vm').insert(validBookingItems);
        if (itemsError) throw new Error("Error guardando items de reserva en la BD.");
      }   
    }
   
    // 6. CORREOS ELECTRÓNICOS (Estilo Viajeromex Foodie)
    const primaryColor = '#F97316'; // Papaya Orange
    const secondaryColor = '#E11D48'; // Mexican Pink
    const bgCard = '#ffffff';
    const bgApp = '#f8fafc';
    const textColor = '#1E293B';
    const mutedColor = '#64748B';

    const isEnglish = locale === 'en';
    const subjectClient = isEnglish 
      ? `🍽️ Table reserved! Your foodie adventure with Viajeromex is confirmed.` 
      : `🍽️ ¡Mesa reservada! Tu aventura foodie con Viajeromex está confirmada.`;

    const greeting = isEnglish ? `Hi ${contactInfo.firstName}!` : `¡Hola ${contactInfo.firstName}!`;
    const confirmationText = isEnglish 
      ? "Your payment was successful and your culinary route is officially on our calendar. Prepare your appetite!" 
      : "Tu pago ha sido un éxito y tu ruta culinaria ya está en nuestro calendario. ¡Ve preparando el apetito!";
    const totalLabel = isEnglish ? "Total Paid" : "Total Pagado";
    const quoteLabel = isEnglish ? "Custom Tasting Menu" : "Cata a Medida (Folio VIP)";
    const folioLabel = isEnglish ? "Folio" : "Folio";
    const qtyLabel = isEnglish ? "Guests" : "Comensales";
    const priceLabel = isEnglish ? "Price" : "Inversión";
    const experienceLabel = isEnglish ? "Experience" : "Tu Menú";
    const detailsLabel = isEnglish ? "Traveler Details" : "Datos del Viajero";
    
    const htmlClient = `
      <div style="background-color: ${bgApp}; padding: 40px 20px; font-family: 'Arial Rounded MT Bold', 'Helvetica Rounded', Arial, sans-serif;">
        <div style="max-width: 600px; margin: auto; background-color: ${bgCard}; border-radius: 32px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05);">
          
          <div style="background-color: ${primaryColor}; padding: 40px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 40px; font-weight: 900; letter-spacing: -1px;">Viajeromex</h1>
            <p style="color: #ffffff; opacity: 0.9; margin: 10px 0 0; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">Rutas de Sabor</p>
          </div>

          <div style="padding: 40px 30px;">
            <h2 style="color: ${textColor}; margin-top: 0; font-size: 28px; font-weight: 900;">${greeting}</h2>
            <p style="font-size: 16px; line-height: 1.6; color: ${mutedColor}; font-family: Arial, sans-serif;">${confirmationText}</p>
            
            <div style="margin-top: 30px;">
              ${!manualFolioData ? cart.items.map((item: CartItem) => `
                <div style="background-color: #fff7ed; border: 2px solid #ffedd5; border-radius: 24px; padding: 20px; margin-bottom: 16px;">
                  <p style="color: ${primaryColor}; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px;">✨ ${item.levelName}</p>
                  <p style="margin: 0 0 10px; font-weight: 900; font-size: 20px; color: ${textColor};">${item.experience.title}</p>
                  <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif;">
                    <tr>
                      <td style="color: ${mutedColor}; font-size: 14px;">📅 ${item.date}</td>
                      <td style="text-align: center; color: ${textColor}; font-weight: bold; font-size: 14px;">👨‍🍳 x${item.people}</td>
                      <td style="text-align: right; color: ${textColor}; font-weight: 900; font-size: 18px;">${formatPrice(item.totalPrice)}</td>
                    </tr>
                  </table>
                </div>
              `).join('') : `
                <div style="background-color: #fff7ed; border: 2px solid #ffedd5; border-radius: 24px; padding: 20px; margin-bottom: 16px;">
                  <p style="color: ${primaryColor}; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px;">🎟️ ${folioLabel}: ${manualFolioData.folio}</p>
                  <p style="margin: 0 0 10px; font-weight: 900; font-size: 20px; color: ${textColor};">${quoteLabel}</p>
                  <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif;">
                    <tr>
                      <td style="color: ${mutedColor}; font-size: 14px;">📅 Por confirmar</td>
                      <td style="text-align: center; color: ${textColor}; font-weight: bold; font-size: 14px;">👨‍🍳 x1</td>
                      <td style="text-align: right; color: ${textColor}; font-weight: 900; font-size: 18px;">${formatPrice(manualFolioData.amount)}</td>
                    </tr>
                  </table>
                </div>
              `}
            </div>

            <div style="background-color: ${textColor}; color: white; border-radius: 24px; padding: 25px; margin: 30px 0; text-align: center;">
              <span style="font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; opacity: 0.8; font-family: Arial, sans-serif;">${totalLabel}</span>
              <span style="font-size: 36px; font-weight: 900; display: block; margin-top: 5px; color: #84CC16;">${formattedTotal}</span>
            </div>

            <div style="padding: 25px; border-radius: 24px; border: 2px solid #f1f5f9; background-color: #ffffff; font-family: Arial, sans-serif;">
              <h3 style="margin: 0 0 15px; font-size: 16px; font-weight: 900; color: ${textColor};">${detailsLabel}</h3>
              <p style="margin: 5px 0; font-size: 14px; color: ${mutedColor};"><strong>Email:</strong> ${contactInfo.email}</p>
              <p style="margin: 5px 0; font-size: 14px; color: ${mutedColor};"><strong>Tel:</strong> ${contactInfo.phone}</p>
              ${orderNotes ? `<div style="margin-top: 15px; padding-top: 15px; border-top: 2px dashed #f1f5f9;"><p style="margin: 0; font-size: 14px; color: ${secondaryColor}; font-weight: bold;">📝 Notas:</p><p style="margin: 5px 0 0; font-size: 14px; color: ${textColor};">${orderNotes}</p></div>` : ''}
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <p style="font-size: 12px; color: ${mutedColor}; font-weight: bold; font-family: Arial, sans-serif;">¡Prepara el apetito! Nos vemos pronto.<br>El equipo de Viajeromex.</p>
            </div>
          </div>
        </div>
      </div>
    `;

    await resend.emails.send({
      from: 'Viajeromex <reserva@viajeromex.com>', 
      to: [contactInfo.email], 
      subject: subjectClient,
      html: htmlClient,
    });

    // --- NOTIFICACIÓN INTERNA PARA EL EQUIPO ---
    const subjectInternal = `🌮 [VENTA NUEVA] - ${formattedTotal} - ${contactInfo.firstName}`;
    
    const htmlInternal = `
      <div style="font-family: Arial, sans-serif; color: #1E293B; background: #f8fafc; padding: 20px;">
        <div style="background: white; padding: 30px; border-radius: 16px; max-width: 600px; margin: auto; border-top: 6px solid #84CC16;">
          <h2 style="color: #F97316; margin-top: 0;">¡Ka-ching! Nueva Venta (Keycop)</h2>
          <p style="font-size: 24px; font-weight: bold; color: #84CC16; margin: 10px 0;">${formattedTotal}</p>
          <p style="color: #64748B;"><strong>Transacción:</strong> ${saleData.transactionId || saleData.authorizationNumber}</p>
          <hr style="border: 0; border-top: 2px dashed #e2e8f0; margin: 20px 0;"/>
          <h3>Datos del Cliente:</h3>
          <p><strong>Nombre:</strong> ${contactInfo.firstName} ${contactInfo.lastName}</p>
          <p><strong>Email:</strong> ${contactInfo.email}</p>
          <p><strong>Teléfono:</strong> ${contactInfo.phone}</p>
          <p><strong>Notas Especiales:</strong> ${orderNotes || 'Ninguna'}</p>
          <hr style="border: 0; border-top: 2px dashed #e2e8f0; margin: 20px 0;"/>
          <h3>Resumen:</h3>
          <ul style="background: #f1f5f9; padding: 20px 40px; border-radius: 12px;">
            ${!manualFolioData ? cart.items.map((item: CartItem) => `
              <li style="margin-bottom: 10px;"><strong>${item.experience.title}</strong> (x${item.people}) - ${formatPrice(item.totalPrice)}</li>
            `).join('') : `<li>Pago Manual Folio: <strong>${manualFolioData.folio}</strong></li>`}
          </ul>
        </div>
      </div>
    `;

    await resend.emails.send({
      from: 'Sistema Viajeromex <reservas@viajeromex.com>',
      to: ['atencion@viajeromex.com'],
      subject: subjectInternal,
      html: htmlInternal,
    });

    return NextResponse.json({ 
      success: true, 
      bookingId: booking.id,
    });

  } catch (error: unknown) {
    console.error("Error capturado en Backend:", error);
    const errorMessage = error instanceof Error ? error.message : "Error interno del servidor";
    return NextResponse.json({ success: false, message: errorMessage }, { status: 400 });
  }
}