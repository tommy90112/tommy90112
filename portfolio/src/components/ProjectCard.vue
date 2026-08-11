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
 * Each card carries a stable `id` so a single project can be linked to
 * directly — the case that matters is pasting one project into an application
 * email, not browsing the section top to bottom.
 */
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Project } from '@/data/site'
import ProjectLinks from '@/components/ProjectLinks.vue'
import AttributionViz from '@/components/viz/AttributionViz.vue'
import NetworkViz from '@/components/viz/NetworkViz.vue'
import ShockwaveViz from '@/components/viz/ShockwaveViz.vue'
import RocViz from '@/components/viz/RocViz.vue'

const props = withDefaults(
  defineProps<{
    project: Project
    index: number
    /**
     * Whether the card is actually rendering full-width. Not the same as
     * `project.span`: filtering can leave a half-width card alone on the last
     * row, and the grid promotes it — at which point it needs the side-by-side
     * layout, or its chart is blown up to the width of the page.
     */
    fullWidth?: boolean
  }>(),
  { fullWidth: false },
)

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

const isFullRow = computed(() => props.fullWidth || props.project.span === 'full')

const layout = computed<Layout>(() => {
  if (!vizComponent.value) return 'compact'
  return isFullRow.value ? 'feature' : 'stacked'
})

/** Compact full-row cards read better as a horizontal strip than a tall block. */
const isCompactRow = computed(() => layout.value === 'compact' && isFullRow.value)

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
  <article :id="`project-${project.id}`" class="relative h-full panel panel-hover scroll-mt-24">
    <!-- Featured marker: a solid bar on the top edge. Reads at a glance and
         costs no chrome, which a badge on every card would. -->
    <div v-if="project.featured" class="h-1 bg-accent" aria-hidden="true"></div>

    <div
      class="h-full"
      :class="{
        'grid lg:grid-cols-12': layout === 'feature',
        'flex flex-col': layout === 'stacked',
        'flex flex-col lg:flex-row lg:items-center lg:gap-10 p-5 md:p-8': isCompactRow,
        'flex flex-col p-5 md:p-8': layout === 'compact' && !isCompactRow,
      }"
    >
      <!-- Figure (feature: right seven columns, stacked: on top) -->
      <figure
        v-if="vizComponent"
        class="relative bg-surface-raised m-0"
        :class="
          layout === 'feature'
            ? 'order-last lg:order-none lg:col-span-7 lg:col-start-6 p-5 md:p-8 border-t lg:border-t-0 lg:border-l border-line flex flex-col justify-center'
            : 'p-4 md:p-6 border-b border-line'
        "
      >
        <component :is="vizComponent" />
        <figcaption
          v-if="hasCaption"
          class="mt-4 font-mono text-[10px] leading-[1.6] text-fg-faint"
        >
          {{ t(captionKey) }}
        </figcaption>
      </figure>

      <!-- Copy -->
      <div
        class="flex flex-col"
        :class="{
          'p-5 md:p-8 lg:col-span-5 lg:col-start-1 lg:row-start-1': layout === 'feature',
          'p-5 md:p-7 flex-1': layout === 'stacked',
          'lg:flex-1': isCompactRow,
        }"
      >
        <!-- Index, domains, thesis marker: all the card's metadata on one
             ruled line, the way a plate caption is set. -->
        <div class="flex flex-wrap items-center gap-x-3 gap-y-2 pb-4 mb-5 border-b border-line">
          <span class="font-mono text-[11px] font-medium text-fg-faint tabular-nums">
            {{ String(index + 1).padStart(2, '0') }}
          </span>
          <span
            v-for="domain in project.domains"
            :key="domain"
            class="font-mono text-[10px] uppercase tracking-[0.1em] text-fg-faint"
          >
            {{ t(`projects.domains.${domain}`) }}
          </span>
          <span
            v-if="project.featured && !project.repo"
            class="ml-auto font-mono text-[10px] uppercase tracking-[0.1em] text-accent"
          >
            {{ t('projects.thesisBadge') }}
          </span>
        </div>

        <h3 class="h-display text-display-sm text-fg m-0 mb-1.5">
          {{ t(`${base}.name`) }}
        </h3>
        <p class="font-mono text-[11px] text-accent m-0 mb-5">{{ t(`${base}.tagline`) }}</p>

        <p class="text-sm text-fg-muted leading-[1.6] text-pretty max-w-prose m-0 mb-6">
          {{ t(`${base}.description`) }}
        </p>

        <!-- Results, ruled like a small table. One column on a phone: three
             columns of ~100px cannot hold a tracked-out uppercase label like
             "graph transformer backbone", and forcing it overflows the page. -->
        <dl
          class="grid grid-cols-1 sm:grid-cols-3 border-t border-b border-line m-0 mb-6"
          :class="isCompactRow ? 'lg:hidden' : ''"
        >
          <div
            v-for="(metric, m) in metrics"
            :key="metric.label"
            class="py-3 sm:py-4 sm:pr-3"
            :class="m > 0 ? 'border-t sm:border-t-0 sm:border-l border-line sm:pl-3' : ''"
          >
            <dt class="sr-only">{{ metric.label }}</dt>
            <dd class="m-0">
              <span class="block font-sans font-bold text-lg text-fg tabular-nums leading-none">
                {{ metric.value }}
              </span>
              <span
                class="block mt-1.5 font-mono text-[10px] uppercase tracking-[0.08em] leading-snug text-fg-faint [overflow-wrap:anywhere]"
              >
                {{ metric.label }}
              </span>
            </dd>
          </div>
        </dl>

        <ul class="flex flex-wrap gap-1.5 list-none p-0 m-0 mb-6">
          <li v-for="tech in project.stack" :key="tech" class="chip normal-case tracking-normal">
            {{ tech }}
          </li>
        </ul>

        <ProjectLinks :project="project" class="mt-auto" />
      </div>

      <!-- Compact full-row cards move the results into a side rail. -->
      <dl
        v-if="isCompactRow"
        class="hidden lg:grid grid-cols-3 lg:w-[38%] shrink-0 m-0
               lg:border-l lg:border-line"
      >
        <div v-for="(metric, m) in metrics" :key="metric.label" class="px-5" :class="m > 0 ? 'border-l border-line' : ''">
          <dt class="sr-only">{{ metric.label }}</dt>
          <dd class="m-0">
            <span class="block font-sans font-bold text-xl text-fg tabular-nums leading-none">
              {{ metric.value }}
            </span>
            <span
              class="block mt-1.5 font-mono text-[10px] uppercase tracking-[0.08em] leading-snug text-fg-faint [overflow-wrap:anywhere]"
            >
              {{ metric.label }}
            </span>
          </dd>
        </div>
      </dl>
    </div>
  </article>
</template>
