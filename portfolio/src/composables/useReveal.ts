import { onMounted, onUnmounted, ref } from 'vue'

/**
 * Adds `is-visible` to an element the first time it scrolls into view.
 *
 * Replaces a scroll-animation library: the whole behaviour is one
 * IntersectionObserver, and it degrades to "always visible" when the API is
 * missing or the user prefers reduced motion.
 *
 * Bind the returned `attach` as a function ref: `<div :ref="attach">`.
 */
export function useReveal(options: { threshold?: number; rootMargin?: string } = {}) {
  const element = ref<HTMLElement | null>(null)
  let observer: IntersectionObserver | null = null

  function attach(el: unknown): void {
    element.value = el instanceof HTMLElement ? el : null
  }

  onMounted(() => {
    const el = element.value
    if (!el) return

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-visible')
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-visible')
          observer?.unobserve(entry.target)
        }
      },
      {
        threshold: options.threshold ?? 0.12,
        rootMargin: options.rootMargin ?? '0px 0px -8% 0px',
      },
    )

    observer.observe(el)
  })

  onUnmounted(() => {
    observer?.disconnect()
    observer = null
  })

  return { attach }
}
