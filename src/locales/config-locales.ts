// ----------------------------------------------------------------------

export type LanguageValue = 'en' | 'ru' | 'uz';

export const fallbackLng = 'en';
export const languages = ['en', 'ru', 'uz'];
export const defaultNS = 'common';
export const cookieName = 'i18next';

// ----------------------------------------------------------------------

export function i18nOptions(lng = fallbackLng, ns = defaultNS) {
  return {
    // debug: true,
    lng,
    fallbackLng,
    ns,
    defaultNS,
    fallbackNS: defaultNS,
    supportedLngs: languages,
  };
}

// ----------------------------------------------------------------------

export const changeLangMessages: Record<
  LanguageValue,
  { success: string; error: string; loading: string }
> = {
  en: {
    success: 'Language has been changed!',
    error: 'Error changing language!',
    loading: 'Loading...',
  },
  ru: {
    success: 'Язык был изменен!',
    error: 'Ошибка при смене языка!',
    loading: 'Загрузка...',
  },
  uz: {
    success: "Til o'zgartirildi!",
    error: 'Tilni oʻzgartirishda xatolik yuz berdi!',
    loading: 'Yuklanmoqda...',
  },
};
