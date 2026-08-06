<script setup lang="ts">
/**
 * What CI-RCT actually outputs — SCHEMATIC.
 *
 * Two rankings of the same candidate causes: one by correlation with the
 * model's output (what a saliency-style explainer gives you), one by causal
 * responsibility measured under intervention. The point of the picture is that
 * the two orderings disagree, which is the whole argument for doing the harder
 * thing.
 *
 * Illustrative values — the ordering reflects the method's premise, not a
 * specific experimental run.
 */
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const isZh = computed(() => locale.value.startsWith('zh'))

interface Cause {
  id: string
  en: string
  zh: string
  /** Correlation with the model output. */
  correlation: number
  /** Responsibility measured under do(·). */
  causal: number
}

const CAUSES: readonly Cause[] = [
  { id: 'ring', en: 'transfer ring', zh: '轉帳環', correlation: 0.61, causal: 0.88 },
  { id: 'wallet', en: 'shared wallet', zh: '共用錢包', correlation: 0.83, causal: 0.72 },
  { id: 'device', en: 'device fingerprint', zh: '裝置指紋', correlation: 0.74, causal: 0.29 },
  { id: 'timing', en: 'burst timing', zh: '爆量時序', correlation: 0.52, causal: 0.18 },
]

type Mode = 'causal' | 'correlation'
const mode = ref<Mode>('causal')

/** Bars re-sort as the mode changes; the reorder is the message. */
const ranked = computed(() =>
  [...CAUSES].sort((a, b) =>
    mode.value === 'causal' ? b.causal - a.causal : b.correlation - a.correlation,
  ),
)

function valueOf(cause: Cause): number {
  return mode.value === 'causal' ? cause.causal : cause.correlation
}

function labelOf(cause: Cause): string {
  return isZh.value ? cause.zh : cause.en
}

const ROW_H = 46
const BAR_X = 132
const BAR_W = 210
</script>

<template>
  <figure class="m-0">
    <!-- Mode switch -->
    <div class="flex items-center gap-1 mb-4" role="group">
      <button
        v-for="option in (['causal', 'correlation'] as Mode[])"
        :key="option"
        type="button"
        class="px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-wider transition-colors"
        :class="
          mode === option
            ? 'bg-violet-500/15 text-violet-300 border border-violet-500/40'
            : 'text-paper-500 border border-transparent hover:text-paper-300'
        "
        :aria-pressed="mode === option"
        @click="mode = option"
      >
        {{
          option === 'causal'
            ? isZh
              ? '因果責任'
              : 'causal'
            : isZh
              ? '相關性'
              : 'correlation'
        }}
      </button>
    </div>

    <svg
      :viewBox="`0 0 380 ${CAUSES.length * ROW_H + 14}`"
      class="w-full h-auto"
      role="img"
      :aria-label="
        isZh
          ? '候選原因在因果責任與相關性兩種排序下的比較'
          : 'Candidate causes ranked by causal responsibility versus by correlation'
      "
    >
      <g>
        <g
          v-for="(cause, i) in ranked"
          :key="cause.id"
          :style="{ transform: `translateY(${i * ROW_H}px)`, transition: 'transform 520ms cubic-bezier(0.22, 1, 0.36, 1)' }"
        >
          <text
            :x="BAR_X - 12"
            y="18"
            text-anchor="end"
            class="font-mono fill-paper-300"
            font-size="10"
          >
            {{ labelOf(cause) }}
          </text>

          <!-- Track -->
          <rect :x="BAR_X" y="8" :width="BAR_W" height="12" rx="6" fill="#18202F" />
          <!-- Value -->
          <rect
            :x="BAR_X"
            y="8"
            :width="BAR_W * valueOf(cause)"
            height="12"
            rx="6"
            :fill="mode === 'causal' ? '#7C6AFF' : '#2E3A50'"
            style="transition: width 520ms cubic-bezier(0.22, 1, 0.36, 1), fill 300ms"
          />

          <text
            :x="BAR_X + BAR_W + 10"
            y="18"
            class="font-mono fill-paper-500 tabular-nums"
            font-size="10"
          >
            {{ valueOf(cause).toFixed(2) }}
          </text>
        </g>
      </g>
    </svg>

    <p class="mt-2 font-mono text-[10px] text-paper-500">
      {{ isZh ? '示意值，非單次實驗結果' : 'Illustrative — not a single experimental run' }}
    </p>
  </figure>
</template>
