<script setup lang="ts">
/**
 * The repo link (or the "private" notice that replaces it) for a project card.
 * Extracted so all three bento card layouts share one implementation.
 */
import { useI18n } from 'vue-i18n'
import type { Project } from '@/data/site'

defineProps<{ project: Project }>()

const { t } = useI18n()
</script>

<template>
  <div class="flex flex-wrap items-center gap-5">
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
</template>
