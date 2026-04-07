import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: 'es',
    lng: 'es', // Idioma inicial
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          // Aquí se guardan las traducciones automáticas
        }
      },
      es: {
        translation: {
          // texto base en español
        }
      }
    }
  });

export default i18n;