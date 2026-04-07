import { LegalPage } from "@/components/LegalPage";

const sections = [
  {
    heading: "Página fuera de servicio",
    content: ""
  },
  
];

export default function AvisoDePrivacidad() {
  return <LegalPage title="Aviso de Privacidad" sections={sections} />;
}
