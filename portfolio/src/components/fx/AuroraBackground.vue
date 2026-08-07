<script setup lang="ts">
/**
 * Aurora — slow drifting colour fields behind the hero.
 *
 * Deliberately CSS-only rather than a WebGL shader: three blurred radial
 * gradients on independent transform loops read the same at this scale, cost
 * no JS frame budget, and can't fail on a machine without a GL context.
 */
import { computed } from 'vue'
import { usePrefersReducedMotion } from '@/composables/usePrefersReducedMotion'

const props = withDefaults(
  defineProps<{
    /** 0–1. Scales every layer's opacity together. */
    intensity?: number
  }>(),
  { intensity: 1 },
)

const prefersReduced = usePrefersReducedMotion()

/** Clamped so a bad prop can't wash out the text sitting on top. */
const opacity = computed(() => Math.min(Math.max(props.intensity, 0), 1))
</script>

<template>
  <div class="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    <!-- Primary violet field -->
    <div
      class="absolute -top-1/3 left-1/2 w-[min(1100px,150vw)] aspect-square -translate-x-1/2
             rounded-full blur-[110px] will-change-transform"
      :class="prefersReduced ? '' : 'animate-aurora'"
      :style="{
        opacity: 0.5 * opacity,
        background:
          'radial-gradient(circle at 50% 50%, rgba(124,106,255,0.55), rgba(124,106,255,0) 62%)',
      }"
    ></div>

    <!-- Cyan counter-field, drifting the other way -->
    <div
      class="absolute top-[8%] -left-[18%] w-[min(820px,110vw)] aspect-square
             rounded-full blur-[120px] will-change-transform"
      :class="prefersReduced ? '' : 'animate-aurora-slow'"
      :style="{
        opacity: 0.38 * opacity,
        background:
          'radial-gradient(circle at 50% 50%, rgba(34,184,209,0.45), rgba(34,184,209,0) 65%)',
      }"
    ></div>

    <!-- Amber warm accent, low and to the right -->
    <div
      class="absolute -bottom-1/4 -right-[12%] w-[min(760px,100vw)] aspect-square
             rounded-full blur-[130px] will-change-transform"
      :class="prefersReduced ? '' : 'animate-float'"
      :style="{
        opacity: 0.26 * opacity,
        background:
          'radial-gradient(circle at 50% 50%, rgba(245,184,65,0.42), rgba(245,184,65,0) 65%)',
      }"
    ></div>

    <!-- Fades the whole aurora into the page background at the bottom edge. -->
    <div
      class="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-ink-950"
    ></div>
  </div>
</template>
