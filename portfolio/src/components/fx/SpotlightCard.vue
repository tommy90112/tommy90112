<script setup lang="ts">
/**
 * SpotlightCard — a glass surface with a pointer-tracking highlight, and an
 * optional 3D tilt.
 *
 * Both effects share one pointer handler and one rAF, because running a
 * separate listener per effect on a grid of a dozen cards is what makes this
 * pattern janky. Tilt is suppressed on coarse pointers (no hover to track) and
 * under reduced-motion; the spotlight degrades to a static resting glow.
 */
import { computed, onUnmounted, ref } from 'vue'
import { usePrefersReducedMotion } from '@/composables/usePrefersReducedMotion'

const props = withDefaults(
  defineProps<{
    /** Enable the 3D tilt in addition to the spotlight. */
    tilt?: boolean
    /** Max tilt in degrees at the card's corners. */
    maxTilt?: number
    /** Spotlight tint as `r, g, b`. */
    rgb?: string
    /** Spotlight radius in px. */
    radius?: number
    /** Rendered element — use `article`/`li` where the semantics call for it. */
    as?: string
  }>(),
  { tilt: false, maxTilt: 7, rgb: '124, 106, 255', radius: 340, as: 'div' },
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
  background: `radial-gradient(${props.radius}px circle at ${pointerX.value}% ${pointerY.value}%, rgba(${props.rgb}, 0.16), transparent 68%)`,
}))

const transformStyle = computed(() => {
  if (!canTilt.value) return undefined
  return {
    transform: `perspective(1000px) rotateX(${tiltX.value}deg) rotateY(${tiltY.value}deg) translateZ(0)`,
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
    class="group/spot relative isolate overflow-hidden glass-card glass-hover
           transition-transform duration-300 ease-out will-change-transform"
    :style="transformStyle"
    @pointermove="onPointerMove"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
  >
    <!-- Pointer-tracked glow -->
    <div
      class="absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 pointer-events-none"
      :class="isHovered ? 'opacity-100' : ''"
      :style="spotlightStyle"
      aria-hidden="true"
    ></div>

    <!-- Hairline top edge — the "lit rim" that sells the glass. -->
    <div
      class="absolute inset-x-0 top-0 h-px -z-10 bg-gradient-to-r from-transparent
             via-white/25 to-transparent opacity-60 pointer-events-none"
      aria-hidden="true"
    ></div>

    <slot />
  </component>
</template>
