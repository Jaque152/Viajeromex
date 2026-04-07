import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const DEEPL_API_KEY = process.env.DEEPL_API_KEY;

export async function POST(req: Request) {
  let text = ""; 
  try {
    const body = await req.json();
    text = body.text;
    const targetLang = body.targetLang;

    if (targetLang === 'es') return NextResponse.json({ translated: text });

    // 1. Buscar en Caché (Supabase)
    const { data: existing, error: supabaseError } = await supabase
      .from('translations')
      .select('translated_text')
      .eq('key_text', text)
      .eq('lang', targetLang)
      .single();

    if (existing) {
      return NextResponse.json({ translated: existing.translated_text });
    }

    // 2. Si no existe, llamar a DeepL 
    const response = await fetch(`https://api-free.deepl.com/v2/translate`, {
      method: 'POST',
      headers: { 
        'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        text: [text],
        target_lang: targetLang.toUpperCase(),
        source_lang: 'ES'
      }),
    });

    const data = await response.json();

    // Validar si DeepL mandó un error en lugar de traducciones
    if (!data.translations || data.translations.length === 0) {
      console.error("❌ DeepL rechazó la petición. Respuesta cruda:", data);
      throw new Error("DeepL no devolvió traducciones.");
    }

    const translatedText = data.translations[0].text;

    // 3. Guardar en Supabase para la próxima vez
    await supabase.from('translations').insert({
      key_text: text,
      lang: targetLang,
      translated_text: translatedText
    });

    return NextResponse.json({ translated: translatedText });
  } catch (error) {
    console.error("Error en Traducción:", error);
    
    return NextResponse.json({ translated: text }, { status: 500 });
  }
}