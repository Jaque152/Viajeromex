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
  'Origin': 'https://mextripia.com', 
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
      redirectUrl: 'https://mextripia.com' 
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
      .from('customers_Mextripia')
      .upsert({ 
        first_name: contactInfo.firstName, 
        last_name: contactInfo.lastName, 
        email: contactInfo.email, 
        phone: contactInfo.phone 
      }, { onConflict: 'email' })
      .select().single();

    if (custError) throw new Error("Error guardando cliente en la base de datos.");

    const { data: booking, error: bookError } = await supabase
      .from('bookings_Mextripia')
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
        const { error: itemsError } = await supabase.from('booking_items_Mextripia').insert(validBookingItems);
        if (itemsError) throw new Error("Error guardando items de reserva en la BD.");
      }   
    }
   
    // 6. CORREOS ELECTRÓNICOS (Estética Epicúreo)
    const bgDark = '#1B2B22'; // Forest Dark
    const bgLight = '#FAF9F6'; // Warm Pearl
    const primaryColor = '#C9A27E'; // Sand / Caramel
    const textColor = '#1B2B22';

    const isEnglish = locale === 'en';
    const subjectClient = isEnglish 
      ? `Purchase Confirmation - Thank you for choosing Mextripia.` 
      : `Confirmación de Reserva - Su experiencia con Mextripia.`;

    const greeting = isEnglish ? `Dear ${contactInfo.firstName},` : `Estimado/a ${contactInfo.firstName},`;
    const confirmationText = isEnglish ? "Your culinary expedition has been successfully confirmed. It is a pleasure for us to serve you." : "Su expedición culinaria ha sido confirmada con éxito. Es un placer para nosotros servirle.";
    const totalLabel = isEnglish ? "TOTAL PAID:" : "TOTAL ABONADO:";
    const quoteLabel = isEnglish ? "Custom Design" : "Diseño a Medida";
    const folioLabel = isEnglish ? "Folio" : "Folio";
    const qtyLabel = isEnglish ? "Guests" : "Asistentes";
    const priceLabel = isEnglish ? "Investment" : "Inversión";
    const experienceLabel = isEnglish ? "Experience" : "Experiencia";
    const detailsLabel = isEnglish ? "Contact & Billing Details" : "Datos de Contacto y Facturación";
    const phoneLabel = isEnglish ? "Phone:" : "Teléfono:";
    const addressLabel = isEnglish ? "Address:" : "Dirección:";
    const notesLabel = isEnglish ? "Special Requests:" : "Peticiones Especiales:";
    
    const htmlClient = `
        <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: auto; background-color: ${bgLight}; color: ${textColor}; border: 1px solid #E5E0D8; border-radius: 16px; overflow: hidden;">
          <div style="background-color: ${bgDark}; padding: 40px 30px; text-align: center; border-bottom: 4px solid ${primaryColor};">
            <h1 style="color: ${bgLight}; margin: 0; font-size: 32px; font-family: 'Georgia', serif; font-weight: normal; letter-spacing: 4px;">MEXTRIPIA</h1>
          </div>
          <div style="padding: 40px 30px;">
            <h2 style="color: ${textColor}; margin-top: 0; font-size: 24px; font-family: 'Georgia', serif; font-weight: normal;">${greeting}</h2>
            <p style="font-size: 14px; line-height: 1.8; color: #4A5D23;">${confirmationText}</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; margin-top: 30px;">
              <thead>
                <tr style="border-bottom: 1px solid #C9A27E; text-align: left;">
                  <th style="padding: 12px 0; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; color: ${primaryColor};">${experienceLabel}</th>
                  <th style="padding: 12px 0; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; color: ${primaryColor}; text-align: center;">${qtyLabel}</th>
                  <th style="padding: 12px 0; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; color: ${primaryColor}; text-align: right;">${priceLabel}</th>
                </tr>
              </thead>
              <tbody>
                ${!manualFolioData ? cart.items.map((item: CartItem) => `
                  <tr style="border-bottom: 1px solid #E5E0D8;">
                    <td style="padding: 20px 0;">
                      <p style="margin: 0; font-weight: bold; font-size: 16px; color: ${textColor}; font-family: 'Georgia', serif;">${item.experience.title}</p>
                      <p style="margin: 6px 0 0; font-size: 12px; color: #4A5D23;">📅 ${item.date} <br>✨ ${item.levelName}</p>
                    </td>
                    <td style="padding: 20px 0; text-align: center; vertical-align: top; font-size: 14px; color: ${textColor};">${item.people}</td>
                    <td style="padding: 20px 0; text-align: right; font-weight: bold; font-size: 15px; color: ${textColor}; vertical-align: top;">${formatPrice(item.totalPrice)}</td>
                  </tr>
                `).join('') : `
                   <tr style="border-bottom: 1px solid #E5E0D8;">
                    <td style="padding: 20px 0;">
                      <p style="margin: 0; font-weight: bold; font-size: 16px; color: ${textColor}; font-family: 'Georgia', serif;">${quoteLabel}</p>
                      <p style="margin: 6px 0 0; font-size: 12px; color: #4A5D23;">${folioLabel}: ${manualFolioData.folio}</p>
                    </td>
                    <td style="padding: 20px 0; text-align: center; vertical-align: top; font-size: 14px;">1</td>
                    <td style="padding: 20px 0; text-align: right; font-weight: bold; font-size: 15px; color: ${textColor}; vertical-align: top;">${formatPrice(manualFolioData.amount)}</td>
                  </tr>
                `}
              </tbody>
            </table>

            <div style="background-color: transparent; border-top: 2px solid ${textColor}; padding: 25px 0 10px; text-align: right;">
              <span style="font-size: 12px; font-weight: bold; color: ${textColor}; text-transform: uppercase; letter-spacing: 2px;">${totalLabel} </span>
              <span style="font-size: 24px; font-family: 'Georgia', serif; color: ${primaryColor}; display: block; margin-top: 5px;">${formattedTotal}</span>
            </div>

            <div style="margin-top: 30px; padding: 25px; border-radius: 8px; border: 1px solid #E5E0D8; background-color: #ffffff;">
              <h3 style="margin: 0 0 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; color: ${textColor};">${detailsLabel}</h3>
              <p style="margin: 8px 0; font-size: 13px; color: #4A5D23;"><strong>Email:</strong> ${contactInfo.email}</p>
              <p style="margin: 8px 0; font-size: 13px; color: #4A5D23;"><strong>${phoneLabel}</strong> ${contactInfo.phone}</p>
              <p style="margin: 8px 0; font-size: 13px; color: #4A5D23;"><strong>${addressLabel}</strong> ${billingInfo.direccion}, ${billingInfo.localidad}, ${billingInfo.estado}, ${billingInfo.codigo_postal}, ${billingInfo.pais}</p>
              ${orderNotes ? `<p style="margin: 8px 0; font-size: 13px; color: #4A5D23; border-top: 1px dashed #E5E0D8; padding-top: 10px; mt-2;"><strong>${notesLabel}</strong> ${orderNotes}</p>` : ''}
            </div>

            <div style="text-align: center; margin-top: 40px; border-top: 1px solid #E5E0D8; padding-top: 20px;">
              <p style="font-size: 10px; color: #4A5D23; text-transform: uppercase; letter-spacing: 1px;">Mextripia © ${new Date().getFullYear()}. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
    `;

    await resend.emails.send({
      from: 'Mextripia <reservas@mextripia.com>', 
      to: [contactInfo.email], 
      subject: subjectClient,
      html: htmlClient,
    });


    // --- NOTIFICACIÓN INTERNA PARA EL EQUIPO ---
    const subjectInternal = `[NUEVA VENTA] - ${formattedTotal} - ${contactInfo.firstName} ${contactInfo.lastName}`;
    
    const htmlInternal = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #4A5D23;">¡Nueva Reserva Confirmada! (Vía Keycop)</h2>
        <p>Se ha procesado un pago exitoso a través de la plataforma Mextripia.</p>
        <hr/>
        <p><strong>Monto Total:</strong> ${formattedTotal}</p>
        <p><strong>ID Transacción (Keycop):</strong> ${saleData.transactionId || saleData.authorizationNumber}</p>
        <hr/>
        <h3>Datos del Huésped:</h3>
        <p><strong>Nombre:</strong> ${contactInfo.firstName} ${contactInfo.lastName}</p>
        <p><strong>Email:</strong> ${contactInfo.email}</p>
        <p><strong>Teléfono:</strong> ${contactInfo.phone}</p>
        <p><strong>Dirección:</strong> ${billingInfo.direccion}, ${billingInfo.localidad}, ${billingInfo.estado}, ${billingInfo.codigo_postal}</p>
        <p><strong>Notas Especiales:</strong> ${orderNotes || 'Sin notas'}</p>
        <hr/>
        <h3>Itinerario Adquirido:</h3>
        <ul>
          ${!manualFolioData ? cart.items.map((item: CartItem) => `
            <li>${item.experience.title} (x${item.people}) - ${formatPrice(item.totalPrice)}</li>
          `).join('') : `<li>Pago Manual de Folio: ${manualFolioData.folio}</li>`}
        </ul>
      </div>
    `;

    await resend.emails.send({
      from: 'Sistema Mextripia <reservas@mextripia.com>',
      to: ['atencion@mextripia.com'],
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