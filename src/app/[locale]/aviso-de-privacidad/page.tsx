"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ShieldCheck } from "lucide-react";

export default function AvisoPrivacidadPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-32 pb-24 relative overflow-hidden">
        {/* Decoraciones */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          <div className="text-center mb-12 animate-bounce-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full mb-6 font-bold text-xs uppercase tracking-widest border border-primary/20">
              <ShieldCheck className="w-4 h-4" />
              Tus datos están seguros
            </div>
            <h1 className="text-4xl md:text-5xl font-black font-bricolage text-foreground tracking-tight">
              Aviso de Privacidad
            </h1>
          </div>

          <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-xl shadow-slate-200/50 border-2 border-slate-50 animate-bounce-up delay-100 prose prose-lg max-w-none prose-headings:font-bricolage prose-headings:font-black prose-headings:text-foreground prose-p:text-muted-foreground prose-p:font-medium">
            
            <h2>A. Responsable de los datos personales</h2>
            <p><strong>A.1. Identidad del responsable.</strong> El tratamiento de los datos personales recabados a través de VIAJEROMEX.com, así como por otros medios electrónicos o físicos, corresponde a GREATDEN S.A. DE C.V. (en adelante, “VIAJEROMEX” o el “Responsable”).</p>
            <p><strong>A.2. Domicilio.</strong> Av. Río Consulado Cto Interior 516, Oficina 102, Col. Tlatilco, Alcaldía Azcapotzalco, C.P. 02860, Ciudad de México.</p>
            <p><strong>A.3. Medios de contacto.</strong> Para privacidad y datos personales: atencion@viajeromex.com.</p>

            <h2>B. Titulares de los datos</h2>
            <p><strong>B.1. Alcance subjetivo.</strong> Aplica a toda persona física cuyos datos sean tratados por VIAJEROMEX.</p>
            <p><strong>B.2. Colectivos incluidos (enunciativo).</strong> Clientes, prospectos, visitantes del sitio, aliados comerciales (contactos de empresas), proveedores y sus representantes, candidatos a empleo y asistentes a eventos/experiencias.</p>
            <p><strong>B.3. Obtención.</strong> Cualquier persona que proporcione datos mediante formularios web, correo, mensajería, llamadas, contratos, tarjetas, QR, check-in en eventos o comunicación directa se considera Titular.</p>

            <h2>C. Categorías de datos que podremos recabar</h2>
            <ul>
              <li><strong>C.1. Identificación:</strong> nombre completo, edad/fecha de nacimiento, nacionalidad, género, CURP/RFC (si procede), firma autógrafa/electrónica.</li>
              <li><strong>C.2. Contacto:</strong> domicilio, correos, teléfonos (incl. WhatsApp laboral/personal).</li>
              <li><strong>C.3. Fiscales/Facturación:</strong> razón social, RFC, domicilio fiscal, CFDI/uso del CFDI.</li>
              <li><strong>C.4. Preferencias y servicio:</strong> idioma, número de acompañantes, restricciones alimenticias, accesibilidad, horarios preferidos, comentarios logísticos.</li>
              <li><strong>C.5. Relación proveedor/aliado:</strong> datos de contacto de representantes, poderes/identificación para firma (cuando resulte necesario).</li>
              <li><strong>C.6. Candidatos:</strong> CV, historial laboral/formativo, referencias, expectativa económica, disponibilidad.</li>
              <li><strong>C.7. Imagen y voz:</strong> fotografías, audio y video captados en eventos y experiencias (ver finalidad secundaria).</li>
              <li><strong>C.8. Datos sensibles (casos excepcionales):</strong> alergias, condiciones médicas relevantes o movilidad cuando sean indispensables para seguridad/adecuación del servicio. Se tratarán con consentimiento expreso y medidas reforzadas.</li>
            </ul>
            <p>No solicitamos datos de convicciones religiosas, ideología, orientación sexual ni información financiera completa de tarjetas.</p>

            <h2>D. Finalidades del tratamiento</h2>
            <p><strong>D.1. Finalidades primarias (indispensables para la relación):</strong></p>
            <ul>
              <li>Gestionar solicitudes y reservaciones (altas, cambios, confirmaciones).</li>
              <li>Contratación y operación de servicios (experiencias, tours, fan zones, reservaciones en restaurantes/bares, logística).</li>
              <li>Cobranza y pagos vía pasarelas seguras; facturación y comprobación contable.</li>
              <li>Atención al cliente (incidencias, reprogramaciones, cancelaciones y reembolsos conforme a políticas).</li>
              <li>Cumplimientos legales (fiscales, comerciales, seguridad/sanidad, respuesta a autoridades).</li>
              <li>Gestión de proveedores/aliados (alta, verificación, administración contractual).</li>
              <li>Procesos de selección (para candidatos).</li>
            </ul>
            <p><strong>D.2. Finalidades secundarias (opcionales):</strong></p>
            <ul>
              <li>Comunicaciones comerciales (promociones, newsletters, encuestas, invitaciones).</li>
              <li>Análisis y métricas de uso del sitio, preferencias y tendencias para mejorar servicios.</li>
              <li>Uso de imagen/voz captada en eventos para fines promocionales de VIAJEROMEX (sitio, redes, materiales).</li>
              <li>Perfilamiento básico (p. ej., segmentos por destino preferido o franja horaria) sin decisiones automatizadas que produzcan efectos legales.</li>
            </ul>
            <p>Puedes optar por no recibir comunicaciones promocionales o negar las finalidades secundarias escribiendo a atencion@viajeromex.com. La negativa no afecta la prestación de los servicios primarios.</p>

            <h2>E. Base de licitud</h2>
            <p>Tratamos datos conforme a la LFPDPPP bajo: (i) consentimiento; (ii) ejecución de contrato/relación jurídica; (iii) cumplimiento legal; (iv) interés legítimo (p. ej. seguridad del sitio, métricas de mejora, prevención de fraude), sin menoscabar tus derechos. Los datos sensibles se tratan únicamente con consentimiento expreso y cuando sean estrictamente necesarios.</p>

            <h2>F. Transferencias y destinatarios</h2>
            <p><strong>F.1. Nacionales/internacionales (cuando apliquen):</strong></p>
            <ul>
              <li>Proveedores de servicios necesarios para operar (pasarelas de pago, hosting, CRM, email, mensajería, verificación de identidad, venues, restaurantes/bares, guías, transportistas, fotógrafos, productoras).</li>
              <li>Aliados/comerciales para co-ejecución del servicio contratado o administración.</li>
              <li>Autoridades administrativas o judiciales, cuando exista requerimiento u obligación.</li>
              <li>Auditores/asesores (legales, contables, fiscales) bajo deber de confidencialidad.</li>
            </ul>
            <p><strong>F.2. Encargados.</strong> Algunos terceros actúan como encargados (procesan por cuenta del Responsable) bajo contratos con cláusulas de confidencialidad y seguridad.</p>
            <p><strong>F.3. No comercialización.</strong> No vendemos tus datos. Fuera de estos supuestos, cualquier transferencia requerirá tu consentimiento expreso.</p>

            <h2>G. Medidas de seguridad</h2>
            <ul>
              <li><strong>G.1. Controles administrativos, técnicos y físicos</strong> proporcionales al riesgo: control de accesos, principio de mínima necesidad, registros, entrenamiento, acuerdos de confidencialidad.</li>
              <li><strong>G.2. Seguridad tecnológica:</strong> cifrado TLS/SSL, segmentación de redes, hash de contraseñas, registros de acceso, pasarelas certificadas (p. ej., PCI DSS), monitoreo antifraude.</li>
              <li><strong>G.3. Gestión de incidentes:</strong> procedimiento interno de respuesta a brechas; notificación a titulares y autoridades cuando legalmente proceda.</li>
              <li><strong>G.4.</strong> Aun con medidas reforzadas, ningún sistema es invulnerable; se limita la responsabilidad conforme a ley y T&C.</li>
            </ul>

            <h2>H. Conservación (retención) de datos</h2>
            <p><strong>H.1.</strong> Conservamos datos solo el tiempo necesario para finalidades declaradas y plazos legales (fiscales, comerciales, prescripción).</p>
            <p><strong>H.2.</strong> Cumplidas finalidades/plazos, procedemos a supresión, bloqueo o anonimización segura.</p>
            <p><strong>H.3.</strong> Criterios: tipo de dato, riesgo, obligaciones regulatorias, defensa de derechos y necesidades operativas.</p>

            <h2>I. Derechos ARCO, limitación de uso y revocación del consentimiento</h2>
            <p><strong>I.1. Ejercicio ARCO.</strong> Envía solicitud a atencion@viajeromex.com con: Nombre completo y copia de identificación; descripción de los derechos a ejercer (acceso/rectificación/cancelación/oposición); datos/periodo a localizar; medio para notificar respuesta.</p>
            <p><strong>I.2. Plazos.</strong> Responderemos en máximo 20 días hábiles; de ser procedente, ejecutaremos en 15 días hábiles siguientes.</p>
            <p><strong>I.3. Prevención.</strong> Si faltara información, te requeriremos en 5 días hábiles; tendrás 10 días hábiles para completar.</p>
            <p><strong>I.4. Limitación de uso/divulgación.</strong> Puedes solicitar inscripción/actualización en nuestros listados de no contacto (opt-out marketing).</p>
            <p><strong>I.5. Revocación.</strong> Puedes revocar tu consentimiento para finalidades no indispensables; en finalidades primarias, la revocación puede imposibilitar la prestación/continuidad del servicio.</p>
            <p><strong>I.6. Medios alternos.</strong> También puedes ejercer derechos a través de representante legal con poderes suficientes.</p>

            <h2>J. Menores y personas con capacidad limitada</h2>
            <p><strong>J.1.</strong> No recabamos intencionalmente datos de menores de 18 años sin consentimiento de madre/padre/tutor.</p>
            <p><strong>J.2.</strong> Si detectamos registro sin autorización, procederemos a supresión.</p>
            <p><strong>J.3.</strong> Para accesos a experiencias con restricción de edad (p. ej., alcohol), se podrá solicitar identificación.</p>

            <h2>K. Cookies, web beacons y tecnologías similares</h2>
            <p><strong>K.1. Finalidad.</strong> Usamos cookies y tecnologías afines para: (i) recordar sesión/preferencias (idioma, zona horaria), (ii) analítica de uso y desempeño del sitio, (iii) seguridad y prevención de fraude, (iv) eventualmente publicidad y retargeting.</p>
            <p><strong>K.2. Tipos.</strong> Esenciales: funcionamiento del sitio/checkout. De desempeño/analítica: métricas y mejoras (p. ej., páginas visitadas, tiempo de sesión). Funcionales: recordar opciones del usuario. Publicidad: mostrar anuncios relevantes (si se habilitan).</p>
            <p><strong>K.3. Gestión.</strong> Puedes deshabilitarlas en tu navegador o configurar preferencias; desactivar cookies esenciales puede afectar el funcionamiento.</p>
            <p><strong>K.4. Señales “Do Not Track”.</strong> Si tu navegador envía DNT, haremos esfuerzos razonables para respetar dicha preferencia conforme a nuestras capacidades técnicas.</p>
            <p><strong>K.5. Terceros.</strong> Herramientas analíticas/ads de terceros (si se usan) operan con sus propias políticas; te sugerimos revisarlas.</p>

            <h2>L. Decisiones automatizadas y perfilamiento</h2>
            <p><strong>L.1.</strong> No adoptamos decisiones automatizadas que produzcan efectos legales significativos.</p>
            <p><strong>L.2.</strong> Podemos realizar perfilamiento básico (segmentos por destino/horarios/frecuencia) para mejorar comunicaciones; puedes oponerte vía ARCO.</p>

            <h2>M. Uso de imagen en eventos/experiencias</h2>
            <p><strong>M.1.</strong> En actividades organizadas por VIAJEROMEX podremos registrar foto/video/voz para documentación y promoción.</p>
            <p><strong>M.2.</strong> Antes de la captura con fines promocionales procuraremos señalización o cláusula visible; podrás manifestar oposición razonable cuando sea viable sin afectar la operación/seguridad.</p>
            <p><strong>M.3.</strong> Cuando se trate de menores, requerimos consentimiento del tutor.</p>

            <h2>N. Transferencias internacionales y hosting</h2>
            <p><strong>N.1.</strong> Algunos proveedores tecnológicos pueden hospedar o procesar datos fuera de México bajo cláusulas contractuales y salvaguardas adecuadas.</p>
            <p><strong>N.2.</strong> Adoptamos medidas para asegurar que dichos terceros mantengan estándares de seguridad y confidencialidad equivalentes.</p>

            <h2>O. Quejas y medios de defensa</h2>
            <p><strong>O.1.</strong> Si consideras que tu derecho a la protección de datos ha sido vulnerado, puedes acudir ante VIAJEROMEX (atencion@viajeromex.com).</p>
            <p><strong>O.2.</strong> También puedes presentar una queja ante el INAI conforme a los plazos y procedimientos legales.</p>

            <h2>P. Modificaciones al Aviso</h2>
            <p><strong>P.1.</strong> Podremos modificar este Aviso por cambios legales, regulatorios, contractuales, tecnológicos u operativos.</p>
            <p><strong>P.2.</strong> La versión vigente estará disponible en VIAJEROMEX.com y entrará en vigor desde su publicación. Recomendamos revisarlo periódicamente.</p>

            <h2>Q. Aceptación</h2>
            <p><strong>Q.1.</strong> Al proporcionar datos, navegar en el sitio, enviar formularios, contratar o asistir a eventos/experiencias, declaras que leíste y aceptas este Aviso.</p>
            <p><strong>Q.2.</strong> Para finalidades secundarias y/o datos sensibles, recabaremos tu consentimiento expreso.</p>
            
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}