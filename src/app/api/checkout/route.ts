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
  'Origin': 'https://explonix.com', 
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
      redirectUrl: 'https://explonix.com' 
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
      .from('customers_explonix')
      .upsert({ 
        first_name: contactInfo.firstName, 
        last_name: contactInfo.lastName, 
        email: contactInfo.email, 
        phone: contactInfo.phone 
      }, { onConflict: 'email' })
      .select().single();

    if (custError) throw new Error("Error guardando cliente en la base de datos.");

    const { data: booking, error: bookError } = await supabase
      .from('bookings_explonix')
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
        const { error: itemsError } = await supabase.from('booking_items_explonix').insert(validBookingItems);
        if (itemsError) throw new Error("Error guardando items de reserva en la BD.");
      }   
    }
   
    // 6. CORREOS ELECTRÓNICOS 
    const primaryColor = '#06B6D4'; 

    const isEnglish = locale === 'en';
    const subjectClient = isEnglish 
      ? `Purchase Confirmation - Thank you for traveling with Explonix!` 
      : `Confirmación de Compra - ¡Gracias por viajar con Explonix!`;

    const greeting = isEnglish ? `Hello ${contactInfo.firstName}!` : `¡Hola ${contactInfo.firstName}!`;
    const confirmationText = isEnglish ? "Your reservation is confirmed." : "Tu reservación ha sido confirmada.";
    const totalLabel = isEnglish ? "TOTAL PAID:" : "TOTAL PAGADO:";
    const quoteLabel = isEnglish ? "Quote Payment" : "Pago de Cotización";
    const folioLabel = isEnglish ? "Folio" : "Folio";
    const qtyLabel = isEnglish ? "Qty." : "Cant.";
    const priceLabel = isEnglish ? "Price" : "Precio";
    const experienceLabel = isEnglish ? "Experience" : "Experiencia";
    const detailsLabel = isEnglish ? "Contact & Billing Details" : "Detalles de Contacto y Facturación";
    const phoneLabel = isEnglish ? "Phone:" : "Teléfono:";
    const addressLabel = isEnglish ? "Address:" : "Dirección:";
    const notesLabel = isEnglish ? "Notes:" : "Notas:";
    
    const htmlClient = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; color: #334155; border: 1px solid #f1f5f9; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #0f172a; padding: 40px 30px; text-align: center; border-bottom: 4px solid ${primaryColor};">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -1px;">EXPLONIX</h1>
          </div>
          <div style="padding: 40px 30px; background-color: #ffffff;">
            <h2 style="color: #0f172a; margin-top: 0; font-size: 24px; font-weight: 800;">${greeting}</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #64748b;">${confirmationText}</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; margin-top: 30px;">
              <thead>
                <tr style="border-bottom: 2px solid #f1f5f9; text-align: left;">
                  <th style="padding: 12px 0; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8;">${experienceLabel}</th>
                  <th style="padding: 12px 0; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; text-align: center;">${qtyLabel}</th>
                  <th style="padding: 12px 0; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; text-align: right;">${priceLabel}</th>
                </tr>
              </thead>
              <tbody>
                ${!manualFolioData ? cart.items.map((item: CartItem) => `
                  <tr style="border-bottom: 1px solid #f8fafc;">
                    <td style="padding: 20px 0;">
                      <p style="margin: 0; font-weight: 800; font-size: 16px; color: #0f172a;">${item.experience.title}</p>
                      <p style="margin: 6px 0 0; font-size: 13px; color: #64748b;">📅 ${item.date} <br>✨ ${item.levelName}</p>
                    </td>
                    <td style="padding: 20px 0; text-align: center; vertical-align: top; font-weight: 600; color: #475569;">${item.people}</td>
                    <td style="padding: 20px 0; text-align: right; font-weight: 800; font-size: 15px; color: #0f172a; vertical-align: top;">${formatPrice(item.totalPrice)}</td>
                  </tr>
                `).join('') : `
                   <tr style="border-bottom: 1px solid #f8fafc;">
                    <td style="padding: 20px 0;">
                      <p style="margin: 0; font-weight: 800; font-size: 16px; color: #0f172a;">${quoteLabel}</p>
                      <p style="margin: 6px 0 0; font-size: 13px; color: #64748b;">${folioLabel}: ${manualFolioData.folio}</p>
                    </td>
                    <td style="padding: 20px 0; text-align: center; vertical-align: top; font-weight: 600;">1</td>
                    <td style="padding: 20px 0; text-align: right; font-weight: 800; font-size: 15px; color: #0f172a; vertical-align: top;">${formatPrice(manualFolioData.amount)}</td>
                  </tr>
                `}
              </tbody>
            </table>

            <div style="background-color: #f8fafc; border-radius: 16px; padding: 25px; margin-bottom: 30px; text-align: right;">
              <span style="font-size: 14px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">${totalLabel} </span>
              <span style="font-size: 28px; font-weight: 900; color: ${primaryColor}; display: block; margin-top: 5px;">${formattedTotal}</span>
            </div>

            <div style="padding: 25px; border-radius: 16px; border: 1px solid #e2e8f0;">
              <h3 style="margin: 0 0 20px; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #0f172a;">${detailsLabel}</h3>
              <p style="margin: 8px 0; font-size: 14px; color: #475569;"><strong>Email:</strong> ${contactInfo.email}</p>
              <p style="margin: 8px 0; font-size: 14px; color: #475569;"><strong>${phoneLabel}</strong> ${contactInfo.phone}</p>
              <p style="margin: 8px 0; font-size: 14px; color: #475569;"><strong>${addressLabel}</strong> ${billingInfo.direccion}, ${billingInfo.localidad}, ${billingInfo.estado}, ${billingInfo.codigo_postal}, ${billingInfo.pais}</p>
              ${orderNotes ? `<p style="margin: 8px 0; font-size: 14px; color: #475569; border-top: 1px dashed #cbd5e1; padding-top: 10px; mt-2;"><strong>${notesLabel}</strong> ${orderNotes}</p>` : ''}
            </div>

          </div>
        </div>
    `;

    await resend.emails.send({
      from: 'Explonix <reservas@explonix.com>', 
      to: [contactInfo.email], 
      subject: subjectClient,
      html: htmlClient,
    });


    // --- NOTIFICACIÓN INTERNA PARA EL EQUIPO ---
    const subjectInternal = `[NUEVA VENTA] - ${formattedTotal} - ${contactInfo.firstName} ${contactInfo.lastName}`;
    
    const htmlInternal = `
      <div style="font-family: sans-serif; color: #333;">
        <h2 style="color: #06B6D4;">¡Nueva Venta Registrada! (Vía Keycop)</h2>
        <p>Se ha procesado un pago exitoso a través de la página web Explonix.</p>
        <hr/>
        <p><strong>Monto Total:</strong> ${formattedTotal}</p>
        <p><strong>ID Transacción (Keycop):</strong> ${saleData.transactionId || saleData.authorizationNumber}</p>
        <hr/>
        <h3>Datos del Cliente:</h3>
        <p><strong>Nombre:</strong> ${contactInfo.firstName} ${contactInfo.lastName}</p>
        <p><strong>Email:</strong> ${contactInfo.email}</p>
        <p><strong>Teléfono:</strong> ${contactInfo.phone}</p>
        <p><strong>Dirección:</strong> ${billingInfo.direccion}, ${billingInfo.localidad}, ${billingInfo.estado}, ${billingInfo.codigo_postal}</p>
        <p><strong>Notas:</strong> ${orderNotes || 'Sin notas'}</p>
        <hr/>
        <h3>Detalle del Pedido:</h3>
        <ul>
          ${!manualFolioData ? cart.items.map((item: CartItem) => `
            <li>${item.experience.title} (x${item.people}) - ${formatPrice(item.totalPrice)}</li>
          `).join('') : `<li>Pago Manual de Folio: ${manualFolioData.folio}</li>`}
        </ul>
      </div>
    `;

    await resend.emails.send({
      from: 'Sistema Explonix <reservas@explonix.com>',
      to: ['contacto@explonix.com'],
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