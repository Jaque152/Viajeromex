"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ShieldCheck } from "lucide-react";

export default function TerminosCondicionesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-32 pb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          <div className="text-center mb-12 animate-bounce-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full mb-6 font-bold text-xs uppercase tracking-widest border border-primary/20">
              <ShieldCheck className="w-4 h-4" />
              Acuerdos de Servicio
            </div>
            <h1 className="text-4xl md:text-5xl font-black font-bricolage text-foreground tracking-tight">
              Términos y Condiciones
            </h1>
          </div>

          <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-xl shadow-slate-200/50 border-2 border-slate-50 animate-bounce-up delay-100 prose prose-lg max-w-none prose-headings:font-bricolage prose-headings:font-black prose-headings:text-foreground prose-p:text-muted-foreground prose-p:font-medium">
            
            <h2>1. Identidad de la empresa</h2>
            <p><strong>1.1.</strong> El presente documento establece los Términos y Condiciones Generales de Contratación (en adelante, las “Condiciones Generales”) que regulan la relación jurídica entre los usuarios (en adelante, el “Usuario” o los “Usuarios”) y GREATDEN, S.A. DE C.V. (en adelante, “VIAJEROMEX”), empresa constituida conforme a las leyes mexicanas.</p>
            <p><strong>1.2. Datos de identificación:</strong></p>
            <ul>
              <li><strong>Razón social:</strong> GREATDEN, S.A. DE C.V.</li>
              <li><strong>Domicilio:</strong> Av. Río Consulado Cto Interior 516, Oficina 102, Col. Tlatilco, Alcaldía Azcapotzalco, C.P. 02860, Ciudad de México.</li>
              <li><strong>Correo electrónico de contacto:</strong> atencion@viajeromex.com</li>
              <li><strong>Sitio web y plataformas asociadas:</strong> los dominios, micrositios, portales o herramientas digitales utilizadas para la promoción y contratación de Servicios.</li>
            </ul>
            <p>VIAJEROMEX se dedica a la conceptualización, organización y gestión de experiencias gastronómicas, culturales, turísticas, de entretenimiento y de activación de marca. Al contratar cualquier servicio, realizar una solicitud de reservación o efectuar un pago, el Usuario acepta expresamente las presentes Condiciones Generales.</p>

            <h2>2. Objeto y alcance de los servicios</h2>
            <p><strong>2.1.</strong> Los Servicios ofrecidos por VIAJEROMEX incluyen, sin limitarse a:</p>
            <ul>
              <li><strong>Experiencias gastronómicas y culturales:</strong> tours culinarios, clases de cocina, catas, fiestas temáticas, recorridos guiados y actividades inmersivas en diferentes destinos de México.</li>
              <li><strong>Activaciones y eventos de marca:</strong> diseño conceptual, producción, logística, ambientación y gestión de experiencias para empresas y clientes corporativos.</li>
              <li><strong>Servicios turísticos complementarios:</strong> transporte opcional, coordinación logística, reservas de restaurantes, entradas a espectáculos y servicios de hospitalidad.</li>
              <li><strong>Servicios adicionales relacionados con el Mundial 2026:</strong> reservaciones en restaurantes y bares, acceso a fan zones (Básica, Gastronómica y VIP Experiencial), actividades temáticas y experiencias de hospitalidad.</li>
            </ul>
            <p><strong>2.2.</strong> Cada Servicio contará con una descripción detallada en la plataforma digital de VIAJEROMEX o en la propuesta enviada al cliente, especificando: duración, lugar de encuentro, características, entregables, restricciones, disponibilidad y condiciones particulares.</p>
            <p><strong>2.3.</strong> VIAJEROMEX se reserva el derecho de modificar, sustituir o actualizar el catálogo de Servicios en cualquier momento, sin necesidad de aviso previo, garantizando siempre el cumplimiento de las contrataciones confirmadas.</p>
            <p><strong>2.4.</strong> El Usuario reconoce que los Servicios podrán depender de proveedores externos, y que las políticas internas de dichos terceros (restaurantes, bares, recintos, transportistas, guías, artistas, etc.) serán aplicables y vinculantes.</p>

            <h2>3. Proceso de contratación</h2>
            <p><strong>3.1. Medios habilitados para contratar.</strong> La contratación de los Servicios ofrecidos por VIAJEROMEX únicamente podrá realizarse a través de los siguientes canales oficiales:</p>
            <ul>
              <li>El sitio web y plataformas digitales propiedad de VIAJEROMEX o gestionadas directamente por ésta.</li>
              <li>Solicitudes enviadas por correo electrónico al contacto oficial de VIAJEROMEX.</li>
              <li>Otros canales expresamente autorizados por VIAJEROMEX (por ejemplo, acuerdos corporativos, agentes acreditados, convenios con empresas o colaboradores externos).</li>
            </ul>
            <p>Queda expresamente prohibida la contratación de Servicios a través de intermediarios no autorizados, páginas web apócrifas, revendedores o canales no reconocidos por VIAJEROMEX. En tales casos, VIAJEROMEX no asumirá responsabilidad alguna frente al Usuario.</p>
            <p><strong>3.2. Obligaciones del Usuario al contratar.</strong> El Usuario se compromete a proporcionar, en el momento de la contratación, información veraz, completa, actualizada y suficiente para la correcta gestión del Servicio. Esto incluye, sin limitarse a: Nombre(s) y apellidos completos; Datos de contacto; Fecha, horario y destino de interés; Número de participantes; Requerimientos adicionales; Datos fiscales en caso de requerir factura. El Usuario será responsable de cualquier error, omisión o falsedad en los datos proporcionados.</p>
            <p><strong>3.3. Condiciones para la validez de la contratación.</strong> Toda contratación de Servicios estará siempre sujeta al cumplimiento acumulativo de los siguientes elementos: Confirmación de disponibilidad, asignación de un número de reservación único, y pago íntegro o parcial del precio del Servicio.</p>
            <p><strong>3.4. Proceso de validación.</strong> Una vez recibido el pago y confirmada la disponibilidad, VIAJEROMEX enviará al correo electrónico un documento de confirmación de reserva.</p>
            <p><strong>3.5. Carácter personal de la contratación.</strong> Las contrataciones realizadas son personales e intransferibles, salvo autorización expresa de VIAJEROMEX.</p>
            <p><strong>3.6. Prevención de fraudes.</strong> VIAJEROMEX se reserva el derecho de rechazar o cancelar cualquier contratación en la que existan indicios de fraude o usos indebidos.</p>

            <h2>4. Reservaciones</h2>
            <p><strong>4.1. Solicitud de reservación.</strong> El Usuario deberá enviar una solicitud a través de los medios habilitados.</p>
            <p><strong>4.2. Carácter no vinculante de la solicitud.</strong> La solicitud de reservación no implica confirmación automática del Servicio.</p>
            <p><strong>4.3. Condiciones para la confirmación.</strong> La reservación se considerará válida cuando se cumplan de manera acumulativa: número de reserva, pago confirmado y correo de confirmación.</p>
            <p><strong>4.4 a 4.8.</strong> El Usuario reconoce que las reservas contienen información específica, que en caso de imposibilidad se ofrecerán alternativas, que las políticas de proveedores son vinculantes, que la reserva es intransferible y que existe una obligación estricta de puntualidad.</p>

            <h2>5. Servicios adicionales – Mundial 2026</h2>
            <p><strong>5.1. Gestión de reservaciones en restaurantes y bares.</strong> Durante el periodo del Mundial 2026, VIAJEROMEX ofrecerá gestión de reservaciones sujetas a disponibilidad y políticas de los establecimientos.</p>
            <p><strong>5.2. Consumo de alimentos y bebidas.</strong> El consumo no está incluido en la reservación inicial salvo indicación expresa. El pago de consumos adicionales será responsabilidad directa del Usuario.</p>
            <p><strong>5.3. Modalidades de Fan Zone.</strong> VIAJEROMEX ofrecerá: Fan Zone Básica, Fan Zone Gastronómica y Fan Zone VIP Experiencial. El contenido exacto podrá variar.</p>
            <p><strong>5.4. Condiciones generales aplicables.</strong> Sujetas a disponibilidad de aforo, proveedores, cambios de horario de partidos y restricciones sanitarias/seguridad.</p>
            <p><strong>5.5. Exclusión de responsabilidad.</strong> VIAJEROMEX no será responsable por cambios oficiales del Mundial, decisiones de establecimientos o fuerza mayor.</p>
            <p><strong>5.6. Confirmación y pago.</strong> El acceso quedará confirmado con un número de reservación y pago procesado en la plataforma oficial.</p>

            <h2>6. Pagos</h2>
            <p><strong>6.1. Moneda e impuestos aplicables.</strong> Todos los precios están en pesos mexicanos (MXN) e incluyen impuestos.</p>
            <p><strong>6.2. Métodos de pago autorizados.</strong> Tarjetas de crédito/débito y plataformas habilitadas por VIAJEROMEX. Queda prohibido efectuar pagos a cuentas o enlaces no oficiales.</p>
            <p><strong>6.3 a 6.7.</strong> Detallan la validación de reservaciones, emisión de comprobantes/facturas, manejo de rechazos o contracargos, pagos parciales/no reembolsables y seguridad mediante certificados SSL.</p>

            <h2>7. Cancelaciones, modificaciones y reembolsos</h2>
            <p><strong>7.1 a 7.7.</strong> Toda solicitud de cancelación deberá enviarse a atencion@viajeromex.com. Estarán sujetas a la antelación (1, 3 o 7 días dependiendo de la experiencia), las políticas del proveedor, y la naturaleza del servicio. Existen servicios estrictamente "no reembolsables" (Mundial 2026, anticipos). Los reembolsos aprobados se procesarán entre 5 y 20 días hábiles en el mismo método de pago original.</p>

            <h2>8. Obligaciones del Usuario</h2>
            <p>El Usuario acepta proporcionar información veraz (8.1), cumplir requisitos específicos de edad y documentación (8.2), respetar normas de convivencia e higiene del recinto (8.3), asumir gastos adicionales no incluidos (8.4), no revender la reserva (8.5), consumir alcohol responsablemente (8.6), mantener puntualidad (8.7) y hacerse responsable por daños (8.8). El incumplimiento facultará a VIAJEROMEX a cancelar sin reembolso (8.9).</p>

            <h2>9. Limitación de responsabilidad</h2>
            <p>VIAJEROMEX actúa como gestor e intermediario (9.1). No será responsable por fallas de terceros, clima, pérdida de objetos, lesiones por negligencia o lucro cesante (9.2). El Usuario asume los riesgos inherentes de los tours y fan zones (9.3). La responsabilidad máxima de VIAJEROMEX se limitará al monto efectivamente pagado (9.4).</p>

            <h2>10. Propiedad intelectual</h2>
            <p>Todos los contenidos, marcas y diseños de VIAJEROMEX son propiedad de GREATDEN S.A. DE C.V. (10.1 y 10.2). Se prohíbe estrictamente la copia, reventa o uso no autorizado (10.4 y 10.6). Si el Usuario participa en co-creación de contenido, cede una licencia gratuita y mundial con fines promocionales (10.7).</p>

            <h2>11 / 12. Legislación aplicable y jurisdicción</h2>
            <p>Estas Condiciones se regirán por las leyes de los Estados Unidos Mexicanos. Para cualquier controversia, las partes se someten a los tribunales competentes de la Ciudad de México, renunciando a cualquier otro fuero.</p>

            <h2>13. Disposiciones finales</h2>
            <p>VIAJEROMEX podrá modificar estos términos en cualquier momento publicándolos en la web (13.1). Es responsabilidad del Usuario revisarlos periódicamente (13.2). Este documento constituye el acuerdo completo y vinculante (13.3). En caso de discrepancia, prevalece la versión en español (13.6).</p>
            
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}