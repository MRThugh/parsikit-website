/**
 * Centralized Internationalization Architecture for ParsiKit
 * Supporting exactly four languages:
 * 1. Persian (Iran) — internal locale `fa-IR`, URL prefix `fa`, RTL
 * 2. English — internal locale `en`, URL prefix `en`, LTR
 * 3. Dari (Afghanistan) — internal locale `prs-AF`, URL prefix `prs-af`, RTL
 * 4. Tajik (Tajikistan) — internal locale `tg-TJ`, URL prefix `tg`, LTR (Cyrillic)
 */

export type SupportedLocale = 'fa-IR' | 'en' | 'prs-AF' | 'tg-TJ';
export type LangPrefix = 'fa' | 'en' | 'prs-af' | 'tg';
export type TextDirection = 'rtl' | 'ltr';

export interface LocaleMeta {
  locale: SupportedLocale;
  prefix: LangPrefix;
  direction: TextDirection;
  hreflang: string;
  nameNative: string;
  nameEnglish: string;
  shortCode: string;
  script: 'Arab' | 'Latn' | 'Cyrl';
}

export const LOCALES: Record<LangPrefix, LocaleMeta> = {
  fa: {
    locale: 'fa-IR',
    prefix: 'fa',
    direction: 'rtl',
    hreflang: 'fa-IR',
    nameNative: 'فارسی',
    nameEnglish: 'Persian (Iran)',
    shortCode: 'فا',
    script: 'Arab',
  },
  en: {
    locale: 'en',
    prefix: 'en',
    direction: 'ltr',
    hreflang: 'en',
    nameNative: 'English',
    nameEnglish: 'English',
    shortCode: 'EN',
    script: 'Latn',
  },
  'prs-af': {
    locale: 'prs-AF',
    prefix: 'prs-af',
    direction: 'rtl',
    hreflang: 'prs-AF',
    nameNative: 'دری',
    nameEnglish: 'Dari (Afghanistan)',
    shortCode: 'دری',
    script: 'Arab',
  },
  tg: {
    locale: 'tg-TJ',
    prefix: 'tg',
    direction: 'ltr',
    hreflang: 'tg-TJ',
    nameNative: 'Тоҷикӣ',
    nameEnglish: 'Tajik (Tajikistan)',
    shortCode: 'ТҶ',
    script: 'Cyrl',
  },
};

export const SUPPORTED_LANG_PREFIXES: LangPrefix[] = ['fa', 'en', 'prs-af', 'tg'];
export const DEFAULT_LANG_PREFIX: LangPrefix = 'en';

export function getLocaleFromPrefix(prefix: string): LocaleMeta {
  if (prefix in LOCALES) {
    return LOCALES[prefix as LangPrefix];
  }
  return LOCALES[DEFAULT_LANG_PREFIX];
}

export function isRtlPrefix(prefix: LangPrefix): boolean {
  return LOCALES[prefix]?.direction === 'rtl';
}
