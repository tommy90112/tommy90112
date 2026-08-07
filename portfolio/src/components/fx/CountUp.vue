<script setup lang="ts">
/**
 * CountUp — animates the numeric part of a stat string on first view.
 *
 * Stat copy is authored per-locale and is not always a bare number: values
 * like `60M+`, `1st`, or `~3` are all legitimate. Rather than demanding clean
 * numeric props, this parses the first number out of the string, animates it,
 * and reprints the untouched prefix and suffix around it. A string with no
 * digits at all renders verbatim.
 */
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { usePrefersReducedMotion } from '@/composables/usePrefersReducedMotion'

const props = withDefaults(
  defineProps<{
    /** The stat as authored, e.g. `60M+`. */
    value: string
    /** ms for the full count. */
    duration?: number
    /** ms before counting starts. */
    delay?: number
  }>(),
  { duration: 1600, delay: 0 },
)

const prefersReduced = usePrefersReducedMotion()
const rootRef = ref<HTMLElement | null>(null)
const progress = ref(0)

let observer: IntersectionObserver | null = null
let frameId = 0
let delayTimer: ReturnType<typeof setTimeout> | null = null

/** First number in the string, with whatever surrounds it. */
const parsed = computed(() => {
  const match = props.value.match(/-?\d+(?:[.,]\d+)?/)
  if (!match || match.index === undefined) return null

  const raw = match[0]
  const numeric = Number.parseFloat(raw.replace(',', '.'))
  if (!Number.isFinite(numeric)) return null

  const decimals = raw.split(/[.,]/)[1]?.length ?? 0

  return {
    prefix: props.value.slice(0, match.index),
    suffix: props.value.slice(match.index + raw.length),
    target: numeric,
    decimals,
  }
})

const display = computed(() => {
  const info = parsed.value
  if (!info) return props.value

  const current = info.target * progress.value
  return `${info.prefix}${current.toFixed(info.decimals)}${info.suffix}`
})

/** easeOutExpo — fast arrival, long settle. Reads as "counting up", not "sliding". */
function ease(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

function run(): void {
  if (prefersReduced.value || !parsed.value) {
    progress.value = 1
    return
  }

  const startTime = performance.now()

  const tick = (now: number): void => {
    const elapsed = now - startTime
    const t = Math.min(elapsed / props.duration, 1)
    progress.value = ease(t)
    if (t < 1) frameId = requestAnimationFrame(tick)
  }

  frameId = requestAnimationFrame(tick)
}

function scheduleRun(): void {
  if (props.delay <= 0) {
    run()
    return
  }
  delayTimer = setTimeout(run, props.delay)
}

function cleanupTimers(): void {
  cancelAnimationFrame(frameId)
  if (delayTimer) clearTimeout(delayTimer)
  delayTimer = null
}

onMounted(() => {
  const el = rootRef.value

  if (prefersReduced.value || !el || typeof IntersectionObserver === 'undefined') {
    progress.value = 1
    return
  }

  observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) return
      scheduleRun()
      observer?.disconnect()
      observer = null
    },
    { threshold: 0.4 },
  )
  observer.observe(el)
})

// Language toggle swaps the stat string; recount from zero so the new value
// doesn't just pop in mid-animation.
watch(
  () => props.value,
  () => {
    if (progress.value === 0) return
    cleanupTimers()
    progress.value = 0
    scheduleRun()
  },
)

onUnmounted(() => {
  cleanupTimers()
  observer?.disconnect()
})
</script>

<template>
  <span ref="rootRef" class="tabular-nums" :aria-label="props.value">
    <span aria-hidden="true">{{ display }}</span>
  </span>
</template>
