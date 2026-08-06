<script setup lang="ts">
/**
 * ROC comparison for the stroke-prediction study — SCHEMATIC.
 *
 * The repository reports the comparison qualitatively (GAM has the highest
 * AUC, Random Forest the best sensitivity and F1, XGBoost the best accuracy
 * and specificity) and keeps the exact figures in a chart image, so this draws
 * the *shape* of that result and deliberately shows no numbers. The legend
 * states only what the repository states.
 *
 * TODO: swap `separation` for the real AUCs and re-enable numeric labels once
 * the measured values are available.
 */
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const W = 400
const H = 300
const PAD = { left: 42, right: 16, top: 16, bottom: 38 }

interface Model {
  id: string
  label: string
  /** Schematic curve separation only — NOT a measured AUC. */
  separation: number
  /** The strength this model is documented as having in the study. */
  strengthKey: 'gam' | 'rf' | 'xgb'
  colour: string
}

const MODELS: readonly Model[] = [
  { id: 'gam', label: 'GAM', separation: 0.86, strengthKey: 'gam', colour: '#F5B841' },
  { id: 'rf', label: 'Random Forest', separation: 0.81, strengthKey: 'rf', colour: '#7C6AFF' },
  { id: 'xgb', label: 'XGBoost', separation: 0.835, strengthKey: 'xgb', colour: '#B6A9FF' },
]

/** Documented strengths, straight from the study's own conclusions. */
const STRENGTHS: Record<Model['strengthKey'], { en: string; zh: string }> = {
  gam: { en: 'best overall discrimination', zh: '整體判別力最佳' },
  rf: { en: 'best sensitivity & F1', zh: '敏感度與 F1 最佳' },
  xgb: { en: 'best accuracy & specificity', zh: '準確率與特異度最佳' },
}

const active = ref<string | null>(null)

const plotW = W - PAD.left - PAD.right
const plotH = H - PAD.top - PAD.bottom

/**
 * Binormal ROC: TPR = Phi(a + Phi^-1(FPR)). `separation` sets how far the
 * curve bows towards the top-left corner.
 */
function rocPath(separation: number): string {
  const a = Math.SQRT2 * inverseNormalCdf(separation)
  const points: string[] = []
  const steps = 60

  for (let i = 0; i <= steps; i++) {
    const fpr = i / steps
    const clamped = Math.min(0.9995, Math.max(0.0005, fpr))
    const tpr = normalCdf(a + inverseNormalCdf(clamped))
    const x = PAD.left + fpr * plotW
    const y = PAD.top + (1 - tpr) * plotH
    points.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`)
  }
  return points.join(' ')
}

/** Abramowitz & Stegun 7.1.26 style approximation of the normal CDF. */
function normalCdf(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z))
  const d = 0.3989423 * Math.exp((-z * z) / 2)
  const p = d * t * (1.330274429 * t ** 4 - 1.821255978 * t ** 3 + 1.781477937 * t ** 2 - 0.356563782 * t + 0.319381530)
  return z > 0 ? 1 - p : p
}

/** Beasley–Springer–Moro style rational approximation of the normal quantile. */
function inverseNormalCdf(p: number): number {
  const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239] as const
  const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572] as const
  const c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783] as const
  const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416] as const
  const pLow = 0.02425
  const pHigh = 1 - pLow

  if (p < pLow) {
    const q = Math.sqrt(-2 * Math.log(p))
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
  }
  if (p > pHigh) {
    const q = Math.sqrt(-2 * Math.log(1 - p))
    return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
  }
  const q = p - 0.5
  const r = q * q
  return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
    (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)
}

const curves = computed(() => MODELS.map((model) => ({ ...model, d: rocPath(model.separation) })))

const isZh = computed(() => locale.value.startsWith('zh'))

function strengthFor(model: Model): string {
  const strength = STRENGTHS[model.strengthKey]
  return isZh.value ? strength.zh : strength.en
}

function opacityFor(id: string): number {
  if (active.value === null) return 1
  return active.value === id ? 1 : 0.2
}
</script>

<template>
  <figure class="m-0">
    <svg
      viewBox="0 0 400 300"
      class="w-full h-auto"
      role="img"
      aria-label="Schematic ROC comparison of GAM, Random Forest and XGBoost stroke prediction models."
    >
      <!-- Grid -->
      <g stroke="#18202F" stroke-width="1">
        <line
          v-for="i in 4"
          :key="`v${i}`"
          :x1="PAD.left + (i / 4) * plotW"
          :y1="PAD.top"
          :x2="PAD.left + (i / 4) * plotW"
          :y2="PAD.top + plotH"
        />
        <line
          v-for="i in 4"
          :key="`h${i}`"
          :x1="PAD.left"
          :y1="PAD.top + (i / 4) * plotH"
          :x2="PAD.left + plotW"
          :y2="PAD.top + (i / 4) * plotH"
        />
      </g>

      <!-- Chance diagonal -->
      <line
        :x1="PAD.left"
        :y1="PAD.top + plotH"
        :x2="PAD.left + plotW"
        :y2="PAD.top"
        stroke="#2E3A50"
        stroke-width="1"
        stroke-dasharray="4 4"
      />

      <!-- Curves -->
      <g fill="none" stroke-width="2" stroke-linecap="round">
        <path
          v-for="curve in curves"
          :key="curve.id"
          :d="curve.d"
          :stroke="curve.colour"
          :opacity="opacityFor(curve.id)"
          class="transition-opacity duration-300"
        />
      </g>

      <!-- Axes -->
      <g stroke="#2E3A50" stroke-width="1">
        <line :x1="PAD.left" :y1="PAD.top" :x2="PAD.left" :y2="PAD.top + plotH" />
        <line :x1="PAD.left" :y1="PAD.top + plotH" :x2="PAD.left + plotW" :y2="PAD.top + plotH" />
      </g>

      <g class="font-mono fill-paper-500" font-size="9">
        <text :x="PAD.left - 8" :y="PAD.top + 8" text-anchor="end">1.0</text>
        <text :x="PAD.left - 8" :y="PAD.top + plotH" text-anchor="end">0</text>
        <text :x="PAD.left" :y="PAD.top + plotH + 16" text-anchor="start">FPR</text>
        <text :x="PAD.left - 8" :y="PAD.top + plotH / 2" text-anchor="end">TPR</text>
      </g>
    </svg>

    <!-- Legend doubles as the isolate control -->
    <ul class="mt-3 flex flex-wrap gap-x-5 gap-y-2 list-none p-0">
      <li v-for="model in MODELS" :key="model.id">
        <button
          type="button"
          class="flex items-center gap-2 font-mono text-[11px] text-paper-400 hover:text-paper-100 transition-colors"
          @mouseenter="active = model.id"
          @mouseleave="active = null"
          @focus="active = model.id"
          @blur="active = null"
        >
          <span class="w-3 h-0.5 rounded-full" :style="{ backgroundColor: model.colour }"></span>
          {{ model.label }}
          <span class="text-paper-500">{{ strengthFor(model) }}</span>
        </button>
      </li>
    </ul>

    <p class="mt-2 font-mono text-[10px] text-paper-500">
      {{ isZh ? '示意圖，非實測曲線' : 'Schematic — not measured curves' }}
    </p>
  </figure>
</template>
