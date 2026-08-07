<script setup lang="ts">
/**
 * ShinyText — a highlight sweeping across gradient-filled text.
 *
 * `background-clip: text` on an over-wide gradient, panned by the `shimmer`
 * keyframe. The base colour is baked into the gradient stops so the text stays
 * fully legible at every point in the sweep, not just when the highlight is
 * over it.
 */
import { usePrefersReducedMotion } from '@/composables/usePrefersReducedMotion'

withDefaults(
  defineProps<{
    /** Seconds for one full sweep. */
    speed?: number
  }>(),
  { speed: 4.5 },
)

const prefersReduced = usePrefersReducedMotion()
</script>

<template>
  <span
    class="text-gradient bg-[linear-gradient(110deg,#A9B4C9_35%,#FFFFFF_48%,#B6A9FF_54%,#A9B4C9_65%)]
           bg-[length:250%_100%]"
    :class="prefersReduced ? '' : 'animate-shimmer'"
    :style="prefersReduced ? undefined : { animationDuration: `${speed}s` }"
  >
    <slot />
  </span>
</template>
