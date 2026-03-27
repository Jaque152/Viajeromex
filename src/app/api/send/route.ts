import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

// IMPORTANTE: En modo prueba (sin dominio comprado),
// Resend solo deja enviar aL correo de registro.
const DEMO_RECIPIENT_EMAIL = 'zenithmexico26@gmail.com';

interface EmailItem {
  experience_title: string;
  travel_date: string;
  pax_qty: number;
  package_name: string;
  subtotal: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, customerName, email, resCode, items, total } = body; 

    let subject = "";
    let htmlContent = "";

    // Paleta de colores
    const primaryColor = '#c2410c'; // Naranja
    const bgSecondary = '#fafaf9';

    // --- DISEÑO 1: CORREO DE CONFIRMACIÓN DE COMPRA ---
    if (type === 'PURCHASE') {
      subject = `Confirmación de Compra: ${resCode} - ¡Gracias por viajar con nosotros!`;

      htmlContent = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; color: #444; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
          <div style="background-color: ${primaryColor}; padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px; letter-spacing: 1px;">Zenith México</h1>
          </div>

          <div style="padding: 40px 30px;">
            <h2 style="color: #1c1917; margin-top: 0;">¡Hola ${customerName}!</h2>
            <p style="font-size: 16px; line-height: 1.6;">Tu reservación ha sido confirmada. Aquí tienes el desglose detallado de tu próxima aventura:</p>
            
            <div style="background-color: ${bgSecondary}; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid ${primaryColor};">
              <p style="margin: 0; font-size: 13px; color: #78716c; font-weight: bold; text-transform: uppercase;">Código de Reserva</p>
              <p style="margin: 5px 0 0; font-size: 22px; font-family: monospace; color: ${primaryColor}; font-weight: bold;">${resCode}</p>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
              <thead>
                <tr style="border-bottom: 2px solid #e5e7eb; text-align: left;">
                  <th style="padding: 12px 0; font-size: 14px; color: #78716c;">Experiencia</th>
                  <th style="padding: 12px 0; font-size: 14px; color: #78716c; text-align: center;">Cant.</th>
                  <th style="padding: 12px 0; font-size: 14px; color: #78716c; text-align: right;">Precio</th>
                </tr>
              </thead>
              <tbody>
                ${items.map((item: EmailItem) => `
                  <tr style="border-bottom: 1px solid #f3f4f6;">
                    <td style="padding: 15px 0;">
                      <p style="margin: 0; font-weight: bold; color: #1c1917;">${item.experience_title}</p>
                      <p style="margin: 4px 0 0; font-size: 12px; color: #a8a29e;">
                        📅 ${item.travel_date} <br>
                        ✨ Paquete: ${item.package_name}
                      </p>
                    </td>
                    <td style="padding: 15px 0; text-align: center; vertical-align: top;">${item.pax_qty}</td>
                    <td style="padding: 15px 0; text-align: right; font-weight: bold; vertical-align: top;">${item.subtotal}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div style="border-top: 2px solid #e5e7eb; padding-top: 20px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px; text-align: right;">
                <span style="color: #78716c; width: 80%; display: inline-block;">Subtotal:</span>
                <span style="width: 18%; display: inline-block; font-weight: bold;">${total}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px; text-align: right;">
                <span style="color: #78716c; width: 80%; display: inline-block;">IVA (16%):</span>
                <span style="width: 18%; display: inline-block; font-weight: bold;">Incluido</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-top: 20px; text-align: right;">
                <span style="font-size: 18px; font-weight: bold; color: #1c1917; width: 70%; display: inline-block;">TOTAL PAGADO:</span>
                <span style="font-size: 22px; font-weight: 900; color: ${primaryColor}; width: 28%; display: inline-block;">${total}</span>
              </div>
            </div>
          </div>

          <div style="background-color: #f5f5f4; padding: 30px; text-align: center; font-size: 12px; color: #a8a29e;">
            <p style="margin: 0 0 10px;">Este es un recibo oficial de tu compra en Zenith México.</p>
            <p style="margin: 0;">¿Tienes dudas? Contáctanos a soporte@zenithmex.com</p>
          </div>
        </div>
      `;
        
    } 

    // --- DISEÑO 2: CORREO DE CONFIRMACIÓN DE COTIZACIÓN ---
    else if (type === 'QUOTE') {
      
      const { destination, budget, startDate, endDate, travelers, message } = body; 
      
      subject = `[Solicitud Recibida] Gracias por tu mensaje - Zenith México`;

      htmlContent = `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: auto;">
          <div style="background: linear-gradient(135deg, #10b981 0%, ${primaryColor} 100%); padding: 15px; text-align: center; border-radius: 10px 10px 0 0; color: #fff; font-weight: bold;">
            Zenith México
          </div>
          <div style="padding: 30px; border: 1px solid #eee; border-top: 0; border-radius: 0 0 10px 10px;">
            <h2 style="margin:0 0 15px;">Recibimos tu solicitud de cotización</h2>
            <p>Hola, <strong>${customerName}</strong>,</p>
            <p style="color: #666; margin-bottom: 25px;">Gracias por confiar en nosotros para planear tu viaje a <strong>${destination}</strong>. Un asesor experto se pondrá en contacto contigo en menos de 24 horas.</p>

                        
            <div style="background: #fdf2f2; padding: 15px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #fee2e2;">
              <p style="margin: 0; color: ${primaryColor}; font-weight: bold;">TU MENSAJE</p>
              <p style="margin: 10px 0 0; font-size: 14px; font-style: italic; color: #555;">${message}</p>
            </div>
            
            <p style="color: #666; margin-bottom: 25px;">Mientras tanto, puedes seguir explorando nuestras experiencias.</p>
            <a href="https://zenithmex.com/#experiencias" style="display: block; width: 100%; text-align: center; background: ${primaryColor}; color: #fff; padding: 15px; border-radius: 30px; text-decoration: none; font-weight: bold;">Ver más experiencias</a>
          </div>
        </div>
      `;
    }

    // --- ENVÍO REAL VÍA NODEMAILER (A Resend SMTP) ---
    const { data, error } = await resend.emails.send({
      from: 'zenithmex.com <confirmaciones@resend.dev>', // Email por defecto de Resend
      to: [DEMO_RECIPIENT_EMAIL], // Se envía a correo de pruebas
      subject: subject,
      html: htmlContent,
    });

    if (error) return NextResponse.json({ error }, { status: 500 });
    return NextResponse.json(data);

  } catch (error) {
    console.error("Error completo de envío:", error);
    return NextResponse.json({ error: "Error interno de envío" }, { status: 500 });
  }
}