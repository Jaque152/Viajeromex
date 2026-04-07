"use client";
import { T } from "@/components/T";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface LegalPageProps {
  title: string;
  sections: {
    heading: string;
    content: string;
  }[];
}

export function LegalPage({ title, sections }: LegalPageProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-12">
            <T>{title}</T>
          </h1>

          <div className="prose prose-lg max-w-none">
            {sections.map((section, index) => (
              <div key={index} className="mb-10">
                <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
                  <T>{section.heading}</T>
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  <T>{section.content}</T>
                </p>
              </div>
            ))}
          </div>

          {/* <div className="mt-16 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
             <T> Última actualización: </T>{new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div> */}
        </div>
      </main>
      <Footer />
    </div>
  );
}
