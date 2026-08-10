import { computed, onUnmounted, readonly, ref, watch, type ComputedRef, type Ref } from 'vue'

/**
 * Theme preference, persisted across visits.
 *
 * Three states rather than a boolean: `auto` is a real choice, not the absence
 * of one, and a visitor who has never touched the control should keep tracking
 * their OS setting when it flips at sunset.
 *
 * The DOM contract is a single `data-theme` attribute on `<html>`, matching the
 * selectors in `style.css`. `auto` removes the attribute so the media query
 * takes over — it never writes a resolved value, because then a later OS change
 * would be ignored.
 *
 * A pre-paint script in `index.html` applies the stored value before Vue boots;
 * this module is the source of truth from then on.
 */

export const THEME_PREFERENCES = ['auto', 'light', 'dark'] as const
export type ThemePreference = (typeof THEME_PREFERENCES)[number]

/** What the page actually renders as, once `auto` is resolved. */
export type ResolvedTheme = 'light' | 'dark'

const STORAGE_KEY = 'theme'
const DARK_QUERY = '(prefers-color-scheme: dark)'

/** Suppresses the colour cross-fade long enough for the swap, then clears it. */
const TRANSITION_MS = 400

function isPreference(value: string | null): value is ThemePreference {
  return value !== null && (THEME_PREFERENCES as readonly string[]).includes(value)
}

function readStoredPreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (isPreference(stored)) return stored
  } catch {
    // Private-browsing modes throw on access; `auto` is a safe default.
  }
  return 'auto'
}

function persistPreference(preference: ThemePreference): void {
  try {
    if (preference === 'auto') {
      localStorage.removeItem(STORAGE_KEY)
    } else {
      localStorage.setItem(STORAGE_KEY, preference)
    }
  } catch {
    // Persisting is a convenience, never a requirement.
  }
}

function systemPrefersDark(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
  return window.matchMedia(DARK_QUERY).matches
}

function applyToDocument(preference: ThemePreference): void {
  if (typeof document === 'undefined') return
  const root = document.documentElement

  if (preference === 'auto') {
    root.removeAttribute('data-theme')
  } else {
    root.setAttribute('data-theme', preference)
  }
}

// Module-level state: the theme is a single global, and every call site must
// observe the same ref rather than its own copy.
const preference = ref<ThemePreference>(readStoredPreference())
const systemDark = ref(systemPrefersDark())

let transitionTimer: ReturnType<typeof setTimeout> | undefined

/** Cross-fades the swap without leaving a global transition on every element. */
function runWithTransition(swap: () => void): void {
  if (typeof document === 'undefined') {
    swap()
    return
  }

  const root = document.documentElement
  const reduced =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (reduced) {
    swap()
    return
  }

  root.classList.add('theme-transition')
  swap()

  clearTimeout(transitionTimer)
  transitionTimer = setTimeout(() => root.classList.remove('theme-transition'), TRANSITION_MS)
}

export interface ThemeController {
  /** The stored choice, including `auto`. */
  preference: Readonly<Ref<ThemePreference>>
  /** What is actually on screen right now. */
  resolved: ComputedRef<ResolvedTheme>
  setPreference: (next: ThemePreference) => void
  /** Advances auto → light → dark → auto, for a single-button control. */
  cyclePreference: () => void
}

export function useTheme(): ThemeController {
  // Each consumer registers its own media listener and drops it on unmount, so
  // no component keeps a dangling subscription.
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    const query = window.matchMedia(DARK_QUERY)
    const onChange = (event: MediaQueryListEvent): void => {
      systemDark.value = event.matches
    }
    query.addEventListener('change', onChange)
    onUnmounted(() => query.removeEventListener('change', onChange))
  }

  const resolved = computed<ResolvedTheme>(() => {
    if (preference.value !== 'auto') return preference.value
    return systemDark.value ? 'dark' : 'light'
  })

  function setPreference(next: ThemePreference): void {
    if (next === preference.value) return
    runWithTransition(() => {
      preference.value = next
      persistPreference(next)
      applyToDocument(next)
    })
  }

  function cyclePreference(): void {
    const index = THEME_PREFERENCES.indexOf(preference.value)
    // `?? 'auto'` is unreachable — the modulo keeps the index in range — but
    // the tuple index signature is optional under `noUncheckedIndexedAccess`.
    setPreference(THEME_PREFERENCES[(index + 1) % THEME_PREFERENCES.length] ?? 'auto')
  }

  return {
    preference: readonly(preference),
    resolved,
    setPreference,
    cyclePreference,
  }
}

/**
 * Reads a themed colour token as an `"r, g, b"` channel string.
 *
 * Canvas and other imperative renderers can't use the `rgb(var(--x))` form, so
 * they sample the resolved value instead. Returns `null` when the token is
 * missing or malformed, rather than a wrong-but-plausible black.
 */
export function readThemeChannels(token: string): string | null {
  if (typeof window === 'undefined' || typeof document === 'undefined') return null

  const raw = getComputedStyle(document.documentElement).getPropertyValue(`--${token}`).trim()
  if (!raw) return null

  const channels = raw.split(/[\s,]+/).map(Number)
  if (channels.length < 3 || channels.some(Number.isNaN)) return null

  return channels.slice(0, 3).join(', ')
}

/**
 * A themed colour token, re-sampled whenever the active theme changes.
 *
 * For the canvas effects: they draw with string colours, so they need the
 * resolved value, and they need to be told when it goes stale. `fallback` is
 * used before the first paint and if the token is missing.
 */
export function useThemeChannels(token: string, fallback: string): Readonly<Ref<string>> {
  const { resolved } = useTheme()
  const channels = ref(readThemeChannels(token) ?? fallback)

  watch(
    resolved,
    () => {
      channels.value = readThemeChannels(token) ?? fallback
    },
    // `post` so the sample happens after `data-theme` has landed on the root.
    { flush: 'post' },
  )

  return readonly(channels)
}
