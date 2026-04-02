import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, customerName, email, destination, message } = body; 

    if (type !== 'QUOTE') {
      return NextResponse.json({ error: "Tipo de correo no soportado" }, { status: 400 });
    }

    const primaryColor = '#c2410c'; 
    const subject = `[Solicitud Recibida] Gracias por tu mensaje - Zenith México`;

    const htmlContent = `
      <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: auto;">
        <div style="background: linear-gradient(135deg, #c2410c 0%, #ea580c 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0; color: #fff; font-weight: bold;">
          Zenith México
        </div>
        <div style="padding: 30px; border: 1px solid #eee; border-top: 0; border-radius: 0 0 10px 10px;">
          <h2 style="margin:0 0 15px; color: #1c1917;">¡Hola ${customerName}!</h2>
          <p>Recibimos tu solicitud para viajar a <strong>${destination}</strong>. Un asesor experto se pondrá en contacto contigo en menos de 24 horas.</p>
                      
          <div style="background: #fafaf9; padding: 15px; border-radius: 8px; margin: 25px 0; border-left: 4px solid ${primaryColor};">
            <p style="margin: 0; color: ${primaryColor}; font-weight: bold; font-size: 12px; text-transform: uppercase;">Tu Mensaje:</p>
            <p style="margin: 10px 0 0; font-size: 14px; font-style: italic; color: #444;">${message}</p>
          </div>
          
          <p style="color: #666; margin-bottom: 25px;">Mientras tanto, puedes seguir explorando nuestras experiencias.</p>
          <a href="https://zenithmex.com/#experiencias" style="display: block; width: 100%; text-align: center; background: ${primaryColor}; color: #fff; padding: 15px; border-radius: 30px; text-decoration: none; font-weight: bold;">Ver más experiencias</a>
        </div>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: 'Zenith México <cotizaciones@zenithmex.com>',
      to: [email],  
      subject: subject,
      html: htmlContent,
    });

    if (error) {
      console.error("Error de Resend:", error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error("Error crítico en API Send:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}