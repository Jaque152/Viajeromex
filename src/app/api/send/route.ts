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

    // Colores Epicúreo / Mextripia
    const bgDark = '#1B2B22'; // Forest Dark
    const bgLight = '#FAF9F6'; // Warm Pearl
    const primaryColor = '#C9A27E'; // Sand / Caramel
    const textColor = '#1B2B22';

    let subjectClient = '';
    let htmlClient = '';
    let subjectInternal = '';
    let htmlInternal = '';

    const greeting = `Estimado/a ${customerName},`;

    // ==========================================
    // 2A. LÓGICA PARA CONTACTO GENERAL
    // ==========================================
    if (type === 'CONTACT') {
      subjectClient = '[Mextripia] Hemos recibido su mensaje';
      subjectInternal = `[NUEVO MENSAJE DE CONTACTO] - ${customerName}`;

      htmlClient = `
        <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: auto; background-color: ${bgLight}; color: ${textColor}; border: 1px solid #E5E0D8; border-radius: 16px; overflow: hidden;">
          <div style="background-color: ${bgDark}; padding: 40px 20px; text-align: center; border-bottom: 4px solid ${primaryColor};">
            <h1 style="color: ${bgLight}; margin: 0; font-size: 32px; font-family: 'Georgia', serif; font-weight: normal; letter-spacing: 4px;">MEXTRIPIA</h1>
          </div>
          <div style="padding: 40px 30px;">
            <h2 style="color: ${textColor}; margin-top: 0; font-size: 24px; font-family: 'Georgia', serif; font-weight: normal;">${greeting}</h2>
            <p style="font-size: 14px; line-height: 1.8; color: #4A5D23;">Agradecemos su interés en Mextripia. Hemos recibido su mensaje con éxito. Nuestro equipo de atención revisará sus comentarios y se pondrá en contacto con usted a la brevedad.</p>
            
            <div style="margin: 30px 0; padding: 25px; border-radius: 8px; border: 1px solid #E5E0D8; background-color: #ffffff;">
              <p style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; color: ${primaryColor}; margin-top: 0; margin-bottom: 15px;">Registro de su mensaje</p>
              <p style="font-size: 14px; font-style: italic; color: #4A5D23; margin: 0;">"${message || 'Sin mensaje adicional.'}"</p>
            </div>

            <div style="text-align: center; margin-top: 40px;">
              <a href="https://mextripia.com/es/experiencias" style="display: inline-block; background-color: ${bgDark}; color: ${bgLight}; padding: 16px 32px; border-radius: 9999px; text-decoration: none; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">
                Explorar Colección
              </a>
            </div>
            <div style="text-align: center; margin-top: 40px; border-top: 1px solid #E5E0D8; padding-top: 20px;">
              <p style="font-size: 10px; color: #4A5D23; text-transform: uppercase; letter-spacing: 1px;">Mextripia © ${new Date().getFullYear()}. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
      `;

      htmlInternal = `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #C9A27E;">Nuevo Mensaje Web (Mextripia)</h2>
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
      subjectClient = `[Mextripia] Estamos diseñando su experiencia en ${destination}`;
      subjectInternal = `[NUEVA COTIZACIÓN] - ${destination} - ${customerName}`;

      htmlClient = `
        <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: auto; background-color: ${bgLight}; color: ${textColor}; border: 1px solid #E5E0D8; border-radius: 16px; overflow: hidden;">
          <div style="background-color: ${bgDark}; padding: 40px 30px; text-align: center; border-bottom: 4px solid ${primaryColor};">
            <h1 style="color: ${bgLight}; margin: 0; font-size: 32px; font-family: 'Georgia', serif; font-weight: normal; letter-spacing: 4px;">MEXTRIPIA</h1>
            <p style="color: ${primaryColor}; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 4px; margin-top: 10px;">Diseño a Medida</p>
          </div>
          <div style="padding: 40px 30px;">
            <h2 style="color: ${textColor}; margin-top: 0; font-size: 24px; font-family: 'Georgia', serif; font-weight: normal;">${greeting}</h2>
            <p style="font-size: 14px; line-height: 1.8; color: #4A5D23;">Hemos recibido las coordenadas de su solicitud para <strong>${destination}</strong>. Nuestro equipo de hospitalidad y expertos culinarios ya está diseñando su propuesta exclusiva. Nos pondremos en contacto con usted muy pronto.</p>
                        
            <div style="margin: 30px 0; padding: 25px; border-radius: 8px; border: 1px solid #E5E0D8; background-color: #ffffff;">
              <p style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; color: ${primaryColor}; margin-top: 0; margin-bottom: 15px;">Detalles del Evento</p>
              <p style="margin: 8px 0; font-size: 13px; color: #4A5D23;"><strong>Fecha estimada:</strong> ${startDate}</p>
              <p style="margin: 8px 0; font-size: 13px; color: #4A5D23;"><strong>Asistentes:</strong> ${travelers}</p>
            </div>

            ${message ? `
            <div style="background-color: transparent; padding: 20px; border-left: 4px solid ${primaryColor}; margin-bottom: 30px;">
              <p style="margin: 0; font-size: 14px; font-style: italic; color: #4A5D23;">"${message}"</p>
            </div>
            ` : ''}

            <div style="text-align: center; margin-top: 40px; border-top: 1px solid #E5E0D8; padding-top: 20px;">
              <p style="font-size: 10px; color: #4A5D23; text-transform: uppercase; letter-spacing: 1px;">Mextripia © ${new Date().getFullYear()}. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
      `;

      htmlInternal = `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #C9A27E;">Nueva Solicitud a Medida (Mextripia)</h2>
          <hr/>
          <p><strong>Huésped:</strong> ${customerName}</p>
          <p><strong>Destino:</strong> ${destination}</p>
          <p><strong>Fecha:</strong> ${startDate}</p>
          <p><strong>Asistentes:</strong> ${travelers}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</p>
          <hr/>
          <p><strong>Especificaciones:</strong></p>
          <p style="background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">${message || 'Sin requerimientos adicionales'}</p>
        </div>
      `;
    }

    // 3. ENVÍO DE CORREOS
    // Al cliente:
    const { data, error } = await resend.emails.send({
      from: 'Mextripia <cotizaciones@mextripia.com>',
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
      from: 'Sistema Mextripia <cotizaciones@mextripia.com>',
      to: ['atencion@mextripia.com'], 
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