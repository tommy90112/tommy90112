import { onUnmounted, readonly, ref, type Ref } from 'vue'

/**
 * Reactive `prefers-reduced-motion: reduce`.
 *
 * Every decorative effect in `components/fx` reads this and degrades to a
 * static render rather than simply running slower — a canvas loop that still
 * spins is still motion.
 *
 * SSR- and old-browser-safe: falls back to `false` when `matchMedia` is absent.
 */
export function usePrefersReducedMotion(): Readonly<Ref<boolean>> {
  const prefersReduced = ref(false)

  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    prefersReduced.value = query.matches

    const onChange = (event: MediaQueryListEvent): void => {
      prefersReduced.value = event.matches
    }

    query.addEventListener('change', onChange)
    onUnmounted(() => query.removeEventListener('change', onChange))
  }

  return readonly(prefersReduced)
}
