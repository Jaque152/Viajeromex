import { LegalPage } from "@/components/LegalPage";

const sections = [
  {
    heading: "Página fuera de servicio",
    content: ""
  },
];

export default function PoliticaDeCancelacion() {
  return <LegalPage title="Política de Cancelación" sections={sections} />;
}
