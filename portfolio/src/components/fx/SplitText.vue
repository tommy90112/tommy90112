<script setup lang="ts">
/**
 * SplitText — staggered per-token entrance for a line of copy.
 *
 * Tokenisation is script-aware, which matters because this site is bilingual:
 * CJK characters animate one glyph at a time, while Latin words animate as a
 * whole. Splitting Latin per-letter would let a word break mid-token across
 * lines, which reads as a layout bug rather than an effect.
 *
 * The visible text is duplicated into `aria-label` and the animated spans are
 * hidden from assistive tech, so screen readers get one clean string.
 */
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { usePrefersReducedMotion } from '@/composables/usePrefersReducedMotion'

const props = withDefaults(
  defineProps<{
    text: string
    /** ms between consecutive tokens. */
    stagger?: number
    /** ms before the first token starts. */
    delay?: number
    /** Start on mount, or the first time the element scrolls into view. */
    trigger?: 'mount' | 'view'
  }>(),
  { stagger: 34, delay: 0, trigger: 'view' },
)

const prefersReduced = usePrefersReducedMotion()
const rootRef = ref<HTMLElement | null>(null)
const started = ref(false)

let observer: IntersectionObserver | null = null

/** Matches one CJK ideograph, kana, or fullwidth punctuation mark. */
const CJK = /[　-〿぀-ヿ㐀-䶿一-鿿豈-﫿＀-￯]/

interface Token {
  value: string
  /** Whitespace renders as a plain gap and is not animated or indexed. */
  isSpace: boolean
}

const tokens = computed<Token[]>(() => {
  const out: Token[] = []
  let buffer = ''

  const flush = (): void => {
    if (buffer) {
      out.push({ value: buffer, isSpace: false })
      buffer = ''
    }
  }

  for (const char of props.text) {
    if (/\s/.test(char)) {
      flush()
      out.push({ value: char, isSpace: true })
    } else if (CJK.test(char)) {
      flush()
      out.push({ value: char, isSpace: false })
    } else {
      buffer += char
    }
  }
  flush()

  return out
})

/** Animation index skips whitespace so gaps don't eat a stagger beat. */
const animatedIndices = computed(() => {
  let index = 0
  return tokens.value.map((token) => (token.isSpace ? -1 : index++))
})

function tokenStyle(position: number): Record<string, string> | undefined {
  const index = animatedIndices.value[position]
  if (index === undefined || index < 0) return undefined
  return { transitionDelay: `${props.delay + index * props.stagger}ms` }
}

function start(): void {
  started.value = true
}

onMounted(() => {
  if (prefersReduced.value || props.trigger === 'mount') {
    // Next frame, so the initial hidden state is painted first and the
    // transition actually runs instead of being skipped.
    requestAnimationFrame(start)
    return
  }

  const el = rootRef.value
  if (!el || typeof IntersectionObserver === 'undefined') {
    start()
    return
  }

  observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) return
      start()
      observer?.disconnect()
    },
    { threshold: 0.2 },
  )
  observer.observe(el)
})

// Re-run the entrance when the copy changes (e.g. the language toggle).
watch(
  () => props.text,
  () => {
    if (!started.value) return
    started.value = false
    requestAnimationFrame(() => requestAnimationFrame(start))
  },
)

onUnmounted(() => observer?.disconnect())
</script>

<template>
  <span ref="rootRef" class="inline" :aria-label="props.text">
    <span
      v-for="(token, i) in tokens"
      :key="`${i}-${token.value}`"
      aria-hidden="true"
      class="inline-block whitespace-pre will-change-transform
             transition-[opacity,transform,filter] duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
      :class="started ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-[0.45em] blur-[6px]'"
      :style="tokenStyle(i)"
      >{{ token.value }}</span
    >
  </span>
</template>
