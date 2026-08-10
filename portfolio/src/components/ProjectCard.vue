<script setup lang="ts">
/**
 * Project card, in three layouts driven by `span` + `viz`:
 *
 *  - `feature`  — full-row card with the figure beside the copy
 *  - `stacked`  — half-row card with the figure above the copy
 *  - `compact`  — no figure; copy only, laid out horizontally when full-row
 *
 * Which one applies is derived, not configured: a project with no visual can't
 * be a feature card, and a half-row card is too narrow to sit a 400×300 chart
 * next to text.
 *
 * The featured project is distinguished by an accent rule along its top edge
 * rather than by a tinted border on all four sides — a border change on a card
 * that already has a border is a difference most people never notice.
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
</script>

<template>
  <SpotlightCard as="article" class="h-full">
    <!-- Featured rule: reads at a glance, costs no chrome. -->
    <div
      v-if="project.featured"
      class="absolute inset-x-0 top-0 h-[3px] bg-accent z-10"
      aria-hidden="true"
    ></div>

    <div
      class="h-full"
      :class="{
        'grid lg:grid-cols-12': layout === 'feature',
        'flex flex-col': layout === 'stacked',
        'flex flex-col lg:flex-row lg:items-center lg:gap-10 p-6 md:p-9': isCompactRow,
        'flex flex-col p-6 md:p-9': layout === 'compact' && !isCompactRow,
      }"
    >
      <!-- Figure (feature: right seven columns, stacked: on top) -->
      <figure
        v-if="vizComponent"
        class="relative bg-surface-raised m-0"
        :class="
          layout === 'feature'
            ? 'order-last lg:order-none lg:col-span-7 lg:col-start-6 p-6 md:p-9 border-t lg:border-t-0 lg:border-l border-line flex flex-col justify-center'
            : 'p-5 md:p-7 border-b border-line'
        "
      >
        <component :is="vizComponent" />
        <figcaption
          v-if="hasCaption"
          class="mt-4 font-mono text-[10.5px] leading-relaxed text-fg-faint"
        >
          {{ t(captionKey) }}
        </figcaption>
      </figure>

      <!-- Copy -->
      <div
        class="flex flex-col"
        :class="{
          'p-6 md:p-9 lg:col-span-5 lg:col-start-1 lg:row-start-1': layout === 'feature',
          'p-6 md:p-8 flex-1': layout === 'stacked',
          'lg:flex-1': isCompactRow,
        }"
      >
        <div class="flex flex-wrap items-center gap-3 mb-5">
          <span class="font-mono text-[11px] text-fg-faint tabular-nums">
            {{ String(index + 1).padStart(2, '0') }}
          </span>
          <span
            v-if="project.featured && !project.repo"
            class="chip !border-accent/50 !text-accent !bg-transparent"
          >
            {{ t('projects.thesisBadge') }}
          </span>
        </div>

        <h3 class="h-display text-display-sm text-fg m-0 mb-2">
          {{ t(`${base}.name`) }}
        </h3>
        <p class="font-mono text-xs text-accent m-0 mb-5">{{ t(`${base}.tagline`) }}</p>

        <p class="text-sm text-fg-muted leading-relaxed text-pretty max-w-prose m-0 mb-7">
          {{ t(`${base}.description`) }}
        </p>

        <!-- Results, ruled like a small table. -->
        <dl
          class="grid grid-cols-3 divide-x divide-line border-y border-line m-0 mb-7"
          :class="isCompactRow ? 'lg:hidden' : ''"
        >
          <div v-for="(metric, m) in metrics" :key="metric.label" :class="m === 0 ? 'pr-4' : 'px-4'">
            <dt class="sr-only">{{ metric.label }}</dt>
            <dd class="m-0 py-4">
              <span class="block font-display text-xl text-fg tabular-nums">{{ metric.value }}</span>
              <span class="block mt-1 font-mono text-[10px] leading-snug text-fg-faint">
                {{ metric.label }}
              </span>
            </dd>
          </div>
        </dl>

        <ul class="flex flex-wrap gap-1.5 list-none p-0 m-0 mb-7">
          <li v-for="tech in project.stack" :key="tech" class="chip">{{ tech }}</li>
        </ul>

        <ProjectLinks :project="project" class="mt-auto" />
      </div>

      <!-- Compact full-row cards move the results into a side rail. -->
      <dl
        v-if="isCompactRow"
        class="hidden lg:grid grid-cols-3 gap-6 lg:w-[38%] shrink-0 m-0
               lg:border-l lg:border-line lg:pl-10"
      >
        <div v-for="metric in metrics" :key="metric.label">
          <dt class="sr-only">{{ metric.label }}</dt>
          <dd class="m-0">
            <span class="block font-display text-2xl text-fg tabular-nums">{{ metric.value }}</span>
            <span class="block mt-1 font-mono text-[10px] leading-snug text-fg-faint">
              {{ metric.label }}
            </span>
          </dd>
        </div>
      </dl>
    </div>
  </SpotlightCard>
</template>
