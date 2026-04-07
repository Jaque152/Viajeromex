"use client";

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';

export function useT(text: string) {
  const locale = useLocale();
  const [translated, setTranslated] = useState(text);

  useEffect(() => {
    // Si no hay texto o es español, no hace nada
    if (!text || locale === 'es') {
      setTranslated(text);
      return;
    }

    let isMounted = true;

    async function fetchTranslation() {
      try {
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, targetLang: locale }),
        });
        const data = await res.json();
        
        if (isMounted) {
          setTranslated(data.translated);
        }
      } catch (e) {
        console.error("Error traduciendo hook:", e);
      }
    }

    fetchTranslation();

    return () => { isMounted = false };
  }, [text, locale]);

  return translated;
}