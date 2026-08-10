<script setup lang="ts">
/**
 * Ambient colour fields, behind the hero and the contact block.
 *
 * Deliberately CSS-only rather than a WebGL shader: three blurred radial
 * gradients on independent transform loops read the same at this scale, cost
 * no JS frame budget, and can't fail on a machine without a GL context.
 *
 * All three hues and the master alpha come from theme variables. On paper the
 * fields have to be a whisper — a wash that reads as ambient light on a dark
 * ground reads as a stain on a light one — so each theme sets its own alpha
 * rather than this component hard-coding one.
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

function field(hue: 'a' | 'b' | 'c', scale: number): Record<string, string> {
  return {
    opacity: String(scale * opacity.value),
    background: `radial-gradient(circle at 50% 50%, rgb(var(--wash-${hue}) / var(--wash-alpha)), transparent 66%)`,
  }
}
</script>

<template>
  <div class="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    <div
      class="absolute -top-1/3 left-[38%] w-[min(1000px,140vw)] aspect-square -translate-x-1/2
             rounded-full blur-[110px] will-change-transform"
      :class="prefersReduced ? '' : 'animate-drift'"
      :style="field('a', 1)"
    ></div>

    <div
      class="absolute top-[10%] -left-[16%] w-[min(760px,105vw)] aspect-square
             rounded-full blur-[120px] will-change-transform"
      :class="prefersReduced ? '' : 'animate-drift-slow'"
      :style="field('b', 0.8)"
    ></div>

    <div
      class="absolute -bottom-1/4 -right-[10%] w-[min(720px,100vw)] aspect-square
             rounded-full blur-[130px] will-change-transform"
      :class="prefersReduced ? '' : 'animate-float'"
      :style="field('c', 0.6)"
    ></div>

    <!-- Fades the whole wash into the page at the bottom edge. -->
    <div class="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-page"></div>
  </div>
</template>
