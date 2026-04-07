"use client";

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';

interface TProps {
  children: string;
}

export function T({ children }: TProps) {
  const locale = useLocale();
  const [translated, setTranslated] = useState(children);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (locale === 'es') {
      setTranslated(children);
      return;
    }

    async function fetchTranslation() {
      setLoading(true);
      console.log("🔍 Intentando traducir:", children, "al idioma:", locale);
      try {
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: children, targetLang: locale }),
        });
        const data = await res.json();
        console.log("✅ Respuesta recibida:", data);
        setTranslated(data.translated);
      } catch (e) {
        console.error("❌ Error de traducción:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchTranslation();
  }, [children, locale]);

  return (
    <span className={loading ? "opacity-50 transition-opacity" : "transition-opacity"}>
      {translated}
    </span>
  );
}