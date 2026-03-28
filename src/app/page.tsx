import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Experiences } from "@/components/Experiences";
import { Pricing } from "@/components/Pricing";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { FifaSection } from "@/components/FifaSection";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Experiences />
      <FifaSection/>
      <Pricing />
      <Contact />
      <Footer />
    </main>
  );
}
