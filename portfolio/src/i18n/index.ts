import { createI18n } from 'vue-i18n'
import en from './en'
import zhTW from './zh-TW'

export const SUPPORTED_LOCALES = ['en', 'zh-TW'] as const
export type Locale = (typeof SUPPORTED_LOCALES)[number]

const STORAGE_KEY = 'portfolio-locale'

function isSupported(value: string | null): value is Locale {
  return value !== null && (SUPPORTED_LOCALES as readonly string[]).includes(value)
}

/**
 * Resolve the starting locale: an explicit past choice wins, otherwise fall
 * back to the browser's preference, otherwise English.
 */
function resolveInitialLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (isSupported(stored)) return stored
  } catch {
    // localStorage can throw in private-browsing modes; the default is fine.
  }

  const preferred = typeof navigator !== 'undefined' ? navigator.language : ''
  if (preferred.toLowerCase().startsWith('zh')) return 'zh-TW'
  return 'en'
}

export function persistLocale(locale: Locale): void {
  try {
    localStorage.setItem(STORAGE_KEY, locale)
  } catch {
    // Persisting is a convenience, never a requirement.
  }
  if (typeof document !== 'undefined') {
    document.documentElement.lang = locale
  }
}

const initialLocale = resolveInitialLocale()

const i18n = createI18n({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: 'en',
  messages: {
    en,
    'zh-TW': zhTW,
  },
})

persistLocale(initialLocale)

export default i18n
