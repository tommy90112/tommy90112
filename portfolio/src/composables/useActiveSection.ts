import { onMounted, onUnmounted, readonly, ref, type Ref } from 'vue'

/**
 * Tracks which section id is currently the "current" one, for nav highlighting.
 *
 * Picks the entry closest to a reading line a third of the way down the
 * viewport rather than simply the first intersecting one — with tall sections
 * and a fixed header, "first intersecting" lags a full section behind what the
 * reader is actually looking at.
 */
export function useActiveSection(ids: readonly string[]): Readonly<Ref<string>> {
  const active = ref(ids[0] ?? '')

  let observer: IntersectionObserver | null = null

  function pickActive(): void {
    const line = window.innerHeight / 3
    let bestId = ''
    let bestDistance = Number.POSITIVE_INFINITY

    for (const id of ids) {
      const el = document.getElementById(id)
      if (!el) continue

      const rect = el.getBoundingClientRect()
      if (rect.bottom < 0 || rect.top > window.innerHeight) continue

      const distance = Math.abs(rect.top - line)
      if (distance < bestDistance) {
        bestDistance = distance
        bestId = id
      }
    }

    if (bestId) active.value = bestId
  }

  onMounted(() => {
    if (typeof IntersectionObserver === 'undefined') return

    // The observer is only a cheap trigger; `pickActive` does the deciding.
    observer = new IntersectionObserver(pickActive, {
      threshold: [0, 0.25, 0.5, 0.75, 1],
    })

    for (const id of ids) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }

    window.addEventListener('scroll', pickActive, { passive: true })
    pickActive()
  })

  onUnmounted(() => {
    observer?.disconnect()
    observer = null
    window.removeEventListener('scroll', pickActive)
  })

  return readonly(active)
}
