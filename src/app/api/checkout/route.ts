import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { CartItem } from '@/lib/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; 
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const ETOMIN_EMAIL = process.env.ETOMIN_EMAIL!;
const ETOMIN_PASSWORD = process.env.ETOMIN_PASSWORD!;
const ETOMIN_BASE_URL = 'https://pagos.etomin.com/api/v1';

const resend = new Resend(process.env.RESEND_API_KEY);
const formatPrice = (price: number) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(price);

const getEtominHeaders = (extraHeaders = {}) => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  'Origin': 'https://zenithmex.com', 
  ...extraHeaders
});

async function safeEtominFetch(url: string, options: RequestInit, stepName: string) {
  const res = await fetch(url, options);
  const text = await res.text(); 
  
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error(`Respuesta cruda de Etomin en [${stepName}]:`, text);
    throw new Error(`Falla en ${stepName}. Etomin respondió: ${text.slice(0, 50)}...`);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { locale, contactInfo, billingInfo, orderNotes, cart, cardInfo, formattedTotal, manualFolioData} = body;

    const tempReferenceId = `REF-${Date.now()}`;

    const signinData = await safeEtominFetch(`${ETOMIN_BASE_URL}/signin`, {
      method: 'POST',
      headers: getEtominHeaders(),
      body: JSON.stringify({ email: ETOMIN_EMAIL, password: ETOMIN_PASSWORD })
    }, 'Login Etomin');
    
    if (!signinData.authToken) {
      throw new Error("Credenciales de Etomin incorrectas o bloqueadas.");
    }
    const authToken = signinData.authToken;

    const cardPayload = {
      cardData: {
        cardNumber: cardInfo.number,
        cardholderName: cardInfo.name,
        expirationMonth: cardInfo.expiry.split('/')[0],
        expirationYear: cardInfo.expiry.split('/')[1],
      }
    };

    const tokenData = await safeEtominFetch(`${ETOMIN_BASE_URL}/card/tokenizer`, {
      method: 'POST',
      headers: getEtominHeaders({ 'Authorization': `Bearer ${authToken}` }),
      body: JSON.stringify(cardPayload)
    }, 'Tokenización de Tarjeta');

    if (!tokenData.cardNumberToken) {
      throw new Error("Tarjeta rechazada por Etomin (Datos inválidos).");
    }
    const cardToken = tokenData.cardNumberToken;

    const etominItems = manualFolioData 
      ? [{ title: `Pago Cotización: ${manualFolioData.folio}`, amount: manualFolioData.amount, quantity: 1, id: manualFolioData.folio }]
      : cart.items.map((item: CartItem) => ({
          title: item.experience.title,
          amount: item.pricePerPerson,
          quantity: item.people,
          id: item.packageId.toString(),
    }));

    const finalAmountToCharge = manualFolioData ? manualFolioData.amount : cart.total;

    const salePayload = {
      amount: Number(finalAmountToCharge.toFixed(2)),
      currency: 484, 
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
      items: etominItems,
      redirectUrl: 'https://zenithmex.com' 
    };

    const saleData = await safeEtominFetch(`${ETOMIN_BASE_URL}/sale`, {
      method: 'POST',
      headers: getEtominHeaders({ 'Authorization': `Bearer ${authToken}` }),
      body: JSON.stringify(salePayload)
    }, 'Procesar Venta');
    
    if (saleData.status !== 'APPROVED' && saleData.status !== 'PENDING') {
      console.error("❌ DETALLE DEL RECHAZO ETOMIN:", saleData); 
      throw new Error(`Pago declinado: ${saleData.message || saleData.responseCode || 'Tarjeta rechazada'}`);
    }

    const { data: customer, error: custError } = await supabase
      .from('customers')
      .upsert({ 
        first_name: contactInfo.firstName, 
        last_name: contactInfo.lastName, 
        email: contactInfo.email, 
        phone: contactInfo.phone 
      }, { onConflict: 'email' })
      .select().single();

    if (custError) throw new Error("Error guardando cliente en la base de datos.");

    const { data: booking, error: bookError } = await supabase
      .from('bookings')
      .insert({
        customer_id: customer.id,
        session_id: manualFolioData ? manualFolioData.folio : null,
        total_amount: finalAmountToCharge,
        payment_status: 'paid',
        transaction_id: saleData.transactionId || saleData.authorizationNumber || tempReferenceId,
        payment_provider: 'etomin',
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

    if (!manualFolioData && cart.items.length > 0) {
      const bookingItems = cart.items.map((item: CartItem) => ({
        booking_id: booking.id,
        package_id: item.packageId,
        scheduled_date: item.date,
        pax_qty: item.people,
        unit_price: item.pricePerPerson
      }));
      const { error: itemsError } = await supabase.from('booking_items').insert(bookingItems);
      if (itemsError) throw new Error("Error guardando items de reserva.");
    }
    
    const visualCode = `RES-${booking.id.slice(0, 8).toUpperCase()}`;
    const primaryColor = '#c2410c';

    const isEnglish = locale === 'en';
    const subjectEmail = isEnglish 
      ? `Purchase Confirmation: ${visualCode} - Thank you for traveling with us!` 
      : `Confirmación de Compra: ${visualCode} - ¡Gracias por viajar con nosotros!`;

    const greeting = isEnglish ? `Hello ${contactInfo.firstName}!` : `¡Hola ${contactInfo.firstName}!`;
    const confirmationText = isEnglish ? "Your reservation is confirmed." : "Tu reservación ha sido confirmada.";
    const codeLabel = isEnglish ? "Booking Code" : "Código de Reserva";
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
    
    const htmlContent = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; color: #444; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
          <div style="background-color: ${primaryColor}; padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px; letter-spacing: 1px;">Zenith México</h1>
          </div>
          <div style="padding: 40px 30px;">
            <h2 style="color: #1c1917; margin-top: 0;">${greeting}</h2>
            <p style="font-size: 16px; line-height: 1.6;">${confirmationText}</p>
          
            <div style="background-color: #fafaf9; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid ${primaryColor};">
              <p style="margin: 0; font-size: 13px; color: #78716c; font-weight: bold; text-transform: uppercase;">${codeLabel}</p>
              <p style="margin: 5px 0 0; font-size: 22px; font-family: monospace; color: ${primaryColor}; font-weight: bold;">${visualCode}</p>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
              <thead>
                <tr style="border-bottom: 2px solid #e5e7eb; text-align: left;">
                  <th style="padding: 12px 0; font-size: 14px; color: #78716c;">${experienceLabel}</th>
                  <th style="padding: 12px 0; font-size: 14px; color: #78716c; text-align: center;">${qtyLabel}</th>
                  <th style="padding: 12px 0; font-size: 14px; color: #78716c; text-align: right;">${priceLabel}</th>
                </tr>
              </thead>
              <tbody>
                ${!manualFolioData ? cart.items.map((item: CartItem) => `
                  <tr style="border-bottom: 1px solid #f3f4f6;">
                    <td style="padding: 15px 0;">
                      <p style="margin: 0; font-weight: bold; color: #1c1917;">${item.experience.title}</p>
                      <p style="margin: 4px 0 0; font-size: 12px; color: #a8a29e;">📅 ${item.date} <br>✨ ${item.levelName}</p>
                    </td>
                    <td style="padding: 15px 0; text-align: center; vertical-align: top;">${item.people}</td>
                    <td style="padding: 15px 0; text-align: right; font-weight: bold; vertical-align: top;">${formatPrice(item.totalPrice)}</td>
                  </tr>
                `).join('') : `
                   <tr style="border-bottom: 1px solid #f3f4f6;">
                    <td style="padding: 15px 0;">
                      <p style="margin: 0; font-weight: bold; color: #1c1917;">${quoteLabel}</p>
                      <p style="margin: 4px 0 0; font-size: 12px; color: #a8a29e;">${folioLabel}: ${manualFolioData.folio}</p>
                    </td>
                    <td style="padding: 15px 0; text-align: center; vertical-align: top;">1</td>
                    <td style="padding: 15px 0; text-align: right; font-weight: bold; vertical-align: top;">${formatPrice(manualFolioData.amount)}</td>
                  </tr>
                `}
              </tbody>
            </table>

            <div style="border-top: 2px solid #e5e7eb; padding-top: 20px; margin-bottom: 30px; text-align: right;">
              <span style="font-size: 18px; font-weight: bold; color: #1c1917;">${totalLabel} </span>
              <span style="font-size: 22px; font-weight: 900; color: ${primaryColor};">${formattedTotal}</span>
            </div>

            <div style="background-color: #fafaf9; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
              <h3 style="margin: 0 0 15px; font-size: 15px; color: #1c1917;">${detailsLabel}</h3>
              <p style="margin: 5px 0; font-size: 14px; color: #444;"><strong>Email:</strong> ${contactInfo.email}</p>
              <p style="margin: 5px 0; font-size: 14px; color: #444;"><strong>${phoneLabel}</strong> ${contactInfo.phone}</p>
              <p style="margin: 5px 0; font-size: 14px; color: #444;"><strong>${addressLabel}</strong> ${billingInfo.direccion}, ${billingInfo.localidad}, ${billingInfo.estado}, ${billingInfo.codigo_postal}, ${billingInfo.pais}</p>
              ${orderNotes ? `<p style="margin: 5px 0; font-size: 14px; color: #444;"><strong>${notesLabel}</strong> ${orderNotes}</p>` : ''}
            </div>

          </div>
        </div>
    `;

    await resend.emails.send({
      from: 'Zenith México <reservas@zenithmex.com>', 
      to: [contactInfo.email], 
      bcc: ['contacto@zenithmex.com'],
      subject: subjectEmail,
      html: htmlContent,
    });

    return NextResponse.json({ 
      success: true, 
      bookingId: booking.id,
      visualCode: visualCode
    });

  } catch (error: unknown) {
    console.error("Error capturado en Backend:", error);
    const errorMessage = error instanceof Error ? error.message : "Error interno del servidor";
    return NextResponse.json({ success: false, message: errorMessage }, { status: 400 });
  }
}