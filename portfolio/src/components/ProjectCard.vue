<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Project } from '@/data/site'
import AttributionViz from '@/components/viz/AttributionViz.vue'
import NetworkViz from '@/components/viz/NetworkViz.vue'
import ShockwaveViz from '@/components/viz/ShockwaveViz.vue'
import RocViz from '@/components/viz/RocViz.vue'

const props = defineProps<{ project: Project; index: number }>()

const { t, te } = useI18n()

const base = computed(() => `projects.items.${props.project.id}`)

const vizComponent = computed(() => {
  switch (props.project.viz) {
    case 'attribution':
      return AttributionViz
    case 'network':
      return NetworkViz
    case 'shockwave':
      return ShockwaveViz
    case 'roc':
      return RocViz
    default:
      return null
  }
})

const captionKey = computed(() => `${base.value}.vizCaption`)
const hasCaption = computed(() => te(captionKey.value))

const metrics = computed(() =>
  ([1, 2, 3] as const).map((n) => ({
    value: t(`${base.value}.metric${n}`),
    label: t(`${base.value}.metric${n}Label`),
  })),
)

/** Alternate which side the visual sits on, for projects that have one. */
const isReversed = computed(() => props.index % 2 === 1)
</script>

<template>
  <article
    class="card-hover overflow-hidden"
    :class="project.featured ? 'border-violet-500/30' : ''"
  >
    <div class="grid lg:grid-cols-2 gap-0">
      <!-- Copy -->
      <div
        class="p-7 md:p-9 flex flex-col"
        :class="vizComponent && isReversed ? 'lg:order-2' : ''"
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
        <dl class="grid grid-cols-3 gap-4 mb-7 m-0">
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

        <!-- Links -->
        <div class="mt-auto flex flex-wrap items-center gap-5">
          <a
            v-if="project.repo"
            :href="project.repo"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 font-mono text-xs text-paper-200 link-underline"
          >
            {{ t('projects.viewRepo') }}
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 17L17 7m0 0H8m9 0v9" />
            </svg>
          </a>
          <span v-else class="inline-flex items-center gap-2 font-mono text-xs text-paper-500">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            {{ t('projects.privateRepo') }}
          </span>
        </div>
      </div>

      <!-- Visual -->
      <div
        v-if="vizComponent"
        class="p-7 md:p-9 bg-ink-950/60 border-t lg:border-t-0 border-ink-600 flex flex-col justify-center"
        :class="isReversed ? 'lg:order-1 lg:border-r' : 'lg:border-l'"
      >
        <component :is="vizComponent" />
        <p v-if="hasCaption" class="mt-4 font-mono text-[11px] leading-relaxed text-paper-500">
          {{ t(captionKey) }}
        </p>
      </div>
    </div>
  </article>
</template>
