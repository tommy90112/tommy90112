<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { CONTACT } from '@/data/site'

const { t } = useI18n()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-ink-600 py-10">
    <div
      class="container-x flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
    >
      <p class="font-mono text-[11px] text-paper-500 m-0">
        © {{ year }} {{ t('footer.rights') }}
      </p>

      <p class="font-mono text-[11px] text-paper-500 m-0">
        {{ t('footer.built') }}
        <a
          :href="CONTACT.repo"
          target="_blank"
          rel="noopener noreferrer"
          class="text-paper-400 hover:text-violet-400 transition-colors ml-1"
        >
          ↗
        </a>
      </p>
    </div>
  </footer>
</template>
