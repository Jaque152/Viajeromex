import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { CartItem } from '@/lib/types';
import { processOctanoPayment, PaymentData } from '@/lib/octano'; // Importamos tu nueva función

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { contactInfo, billingInfo, cart, cardInfo, manualFolioData, orderNotes } = body;

    console.log(body)

    // 1. OBTENER LA IP REAL (Crítico para Producción)
    const forwardedFor = req.headers.get('x-forwarded-for');
    const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    const tempReferenceId = `REF-${Date.now()}`;
    const finalAmount = manualFolioData ? manualFolioData.amount : cart.total;

    // 2. CONSTRUIR EL OBJETO PARA LA NUEVA GUÍA
    const paymentData: PaymentData = {
      amount: Number(finalAmount),
      orderId: tempReferenceId,
      currency: 'MXN',
      cardData: {
        number: cardInfo.number,
        name: cardInfo.name,
        month: cardInfo.expiry.split('/')[0],
        year: cardInfo.expiry.split('/')[1],
        cvv: cardInfo.cvv
      },
      customer: {
        nombre: contactInfo.firstName,
        apellido: contactInfo.lastName || 'Sin apellido',
        email: contactInfo.email,
        telefono: contactInfo.phone,
        direccion: billingInfo.direccion || 'Sin Especificar',
        ciudad: billingInfo.localidad || 'Ciudad de México',
        estado: billingInfo.estado || 'CDMX',
        cp: billingInfo.codigo_postal || '00000',
        pais: 'MX'
      },
      // metadata: {
      //   ip: clientIp // ✅ PASAMOS LA IP REAL AQUÍ
      // }
    };

    // 3. PROCESAR EL PAGO CON TU NUEVA FUNCIÓN
    const paymentResult = await processOctanoPayment(paymentData);

    console.log(paymentResult)

    if (!paymentResult.success) {
      throw new Error(`Pago declinado: ${paymentResult.error}`);
    }

    // 4. GUARDAR EN SUPABASE
    const { data: customer } = await supabase.from('customers_vm').upsert({ 
      first_name: contactInfo.firstName, 
      last_name: contactInfo.lastName, 
      email: contactInfo.email, 
      phone: contactInfo.phone 
    }, { onConflict: 'email' }).select().single();

    const { data: booking } = await supabase.from('bookings_vm').insert({
      customer_id: customer.id,
      session_id: manualFolioData ? manualFolioData.folio : null,
      total_amount: finalAmount,
      payment_status: 'paid',
      transaction_id: paymentResult.data?.transactionId || tempReferenceId,
      payment_provider: 'octano', 
      payment_date: new Date().toISOString(),
      // ... tus otros campos de BD
    }).select().single();

    // 5. ENVÍO DE CORREOS AISLADO (Mejor práctica que discutimos)
    try {
      // (Aquí va tu código de configuración de Resend HTML)
      // await Promise.all([ resend.emails.send({...}), resend.emails.send({...}) ]);
    } catch (emailError) {
      console.error("⚠️ Pago exitoso, pero falló el correo:", emailError);
    }

    return NextResponse.json({ success: true, bookingId: booking.id });

  } catch (error: unknown) {
    console.error("❌ Error en Checkout:", (error as Error).message);
    return NextResponse.json({ success: false, message: (error as Error).message || "Error del servidor" }, { status: 400 });
  }
}