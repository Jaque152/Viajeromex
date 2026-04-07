import { LegalPage } from "@/components/LegalPage";

const sections = [
  {
    heading: "Página fuera de servicio",
    content: ""
  },
];

export default function TerminosYCondiciones() {
  return <LegalPage title="Términos y Condiciones" sections={sections} />;
}
