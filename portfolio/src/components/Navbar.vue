<script setup lang="ts">
/**
 * Floating glass header.
 *
 * Section links live in the Dock at the bottom of the viewport, not here — two
 * copies of the same navigation is clutter, and the Dock is the one that shows
 * reading position. This bar keeps only identity and the two global actions
 * (language, contact), so it stays a single row on every width and needs no
 * mobile drawer.
 */
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWindowScroll } from '@vueuse/core'
import { CONTACT } from '@/data/site'
import { persistLocale, type Locale } from '@/i18n'
import Magnet from '@/components/fx/Magnet.vue'

const { t, locale } = useI18n()
const { y } = useWindowScroll()

const isScrolled = computed(() => y.value > 24)

const otherLocale = computed<Locale>(() => (locale.value === 'en' ? 'zh-TW' : 'en'))
const otherLocaleLabel = computed(() => (otherLocale.value === 'en' ? 'EN' : '中'))

function toggleLocale(): void {
  const next = otherLocale.value
  locale.value = next
  persistLocale(next)
}

function scrollToTop(): void {
  document.getElementById('top')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <header class="fixed top-0 inset-x-0 z-50 pt-3 px-4 sm:px-6 pointer-events-none">
    <nav
      class="pointer-events-auto mx-auto max-w-content flex items-center justify-between gap-4
             rounded-full pl-5 pr-2.5 py-2 transition-all duration-500"
      :class="
        isScrolled
          ? 'bg-ink-900/70 border border-white/[0.10] backdrop-blur-2xl shadow-glass'
          : 'bg-transparent border border-transparent'
      "
    >
      <!-- Wordmark -->
      <a
        href="#top"
        class="font-display text-xl md:text-2xl text-paper-50 tracking-tight no-underline"
        @click.prevent="scrollToTop"
      >
        Yu-Hung
        <em class="text-gradient bg-[linear-gradient(100deg,#B6A9FF,#48D3E8)]">Shih</em>
      </a>

      <div class="flex items-center gap-2">
        <Magnet :radius="70" :strength="0.25">
          <button
            type="button"
            class="w-9 h-9 grid place-items-center rounded-full border border-white/[0.10]
                   bg-white/[0.04] font-mono text-xs text-paper-300 backdrop-blur-xl
                   hover:border-violet-400/50 hover:text-paper-50 transition-colors"
            :aria-label="t('a11y.toggleLanguage')"
            @click="toggleLocale"
          >
            {{ otherLocaleLabel }}
          </button>
        </Magnet>

        <Magnet :radius="90" :strength="0.25">
          <a :href="`mailto:${CONTACT.email}`" class="btn-primary !px-5 !py-2 text-xs">
            {{ t('nav.resumeCta') }}
          </a>
        </Magnet>
      </div>
    </nav>
  </header>
</template>
