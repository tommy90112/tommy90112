<script setup lang="ts">
/**
 * A panel with a pointer-tracking highlight, and an optional 3D tilt.
 *
 * Both effects share one pointer handler and one rAF, because running a
 * separate listener per effect on a grid of a dozen cards is what makes this
 * pattern janky. Tilt is suppressed on coarse pointers (no hover to track) and
 * under reduced-motion; the highlight simply never appears.
 *
 * The highlight is the accent at very low alpha rather than a configurable
 * tint. Per-card colours meant a project grid lit up in three different hues
 * on hover, which read as a bug rather than as a system.
 */
import { computed, onUnmounted, ref } from 'vue'
import { usePrefersReducedMotion } from '@/composables/usePrefersReducedMotion'

const props = withDefaults(
  defineProps<{
    /** Enable the 3D tilt in addition to the highlight. */
    tilt?: boolean
    /** Max tilt in degrees at the card's corners. */
    maxTilt?: number
    /** Highlight radius in px. */
    radius?: number
    /** Rendered element — use `article`/`li` where the semantics call for it. */
    as?: string
  }>(),
  { tilt: false, maxTilt: 5, radius: 420, as: 'div' },
)

const prefersReduced = usePrefersReducedMotion()
const rootRef = ref<HTMLElement | null>(null)

const isHovered = ref(false)
const pointerX = ref(50)
const pointerY = ref(50)
const tiltX = ref(0)
const tiltY = ref(0)

let frameId = 0
let pendingEvent: PointerEvent | null = null

const canTilt = computed(
  () =>
    props.tilt &&
    !prefersReduced.value &&
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches,
)

const spotlightStyle = computed(() => ({
  background: `radial-gradient(${props.radius}px circle at ${pointerX.value}% ${pointerY.value}%, rgb(var(--accent) / 0.09), transparent 70%)`,
}))

const transformStyle = computed(() => {
  if (!canTilt.value) return undefined
  return {
    transform: `perspective(1200px) rotateX(${tiltX.value}deg) rotateY(${tiltY.value}deg) translateZ(0)`,
  }
})

function applyPointer(): void {
  frameId = 0
  const event = pendingEvent
  const el = rootRef.value
  pendingEvent = null
  if (!event || !el) return

  const rect = el.getBoundingClientRect()
  if (rect.width === 0 || rect.height === 0) return

  const relX = (event.clientX - rect.left) / rect.width
  const relY = (event.clientY - rect.top) / rect.height

  pointerX.value = relX * 100
  pointerY.value = relY * 100

  if (!canTilt.value) return
  // Invert Y so the card leans toward the pointer, not away from it.
  tiltX.value = (0.5 - relY) * 2 * props.maxTilt
  tiltY.value = (relX - 0.5) * 2 * props.maxTilt
}

function onPointerMove(event: PointerEvent): void {
  pendingEvent = event
  if (frameId) return
  frameId = requestAnimationFrame(applyPointer)
}

function onPointerEnter(): void {
  isHovered.value = true
}

function onPointerLeave(): void {
  isHovered.value = false
  tiltX.value = 0
  tiltY.value = 0
  pointerX.value = 50
  pointerY.value = 50
}

onUnmounted(() => {
  if (frameId) cancelAnimationFrame(frameId)
})
</script>

<template>
  <component
    :is="props.as"
    ref="rootRef"
    class="group/spot relative isolate overflow-hidden panel panel-hover will-change-transform"
    :style="transformStyle"
    @pointermove="onPointerMove"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
  >
    <div
      class="absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 pointer-events-none"
      :class="isHovered ? 'opacity-100' : ''"
      :style="spotlightStyle"
      aria-hidden="true"
    ></div>

    <slot />
  </component>
</template>
