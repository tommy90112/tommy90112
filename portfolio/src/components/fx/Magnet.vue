<script setup lang="ts">
/**
 * Magnet — pulls its slot toward the pointer once inside a capture radius.
 *
 * Listens on `window` rather than the element itself, because the whole point
 * is reacting *before* the pointer arrives. The listener only attaches when
 * the effect is actually enabled, so touch devices pay nothing.
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
    /** 0–1. Fraction of the pointer offset the element travels. */
    strength?: number
  }>(),
  { radius: 110, strength: 0.32 },
)

const prefersReduced = usePrefersReducedMotion()
const rootRef = ref<HTMLElement | null>(null)

const offsetX = ref(0)
const offsetY = ref(0)
const isActive = ref(false)

let frameId = 0
let pendingEvent: PointerEvent | null = null

const enabled = computed(
  () =>
    !prefersReduced.value &&
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches,
)

const style = computed(() => ({
  transform: `translate3d(${offsetX.value}px, ${offsetY.value}px, 0)`,
}))

function applyPointer(): void {
  frameId = 0
  const event = pendingEvent
  const el = rootRef.value
  pendingEvent = null
  if (!event || !el) return

  const rect = el.getBoundingClientRect()
  const centreX = rect.left + rect.width / 2
  const centreY = rect.top + rect.height / 2
  const dx = event.clientX - centreX
  const dy = event.clientY - centreY

  if (Math.hypot(dx, dy) > props.radius) {
    if (!isActive.value) return
    isActive.value = false
    offsetX.value = 0
    offsetY.value = 0
    return
  }

  isActive.value = true
  offsetX.value = dx * props.strength
  offsetY.value = dy * props.strength
}

function onPointerMove(event: PointerEvent): void {
  pendingEvent = event
  if (frameId) return
  frameId = requestAnimationFrame(applyPointer)
}

onMounted(() => {
  if (!enabled.value) return
  window.addEventListener('pointermove', onPointerMove, { passive: true })
})

onUnmounted(() => {
  if (frameId) cancelAnimationFrame(frameId)
  window.removeEventListener('pointermove', onPointerMove)
})
</script>

<template>
  <span
    ref="rootRef"
    class="inline-block will-change-transform"
    :class="isActive ? 'transition-none' : 'transition-transform duration-500 ease-out'"
    :style="enabled ? style : undefined"
  >
    <slot />
  </span>
</template>
