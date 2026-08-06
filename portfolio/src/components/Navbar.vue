<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWindowScroll } from '@vueuse/core'
import { NAV_SECTIONS, CONTACT } from '@/data/site'
import { persistLocale, type Locale } from '@/i18n'

const { t, locale } = useI18n()
const { y } = useWindowScroll()

const isScrolled = computed(() => y.value > 24)
const isMenuOpen = ref(false)

const otherLocale = computed<Locale>(() => (locale.value === 'en' ? 'zh-TW' : 'en'))
const otherLocaleLabel = computed(() => (otherLocale.value === 'en' ? 'EN' : '中'))

function toggleLocale(): void {
  const next = otherLocale.value
  locale.value = next
  persistLocale(next)
}

function scrollTo(id: string): void {
  isMenuOpen.value = false
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <header
    class="fixed top-0 inset-x-0 z-50 transition-colors duration-300"
    :class="isScrolled ? 'bg-ink-900/85 backdrop-blur-md border-b border-ink-600' : 'bg-transparent'"
  >
    <nav class="container-x flex items-center justify-between h-16 md:h-20">
      <!-- Wordmark -->
      <a
        href="#top"
        class="font-display text-xl md:text-2xl text-paper-50 tracking-tight"
        @click.prevent="scrollTo('top')"
      >
        Yu-Hung <em class="text-violet-400">Shih</em>
      </a>

      <!-- Desktop links -->
      <ul class="hidden md:flex items-center gap-8">
        <li v-for="section in NAV_SECTIONS" :key="section.id">
          <a
            :href="`#${section.id}`"
            class="font-mono text-xs tracking-wider uppercase text-paper-400 hover:text-paper-100 transition-colors"
            @click.prevent="scrollTo(section.id)"
          >
            {{ t(section.key) }}
          </a>
        </li>
      </ul>

      <div class="flex items-center gap-3">
        <button
          type="button"
          class="w-9 h-9 grid place-items-center rounded-full border border-ink-500
                 font-mono text-xs text-paper-300 hover:border-violet-400 hover:text-paper-50
                 transition-colors"
          :aria-label="t('a11y.toggleLanguage')"
          @click="toggleLocale"
        >
          {{ otherLocaleLabel }}
        </button>

        <a
          :href="`mailto:${CONTACT.email}`"
          class="hidden md:inline-flex btn-primary !px-5 !py-2 text-xs"
        >
          {{ t('nav.resumeCta') }}
        </a>

        <!-- Mobile menu toggle -->
        <button
          type="button"
          class="md:hidden w-9 h-9 grid place-items-center rounded-full border border-ink-500 text-paper-200"
          :aria-label="isMenuOpen ? t('a11y.closeMenu') : t('a11y.openMenu')"
          :aria-expanded="isMenuOpen"
          aria-controls="mobile-menu"
          @click="isMenuOpen = !isMenuOpen"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              v-if="!isMenuOpen"
              stroke-linecap="round"
              stroke-width="2"
              d="M4 7h16M4 12h16M4 17h16"
            />
            <path v-else stroke-linecap="round" stroke-width="2" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </nav>

    <!-- Mobile menu -->
    <div
      v-show="isMenuOpen"
      id="mobile-menu"
      class="md:hidden border-t border-ink-600 bg-ink-900/95 backdrop-blur-md"
    >
      <ul class="container-x py-4 flex flex-col gap-1">
        <li v-for="section in NAV_SECTIONS" :key="section.id">
          <a
            :href="`#${section.id}`"
            class="block py-2.5 font-mono text-sm text-paper-300 hover:text-paper-50"
            @click.prevent="scrollTo(section.id)"
          >
            {{ t(section.key) }}
          </a>
        </li>
      </ul>
    </div>
  </header>
</template>
