import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, customerName, email, phone, message, destination, locale, budget, startDate, travelers } = body;

    // 1.  AMBOS tipos de formulario
    if (type !== 'CONTACT' && type !== 'QUOTE') {
      return NextResponse.json({ error: 'Tipo de correo no soportado' }, { status: 400 });
    }

    // Colores 
    const bgDark = '#0f172a'; // Slate 900
    const textAccent = '#06B6D4'; // Cyan 500

    let subjectClient = '';
    let htmlClient = '';
    let subjectInternal = '';
    let htmlInternal = '';

    const greeting = `¡Hola ${customerName}!`;

    // ==========================================
    // 2A. LÓGICA PARA CONTACTO GENERAL
    // ==========================================
    if (type === 'CONTACT') {
      subjectClient = '[Explonix] Hemos recibido tu mensaje';
      subjectInternal = `[NUEVO MENSAJE DE CONTACTO] - ${customerName}`;

      htmlClient = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #334155; max-width: 600px; margin: auto; border: 1px solid #f1f5f9; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);">
          <div style="background-color: ${bgDark}; padding: 40px 20px; text-align: center; border-bottom: 4px solid ${textAccent};">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -1px;">EXPLONIX</h1>
          </div>
          <div style="padding: 40px 30px; background-color: #ffffff;">
            <h2 style="color: #0f172a; margin-top: 0; font-size: 24px; font-weight: 800;">${greeting}</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #64748b;">Hemos recibido tu mensaje con éxito. Nuestro equipo de soporte lo está procesando y te contactaremos a la brevedad.</p>
            
            <div style="margin: 30px 0; padding: 25px; border-radius: 16px; border: 1px solid #e2e8f0; background-color: #f8fafc;">
              <p style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-top: 0; margin-bottom: 15px;">Registro de tu mensaje</p>
              <p style="font-size: 14px; font-style: italic; color: #475569; margin: 0;">"${message || 'Sin mensaje adicional.'}"</p>
            </div>

            <div style="text-align: center; margin-top: 40px;">
              <a href="https://explonix.com/es/#experiencias" style="display: inline-block; background-color: ${bgDark}; color: #ffffff; padding: 16px 32px; border-radius: 9999px; text-decoration: none; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">
                Explorar Expediciones
              </a>
            </div>
          </div>
        </div>
      `;

      htmlInternal = `
        <div style="font-family: sans-serif; color: #333;">
          <h2 style="color: ${textAccent};">Nuevo Mensaje Web (Explonix)</h2>
          <hr/>
          <p><strong>Nombre:</strong> ${customerName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</p>
          <hr/>
          <p><strong>Mensaje:</strong></p>
          <p style="background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">${message || 'Sin mensaje'}</p>
        </div>
      `;
    } 
    // ==========================================
    // 2B. LÓGICA PARA COTIZACIONES
    // ==========================================
    else if (type === 'QUOTE') {
      subjectClient = `[Explonix] Estamos configurando tu viaje a ${destination}`;
      subjectInternal = `[NUEVA COTIZACIÓN] - ${destination} - ${customerName}`;

      htmlClient = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #334155; max-width: 600px; margin: auto; border: 1px solid #f1f5f9; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);">
          <div style="background-color: ${bgDark}; padding: 40px 30px; text-align: center; border-bottom: 4px solid ${textAccent};">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -1px;">EXPLONIX</h1>
            <p style="color: ${textAccent}; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 4px; margin-top: 10px;">Viajes a tu medida</p>
          </div>
          <div style="padding: 40px 30px; background-color: #ffffff;">
            <h2 style="color: #0f172a; margin-top: 0; font-size: 24px; font-weight: 800;">${greeting}</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #64748b;">Hemos recibido tus coordenadas para <strong>${destination}</strong>. Nuestro equipo de expertos ya está orquestando tu itinerario exclusivo y se pondrá en contacto contigo muy pronto.</p>
                        
            <div style="margin: 30px 0; padding: 25px; border-radius: 16px; border: 1px solid #e2e8f0; background-color: #f8fafc;">
              <p style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-top: 0; margin-bottom: 15px;">Detalles de tu solicitud</p>
              <p style="margin: 8px 0; font-size: 14px; color: #475569;"><strong>Fecha de inicio:</strong> ${startDate}</p>
              <p style="margin: 8px 0; font-size: 14px; color: #475569;"><strong>Viajeros:</strong> ${travelers}</p>
              <p style="margin: 8px 0; font-size: 14px; color: #475569;"><strong>Presupuesto:</strong> ${budget}</p>
            </div>

            ${message ? `
            <div style="background-color: #f1f5f9; padding: 20px; border-radius: 12px; border-left: 4px solid ${textAccent}; margin-bottom: 30px;">
              <p style="margin: 0; font-size: 14px; font-style: italic; color: #475569;">"${message}"</p>
            </div>
            ` : ''}
          </div>
        </div>
      `;

      htmlInternal = `
        <div style="font-family: sans-serif; color: #333;">
          <h2 style="color: ${textAccent};">Nueva Cotización (Explonix)</h2>
          <hr/>
          <p><strong>Cliente:</strong> ${customerName}</p>
          <p><strong>Destino:</strong> ${destination}</p>
          <p><strong>Fecha:</strong> ${startDate}</p>
          <p><strong>Viajeros:</strong> ${travelers}</p>
          <p><strong>Presupuesto:</strong> ${budget}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</p>
          <hr/>
          <p><strong>Requerimientos Especiales:</strong></p>
          <p style="background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">${message || 'Sin requerimientos'}</p>
        </div>
      `;
    }

    // 3. ENVÍO DE CORREOS
    // Al cliente:
    const { data, error } = await resend.emails.send({
      from: 'Explonix <cotizaciones@explonix.com>',
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
      from: 'Sistema Explonix <cotizaciones@explonix.com>',
      to: ['contacto@explonix.com'], 
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