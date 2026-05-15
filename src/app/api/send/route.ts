import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, customerName, email, phone, message, destination, locale, budget, startDate, travelers } = body;

    if (type !== 'CONTACT' && type !== 'QUOTE') {
      return NextResponse.json({ error: 'Tipo de correo no soportado' }, { status: 400 });
    }

    // Colores Viajeromex Foodie
    const primaryColor = '#F97316'; // Papaya
    const secondaryColor = '#E11D48'; // Mexican Pink
    const bgCard = '#ffffff';
    const bgApp = '#f8fafc';
    const textColor = '#1E293B';
    const mutedColor = '#64748B';

    let subjectClient = '';
    let htmlClient = '';
    let subjectInternal = '';
    let htmlInternal = '';

    const greeting = `¡Hola ${customerName}!`;

    // ==========================================
    // 2A. LÓGICA PARA CONTACTO GENERAL
    // ==========================================
    if (type === 'CONTACT') {
      subjectClient = `[Viajeromex] Hemos recibido tu mensaje 🌮`;
      subjectInternal = `💬 [CONTACTO WEB] - ${customerName}`;

      htmlClient = `
        <div style="background-color: ${bgApp}; padding: 40px 20px; font-family: 'Arial Rounded MT Bold', 'Helvetica Rounded', Arial, sans-serif;">
          <div style="max-width: 600px; margin: auto; background-color: ${bgCard}; border-radius: 32px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05);">
            <div style="background-color: ${secondaryColor}; padding: 40px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 36px; font-weight: 900; letter-spacing: -1px;">Viajeromex</h1>
            </div>
            <div style="padding: 40px 30px;">
              <h2 style="color: ${textColor}; margin-top: 0; font-size: 24px; font-weight: 900;">${greeting}</h2>
              <p style="font-size: 16px; line-height: 1.6; color: ${mutedColor}; font-family: Arial, sans-serif;">Gracias por escribirnos. Nuestro equipo ha recibido tu mensaje y ya lo estamos revisando. Te contactaremos de vuelta súper rápido.</p>
              
              <div style="background-color: #fff1f2; border: 2px solid #ffe4e6; border-radius: 24px; padding: 25px; margin-top: 30px;">
                <p style="color: ${secondaryColor}; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 10px;">Tu mensaje original:</p>
                <p style="font-size: 15px; font-style: italic; color: ${textColor}; margin: 0; font-family: Arial, sans-serif;">"${message || 'Sin mensaje.'}"</p>
              </div>

              <div style="text-align: center; margin-top: 40px;">
                <a href="https://viajeromex.com/es/experiencias" style="display: inline-block; background-color: ${textColor}; color: #ffffff; padding: 16px 32px; border-radius: 9999px; text-decoration: none; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
                  Ver Menú de Rutas
                </a>
              </div>
            </div>
          </div>
        </div>
      `;

      htmlInternal = `
        <div style="font-family: Arial, sans-serif; color: #1E293B; background: #f8fafc; padding: 20px;">
          <div style="background: white; padding: 30px; border-radius: 16px; max-width: 600px; margin: auto; border-top: 6px solid ${secondaryColor};">
            <h2 style="color: ${secondaryColor}; margin-top: 0;">Nuevo Mensaje Web</h2>
            <p><strong>Nombre:</strong> ${customerName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Teléfono:</strong> ${phone || 'N/A'}</p>
            <hr style="border: 0; border-top: 2px dashed #e2e8f0; margin: 20px 0;"/>
            <p><strong>Mensaje:</strong></p>
            <p style="background: #f1f5f9; padding: 20px; border-radius: 12px;">${message || 'Vacío'}</p>
          </div>
        </div>
      `;
    } 
    // ==========================================
    // 2B. LÓGICA PARA COTIZACIONES A MEDIDA
    // ==========================================
    else if (type === 'QUOTE') {
      subjectClient = `[Viajeromex] Cocinando tu ruta a medida en ${destination} 👨‍🍳✨`;
      subjectInternal = `📝 [NUEVA COTIZACIÓN] - ${destination} - ${customerName}`;

      htmlClient = `
        <div style="background-color: ${bgApp}; padding: 40px 20px; font-family: 'Arial Rounded MT Bold', 'Helvetica Rounded', Arial, sans-serif;">
          <div style="max-width: 600px; margin: auto; background-color: ${bgCard}; border-radius: 32px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05);">
            <div style="background-color: ${primaryColor}; padding: 40px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 36px; font-weight: 900; letter-spacing: -1px;">Viajeromex</h1>
              <p style="color: #ffffff; opacity: 0.9; margin: 10px 0 0; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">Cata a Medida</p>
            </div>
            <div style="padding: 40px 30px;">
              <h2 style="color: ${textColor}; margin-top: 0; font-size: 24px; font-weight: 900;">${greeting}</h2>
              <p style="font-size: 16px; line-height: 1.6; color: ${mutedColor}; font-family: Arial, sans-serif;">¡Qué gran idea viajar a <strong>${destination}</strong>! Nuestros chefs de experiencias ya recibieron tu receta y están estructurando una propuesta culinaria y logística exacta para tu paladar. Te contactaremos súper pronto.</p>
                          
              <div style="background-color: #f8fafc; border: 2px solid #f1f5f9; border-radius: 24px; padding: 25px; margin-top: 30px;">
                <p style="color: ${primaryColor}; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 15px;">Ingredientes del viaje:</p>
                <p style="margin: 8px 0; font-size: 15px; color: ${textColor}; font-family: Arial, sans-serif;"><strong>📅 Fecha estimada:</strong> ${startDate}</p>
                <p style="margin: 8px 0; font-size: 15px; color: ${textColor}; font-family: Arial, sans-serif;"><strong>👨‍🍳 Comensales:</strong> ${travelers}</p>
              </div>

              ${message ? `
              <div style="margin-top: 20px; padding: 20px; border-left: 4px solid ${primaryColor}; background-color: #fff7ed; border-radius: 0 16px 16px 0;">
                <p style="margin: 0; font-size: 14px; font-style: italic; color: ${textColor}; font-family: Arial, sans-serif;">"${message}"</p>
              </div>
              ` : ''}
              
              <div style="text-align: center; margin-top: 40px;">
                <p style="font-size: 14px; color: ${textColor}; font-weight: bold;">¡Hablamos pronto!</p>
              </div>
            </div>
          </div>
        </div>
      `;

      htmlInternal = `
        <div style="font-family: Arial, sans-serif; color: #1E293B; background: #f8fafc; padding: 20px;">
          <div style="background: white; padding: 30px; border-radius: 16px; max-width: 600px; margin: auto; border-top: 6px solid ${primaryColor};">
            <h2 style="color: ${primaryColor}; margin-top: 0;">¡Nueva Solicitud de Cata a Medida!</h2>
            <p><strong>Huésped:</strong> ${customerName}</p>
            <p><strong>Destino:</strong> ${destination}</p>
            <p><strong>Fecha:</strong> ${startDate}</p>
            <p><strong>Personas:</strong> ${travelers}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Teléfono:</strong> ${phone || 'N/A'}</p>
            <hr style="border: 0; border-top: 2px dashed #e2e8f0; margin: 20px 0;"/>
            <p><strong>Detalles Especiales:</strong></p>
            <p style="background: #fff7ed; padding: 20px; border-radius: 12px;">${message || 'Sin requerimientos adicionales'}</p>
          </div>
        </div>
      `;
    }

    // 3. ENVÍO DE CORREOS
    // Al cliente:
    const { data, error } = await resend.emails.send({
      from: 'Viajeromex <cotizaciones@viajeromex.com>',
      to: [email],
      subject: subjectClient,
      html: htmlClient,
    });

    if (error) {
      console.error('Error de Resend al enviar al cliente:', error);
      return NextResponse.json({ error }, { status: 500 });
    }

    // Al equipo interno:
    const internalMail = await resend.emails.send({
      from: 'Sistema Viajeromex <cotizaciones@viajeromex.com>',
      to: ['atencion@viajeromex.com'], 
      subject: subjectInternal,
      html: htmlInternal,
    });

    if (internalMail.error) {
      console.error('Error al enviar correo interno:', internalMail.error);
    }

    return NextResponse.json({ ok: true, data });

  } catch (error) {
    console.error('Error crítico en API Send:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}