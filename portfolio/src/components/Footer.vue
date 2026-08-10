<script setup lang="ts">
/**
 * Colophon.
 *
 * There is no privacy policy link because there is nothing to disclose: this
 * site ships no analytics, no cookies and no third-party scripts beyond the
 * webfont request. Stating that is honest; linking to a policy page that does
 * not exist is not.
 */
import { useI18n } from 'vue-i18n'
import { CONTACT } from '@/data/site'

const { t } = useI18n()
const year = new Date().getFullYear()
</script>

<template>
  <!-- Extra bottom padding clears the fixed Dock. -->
  <footer class="border-t border-line pt-10 pb-28">
    <div class="container-x grid-12 gap-y-6">
      <p class="col-half font-mono text-[11px] text-fg-faint m-0">
        © {{ year }} {{ t('footer.rights') }}
      </p>

      <div class="col-half flex flex-wrap items-center gap-x-8 gap-y-3 md:justify-end">
        <p class="font-mono text-[11px] text-fg-faint m-0">{{ t('footer.privacy') }}</p>

        <a
          :href="CONTACT.repo"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 font-mono text-[11px] text-fg-faint
                 hover:text-accent transition-colors no-underline"
        >
          {{ t('footer.built') }}
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 17L17 7m0 0H8m9 0v9" />
          </svg>
        </a>
      </div>
    </div>
  </footer>
</template>
