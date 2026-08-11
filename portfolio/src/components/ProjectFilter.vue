<script setup lang="ts">
/**
 * Domain filter for the work section.
 *
 * A row of toggles rather than a `<select>`: with six projects and five
 * domains, the counts are part of the information — seeing "fraud 1" tells a
 * visitor what is here before they click, which a collapsed dropdown cannot.
 *
 * Semantics are toggle buttons with `aria-pressed`, not a tablist. These are
 * filters over one list, not tabs over separate panels, and announcing them as
 * tabs would promise a panel switch that never happens. The result count is a
 * polite live region so the change is audible.
 */
import { useI18n } from 'vue-i18n'
import type { ProjectDomain } from '@/data/site'

defineProps<{
  domains: readonly ProjectDomain[]
  /** Project count per domain, for the badge on each toggle. */
  counts: Readonly<Record<ProjectDomain, number>>
  /** `null` means no filter — every project shows. */
  active: ProjectDomain | null
  shown: number
  total: number
}>()

const emit = defineEmits<{ select: [domain: ProjectDomain | null] }>()

const { t } = useI18n()
</script>

<template>
  <div class="border-t border-b border-line py-4">
    <div class="flex flex-wrap items-center gap-x-6 gap-y-3">
      <span
        class="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-fg-faint shrink-0"
      >
        {{ t('projects.filterLabel') }}
      </span>

      <div class="flex flex-wrap items-center gap-2" role="group" :aria-label="t('projects.filterLabel')">
        <button
          type="button"
          class="chip"
          :class="active === null ? 'chip-active' : 'hover:border-line-strong hover:text-fg'"
          :aria-pressed="active === null"
          @click="emit('select', null)"
        >
          {{ t('projects.filterAll') }}
          <span class="ml-1.5 tabular-nums opacity-60">{{ total }}</span>
        </button>

        <button
          v-for="domain in domains"
          :key="domain"
          type="button"
          class="chip"
          :class="active === domain ? 'chip-active' : 'hover:border-line-strong hover:text-fg'"
          :aria-pressed="active === domain"
          @click="emit('select', active === domain ? null : domain)"
        >
          {{ t(`projects.domains.${domain}`) }}
          <span class="ml-1.5 tabular-nums opacity-60">{{ counts[domain] }}</span>
        </button>
      </div>

      <p
        class="font-mono text-[10px] uppercase tracking-[0.14em] text-fg-faint m-0 ml-auto tabular-nums"
        aria-live="polite"
      >
        {{ t('projects.showing', { shown, total }) }}
      </p>
    </div>
  </div>
</template>
