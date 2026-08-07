<script setup lang="ts">
/**
 * Project card, in three bento layouts driven by `span` + `viz`:
 *
 *  - `feature`  — full-row card with the visual beside the copy
 *  - `stacked`  — half-row card with the visual above the copy
 *  - `compact`  — no visual; copy only, laid out horizontally when full-row
 *
 * Which one applies is derived, not configured: a project with no visual can't
 * be a feature card, and a half-row card is too narrow to sit a 400×300 chart
 * next to text.
 */
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Project } from '@/data/site'
import SpotlightCard from '@/components/fx/SpotlightCard.vue'
import ProjectLinks from '@/components/ProjectLinks.vue'
import AttributionViz from '@/components/viz/AttributionViz.vue'
import NetworkViz from '@/components/viz/NetworkViz.vue'
import ShockwaveViz from '@/components/viz/ShockwaveViz.vue'
import RocViz from '@/components/viz/RocViz.vue'

const props = defineProps<{ project: Project; index: number }>()

const { t, te } = useI18n()

const base = computed(() => `projects.items.${props.project.id}`)

const VIZ_COMPONENTS = {
  attribution: AttributionViz,
  network: NetworkViz,
  shockwave: ShockwaveViz,
  roc: RocViz,
} as const

const vizComponent = computed(() => {
  const kind = props.project.viz
  if (!kind || !(kind in VIZ_COMPONENTS)) return null
  return VIZ_COMPONENTS[kind as keyof typeof VIZ_COMPONENTS]
})

type Layout = 'feature' | 'stacked' | 'compact'

const layout = computed<Layout>(() => {
  if (!vizComponent.value) return 'compact'
  return props.project.span === 'full' ? 'feature' : 'stacked'
})

/** Compact full-row cards read better as a horizontal strip than a tall block. */
const isCompactRow = computed(() => layout.value === 'compact' && props.project.span === 'full')

const captionKey = computed(() => `${base.value}.vizCaption`)
const hasCaption = computed(() => te(captionKey.value))

const metrics = computed(() =>
  ([1, 2, 3] as const).map((n) => ({
    value: t(`${base.value}.metric${n}`),
    label: t(`${base.value}.metric${n}Label`),
  })),
)

const accentRgb = computed(() => (props.project.featured ? '124, 106, 255' : '72, 211, 232'))
</script>

<template>
  <SpotlightCard
    as="article"
    tilt
    :max-tilt="4"
    :rgb="accentRgb"
    :radius="460"
    class="h-full"
    :class="project.featured ? '!border-violet-500/25' : ''"
  >
    <div
      class="h-full"
      :class="{
        'grid lg:grid-cols-2': layout === 'feature',
        'flex flex-col': layout === 'stacked',
        'flex flex-col lg:flex-row lg:items-center lg:gap-10 p-7 md:p-9': isCompactRow,
        'flex flex-col p-7 md:p-9': layout === 'compact' && !isCompactRow,
      }"
    >
      <!-- Visual (feature: right column, stacked: on top) -->
      <div
        v-if="vizComponent"
        class="relative bg-white/[0.02]"
        :class="
          layout === 'feature'
            ? 'order-last lg:order-none lg:col-start-2 p-7 md:p-9 border-t lg:border-t-0 lg:border-l border-white/[0.07] flex flex-col justify-center'
            : 'p-6 md:p-7 border-b border-white/[0.07]'
        "
      >
        <component :is="vizComponent" />
        <p v-if="hasCaption" class="mt-4 font-mono text-[11px] leading-relaxed text-paper-500">
          {{ t(captionKey) }}
        </p>
      </div>

      <!-- Copy -->
      <div
        class="flex flex-col"
        :class="{
          'p-7 md:p-9 lg:col-start-1 lg:row-start-1': layout === 'feature',
          'p-7 md:p-8 flex-1': layout === 'stacked',
          'lg:flex-1': isCompactRow,
        }"
      >
        <div class="flex flex-wrap items-center gap-3 mb-4">
          <span class="font-mono text-[11px] text-paper-500 tabular-nums">
            {{ String(index + 1).padStart(2, '0') }}
          </span>
          <span
            v-if="project.featured && !project.repo"
            class="chip !border-violet-500/40 !text-violet-300"
          >
            {{ t('projects.thesisBadge') }}
          </span>
        </div>

        <h3 class="h-display text-display-sm text-paper-50 mb-1.5">
          {{ t(`${base}.name`) }}
        </h3>
        <p class="font-mono text-xs text-violet-400 mb-5">{{ t(`${base}.tagline`) }}</p>

        <p class="text-sm text-paper-300 leading-relaxed text-pretty mb-7">
          {{ t(`${base}.description`) }}
        </p>

        <!-- Metrics -->
        <dl
          class="grid grid-cols-3 gap-4 mb-7 m-0"
          :class="isCompactRow ? 'lg:hidden' : ''"
        >
          <div v-for="metric in metrics" :key="metric.label">
            <dt class="sr-only">{{ metric.label }}</dt>
            <dd class="m-0">
              <span class="block h-display text-xl text-paper-50">{{ metric.value }}</span>
              <span class="block mt-1 font-mono text-[10px] leading-snug text-paper-500">
                {{ metric.label }}
              </span>
            </dd>
          </div>
        </dl>

        <!-- Stack -->
        <ul class="flex flex-wrap gap-2 list-none p-0 m-0 mb-7">
          <li v-for="tech in project.stack" :key="tech" class="chip">{{ tech }}</li>
        </ul>

        <ProjectLinks :project="project" class="mt-auto" />
      </div>

      <!-- Compact full-row cards move metrics into a side rail. -->
      <dl
        v-if="isCompactRow"
        class="hidden lg:grid grid-cols-3 gap-6 lg:w-[38%] shrink-0 m-0
               lg:border-l lg:border-white/[0.07] lg:pl-10"
      >
        <div v-for="metric in metrics" :key="metric.label">
          <dt class="sr-only">{{ metric.label }}</dt>
          <dd class="m-0">
            <span class="block h-display text-2xl text-paper-50">{{ metric.value }}</span>
            <span class="block mt-1 font-mono text-[10px] leading-snug text-paper-500">
              {{ metric.label }}
            </span>
          </dd>
        </div>
      </dl>
    </div>
  </SpotlightCard>
</template>
