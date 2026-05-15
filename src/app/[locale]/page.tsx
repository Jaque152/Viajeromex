import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Experiences } from "@/components/Experiences";
import { Pricing } from "@/components/Pricing";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { FifaSection } from "@/components/FifaSection";
import { AboutServices } from "@/components/AboutServices";

type Props = {
  params: Promise<{ locale: string }>;
};
export default async function Home({ params }: Props) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <AboutServices />
      <Experiences/>
      <FifaSection/>
      <Pricing />
      <Contact />
      <Footer />
    </main>
  );
}
