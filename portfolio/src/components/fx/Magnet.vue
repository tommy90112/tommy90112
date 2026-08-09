<script setup lang="ts">
/**
 * Magnet — pulls its slot toward the pointer once inside a capture radius.
 *
 * Two things this has to get right, both of which the obvious implementation
 * gets wrong:
 *
 *  - **Falloff.** Displacing by `offset × strength` alone peaks at the *edge*
 *    of the radius, so the element snaps sideways the instant the pointer
 *    crosses in. Scaling by `1 - dist/radius` puts the pull at zero on the
 *    boundary and eases it in, which is what makes it feel magnetic instead
 *    of twitchy.
 *
 *  - **Layout reads.** `getBoundingClientRect()` forces a synchronous reflow,
 *    and there is one of these per button. Measuring on every pointer frame
 *    means a reflow per instance per frame. The rect is cached and only
 *    invalidated on scroll/resize, and the listener detaches entirely while
 *    the element is off screen.
 *
 * Purely decorative: the wrapper is `inline-block` and never intercepts
 * pointer events, so the child keeps its own hit area and semantics.
 */
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { usePrefersReducedMotion } from '@/composables/usePrefersReducedMotion'

const props = withDefaults(
  defineProps<{
    /** px around the element within which the pull applies. */
    radius?: number
    /** 0–1. Peak pull, reached midway between the boundary and the centre. */
    strength?: number
  }>(),
  { radius: 130, strength: 0.55 },
)

const prefersReduced = usePrefersReducedMotion()
const rootRef = ref<HTMLElement | null>(null)

const offsetX = ref(0)
const offsetY = ref(0)
const isActive = ref(false)

let frameId = 0
let pendingEvent: PointerEvent | null = null
let cachedRect: DOMRect | null = null
let isOnScreen = false
let isListening = false
let observer: IntersectionObserver | null = null

const enabled = computed(
  () =>
    !prefersReduced.value &&
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches,
)

const style = computed(() => ({
  transform: `translate3d(${offsetX.value}px, ${offsetY.value}px, 0)`,
}))

function invalidateRect(): void {
  cachedRect = null
}

/** Measured lazily; the element's own transform never changes its layout box. */
function getRect(): DOMRect | null {
  const el = rootRef.value
  if (!el) return null
  if (!cachedRect) cachedRect = el.getBoundingClientRect()
  return cachedRect
}

function release(): void {
  if (!isActive.value) return
  isActive.value = false
  offsetX.value = 0
  offsetY.value = 0
}

function applyPointer(): void {
  frameId = 0
  const event = pendingEvent
  pendingEvent = null
  if (!event) return

  const rect = getRect()
  if (!rect) return

  const dx = event.clientX - (rect.left + rect.width / 2)
  const dy = event.clientY - (rect.top + rect.height / 2)
  const dist = Math.hypot(dx, dy)

  if (dist > props.radius) {
    release()
    return
  }

  const falloff = 1 - dist / props.radius
  isActive.value = true
  offsetX.value = dx * props.strength * falloff
  offsetY.value = dy * props.strength * falloff
}

function onPointerMove(event: PointerEvent): void {
  pendingEvent = event
  if (frameId) return
  frameId = requestAnimationFrame(applyPointer)
}

function startListening(): void {
  if (isListening) return
  isListening = true
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  window.addEventListener('scroll', invalidateRect, { passive: true })
  window.addEventListener('resize', invalidateRect)
}

function stopListening(): void {
  if (!isListening) return
  isListening = false
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('scroll', invalidateRect)
  window.removeEventListener('resize', invalidateRect)
  if (frameId) {
    cancelAnimationFrame(frameId)
    frameId = 0
  }
  pendingEvent = null
  release()
}

onMounted(() => {
  if (!enabled.value) return

  const el = rootRef.value
  if (!el || typeof IntersectionObserver === 'undefined') {
    startListening()
    return
  }

  observer = new IntersectionObserver(
    ([entry]) => {
      isOnScreen = Boolean(entry?.isIntersecting)
      invalidateRect()
      if (isOnScreen) startListening()
      else stopListening()
    },
    // Margin so the pull is already live as the button scrolls into view.
    { rootMargin: '120px' },
  )
  observer.observe(el)
})

onUnmounted(() => {
  stopListening()
  observer?.disconnect()
  observer = null
})
</script>

<template>
  <span
    ref="rootRef"
    class="inline-block will-change-transform transition-transform ease-out"
    :class="isActive ? 'duration-150' : 'duration-[600ms]'"
    :style="enabled ? style : undefined"
  >
    <slot />
  </span>
</template>
