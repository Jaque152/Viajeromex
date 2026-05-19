"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ShieldCheck } from "lucide-react";

export default function PoliticaCancelacionPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-32 pb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          <div className="text-center mb-12 animate-bounce-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full mb-6 font-bold text-xs uppercase tracking-widest border border-primary/20">
              <ShieldCheck className="w-4 h-4" />
              Claridad y Transparencia
            </div>
            <h1 className="text-4xl md:text-5xl font-black font-bricolage text-foreground tracking-tight">
              Política de Reembolsos y Cancelaciones
            </h1>
          </div>

          <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-xl shadow-slate-200/50 border-2 border-slate-50 animate-bounce-up delay-100 prose prose-lg max-w-none prose-headings:font-bricolage prose-headings:font-black prose-headings:text-foreground prose-p:text-muted-foreground prose-p:font-medium">
            
            <h2>1. Alcance</h2>
            <p>La presente Política regula los supuestos en los que procede o no la devolución de pagos realizados por los Usuarios a través de los canales oficiales de VIAJEROMEX (sitio web, correo electrónico o plataformas digitales autorizadas).</p>
            <p>Aplica a todos los Servicios contratados, incluidos eventos, experiencias gastronómicas, tours, fan zones y reservaciones en restaurantes o bares asociados. Forma parte integral de los Términos y Condiciones Generales de Contratación de VIAJEROMEX.</p>

            <h2>2. Condiciones generales de reembolso</h2>
            <p><strong>2.1.</strong> El Usuario podrá solicitar un reembolso siempre que:</p>
            <ul>
              <li>Se cumpla con el plazo mínimo de aviso indicado en las condiciones particulares del Servicio (ejemplo: 7 días naturales para eventos generales, 7 días para tours gastronómicos, 1 día para experiencias de consumo inmediato).</li>
              <li>El proveedor correspondiente confirme que el reembolso es procedente conforme a sus políticas internas.</li>
              <li>El pago haya sido acreditado correctamente a través de los sistemas autorizados por VIAJEROMEX.</li>
            </ul>
            <p><strong>2.2.</strong> Ningún reembolso será procesado si la solicitud se presenta fuera de los plazos establecidos o en contravención a las políticas de los proveedores.</p>

            <h2>3. Servicios no reembolsables</h2>
            <p><strong>3.1.</strong> No procederá reembolso alguno en los siguientes supuestos:</p>
            <ul>
              <li>Reservaciones en fechas de alta demanda (ejemplo: partidos de la Copa Mundial FIFA 2026, festividades nacionales o eventos masivos).</li>
              <li>Servicios que indiquen expresamente la cláusula “no reembolsable” en sus condiciones particulares.</li>
              <li>Pagos de anticipos, apartados o depósitos de garantía para asegurar disponibilidad.</li>
              <li>Cancelaciones motivadas por incumplimiento del Usuario (ej. impuntualidad, falta de documentos, incumplimiento de requisitos de acceso, conducta inapropiada, consumo excesivo de alcohol o sustancias).</li>
            </ul>
            <p><strong>3.2.</strong> El Usuario reconoce y acepta que, en estos casos, la pérdida del monto pagado será total.</p>

            <h2>4. Procedimiento para solicitar un reembolso</h2>
            <p><strong>4.1.</strong> El Usuario deberá enviar un correo electrónico a atencion@viajeromex.com, indicando:</p>
            <ul>
              <li>Nombre completo del titular de la reservación.</li>
              <li>Número de reservación.</li>
              <li>Servicio contratado.</li>
              <li>Fecha prevista del Servicio.</li>
              <li>Motivo de la cancelación y solicitud de reembolso.</li>
            </ul>
            <p><strong>4.2.</strong> VIAJEROMEX confirmará la recepción de la solicitud y gestionará ante el proveedor correspondiente la procedencia o improcedencia del reembolso.</p>
            <p><strong>4.3.</strong> En caso de ser aprobado, se notificará al Usuario el monto a devolver y la fecha estimada de acreditación.</p>

            <h2>5. Forma y tiempos de devolución</h2>
            <p><strong>5.1.</strong> Los reembolsos se efectuarán, siempre que sea técnicamente posible, a través del mismo método de pago utilizado por el Usuario.</p>
            <p><strong>5.2.</strong> En caso de imposibilidad técnica, el reembolso podrá realizarse mediante transferencia bancaria a una cuenta a nombre del titular original de la reservación.</p>
            <p><strong>5.3.</strong> Los plazos de acreditación dependen de las instituciones financieras, pudiendo variar entre 5 y 20 días hábiles posteriores a la confirmación del reembolso.</p>
            <p><strong>5.4.</strong> VIAJEROMEX no será responsable por demoras imputables a bancos, pasarelas de pago o terceros ajenos a su control.</p>

            <h2>6. Reembolsos parciales</h2>
            <p><strong>6.1.</strong> Cuando un Usuario haya utilizado parcialmente un Servicio contratado (ejemplo: asistencia a una parte del evento, consumo de algunos beneficios de un paquete), sólo podrá solicitar un reembolso parcial, si así lo autoriza el proveedor.</p>
            <p><strong>6.2.</strong> En ningún caso procederá la devolución íntegra del monto pagado si parte del Servicio ya fue disfrutado por el Usuario.</p>

            <h2>7. Cancelación por parte de VIAJEROMEX o proveedores</h2>
            <p><strong>7.1.</strong> En caso de cancelación de un Servicio por causas imputables a VIAJEROMEX o a un proveedor, el Usuario podrá optar entre: La reprogramación del Servicio en otra fecha, o la devolución íntegra del monto pagado.</p>
            <p><strong>7.2.</strong> No procederá indemnización adicional por daños indirectos, pérdidas de oportunidad o lucro cesante.</p>

            <h2>8. Casos de fuerza mayor o causas ajenas a VIAJEROMEX</h2>
            <p><strong>8.1.</strong> No procederán reembolsos cuando la cancelación o modificación del Servicio se deba a: Condiciones climáticas adversas; Medidas gubernamentales, sanitarias o de seguridad; Fallas técnicas o cortes de transmisión; o Cualquier evento calificado como caso fortuito o fuerza mayor.</p>
            <p><strong>8.2.</strong> En estos casos, VIAJEROMEX podrá ofrecer al Usuario alternativas razonables (reprogramación, sustitución por otro Servicio similar), sin que exista obligación de devolución del monto pagado.</p>

            <h2>9. Contracargos y pagos no reconocidos</h2>
            <p><strong>9.1.</strong> Si un Usuario inicia un contracargo con su banco o institución financiera, VIAJEROMEX se reserva el derecho de: Suspender la prestación del Servicio; Rechazar futuras contrataciones del Usuario; Reclamar judicial o extrajudicialmente los montos adeudados, incluyendo comisiones y gastos legales.</p>

            <h2>10. Aceptación expresa y Contacto</h2>
            <p>Al confirmar su reservación y efectuar el pago correspondiente, el Usuario declara haber leído, comprendido y aceptado íntegramente la presente Política de Reembolsos, así como los Términos y Condiciones Generales de Contratación de VIAJEROMEX.</p>
            <p>Para cualquier consulta relacionada con esta política, el cliente podrá comunicarse al correo atencion@viajeromex.com o acudir directamente al domicilio de VIAJEROMEX en Av. Río Consulado Cto Interior 516, Oficina 102, Colonia Tlatilco, Alcaldía Azcapotzalco, C.P. 02860, Ciudad de México.</p>
            
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}