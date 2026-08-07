<script setup lang="ts">
/**
 * TiltedCard — a stronger 3D tilt with a moving specular sheen.
 *
 * Distinct from `SpotlightCard`'s optional tilt: this one leans further, adds
 * a directional gloss band, and floats its contents on a forward Z plane so
 * the card reads as a physical pane rather than a shaded rectangle. Reserved
 * for one or two hero-weight surfaces — used on every card it becomes noise.
 */
import { computed, onUnmounted, ref } from 'vue'
import { usePrefersReducedMotion } from '@/composables/usePrefersReducedMotion'

const props = withDefaults(
  defineProps<{
    /** Max tilt in degrees at the card's corners. */
    maxTilt?: number
    /** px the inner content is pushed toward the viewer. */
    depth?: number
  }>(),
  { maxTilt: 11, depth: 34 },
)

const prefersReduced = usePrefersReducedMotion()
const rootRef = ref<HTMLElement | null>(null)

const isHovered = ref(false)
const tiltX = ref(0)
const tiltY = ref(0)
const sheenX = ref(50)
const sheenY = ref(50)

let frameId = 0
let pendingEvent: PointerEvent | null = null

const enabled = computed(
  () =>
    !prefersReduced.value &&
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches,
)

const rootStyle = computed(() => {
  if (!enabled.value) return undefined
  return {
    transform: `perspective(1100px) rotateX(${tiltX.value}deg) rotateY(${tiltY.value}deg) scale(${isHovered.value ? 1.015 : 1})`,
  }
})

const innerStyle = computed(() => {
  if (!enabled.value || !isHovered.value) return undefined
  return { transform: `translateZ(${props.depth}px)` }
})

const sheenStyle = computed(() => ({
  background: `radial-gradient(420px circle at ${sheenX.value}% ${sheenY.value}%, rgba(255,255,255,0.16), transparent 60%)`,
}))

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

  sheenX.value = relX * 100
  sheenY.value = relY * 100
  tiltX.value = (0.5 - relY) * 2 * props.maxTilt
  tiltY.value = (relX - 0.5) * 2 * props.maxTilt
}

function onPointerMove(event: PointerEvent): void {
  if (!enabled.value) return
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
  sheenX.value = 50
  sheenY.value = 50
}

onUnmounted(() => {
  if (frameId) cancelAnimationFrame(frameId)
})
</script>

<template>
  <div
    ref="rootRef"
    class="relative isolate overflow-hidden glass-card [transform-style:preserve-3d]
           transition-transform duration-[400ms] ease-out will-change-transform"
    :style="rootStyle"
    @pointermove="onPointerMove"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
  >
    <!-- Specular sheen -->
    <div
      class="absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 pointer-events-none"
      :class="isHovered ? 'opacity-100' : ''"
      :style="sheenStyle"
      aria-hidden="true"
    ></div>

    <div
      class="absolute inset-x-0 top-0 h-px -z-10 bg-gradient-to-r from-transparent
             via-white/30 to-transparent pointer-events-none"
      aria-hidden="true"
    ></div>

    <div class="transition-transform duration-[400ms] ease-out" :style="innerStyle">
      <slot />
    </div>
  </div>
</template>
