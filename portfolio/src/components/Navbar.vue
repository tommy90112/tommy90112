<script setup lang="ts">
/**
 * Masthead.
 *
 * Section links live in the Dock at the bottom of the viewport, not here — two
 * copies of the same navigation is clutter, and the Dock is the one that tracks
 * reading position. This bar carries identity plus the three global controls
 * (theme, language, contact), so it stays a single row at every width and needs
 * no mobile drawer.
 *
 * It only grows a surface once the page has scrolled: over the hero it is just
 * type on the background, which is what lets the headline start as high as it
 * does.
 */
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWindowScroll } from '@vueuse/core'
import { CONTACT } from '@/data/site'
import { persistLocale, type Locale } from '@/i18n'
import ThemeToggle from '@/components/ThemeToggle.vue'
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
  <header class="fixed top-0 inset-x-0 z-header pt-3 px-4 sm:px-6 pointer-events-none">
    <nav
      class="pointer-events-auto mx-auto max-w-content flex items-center justify-between gap-4
             rounded-panel pl-4 pr-2 py-2 transition-[background-color,border-color,box-shadow]
             duration-500"
      :class="isScrolled ? 'chrome' : 'bg-transparent border border-transparent'"
    >
      <a
        href="#top"
        class="font-display text-lg md:text-xl text-fg tracking-tight no-underline
               whitespace-nowrap hover:text-accent transition-colors"
        @click.prevent="scrollToTop"
      >
        Yu-Hung <em class="not-italic text-accent">Shih</em>
      </a>

      <div class="flex items-center gap-2">
        <ThemeToggle />

        <button
          type="button"
          class="h-9 px-3 rounded-inner border border-line font-mono text-[10.5px]
                 uppercase tracking-[0.14em] text-fg-muted transition-colors duration-200
                 hover:border-line-strong hover:text-fg"
          :aria-label="t('a11y.toggleLanguage')"
          @click="toggleLocale"
        >
          {{ otherLocaleLabel }}
        </button>

        <!-- Hidden on phones: the wordmark plus three controls wraps to two
             lines below ~420px. The Dock's mail icon and the contact section's
             own button both reach the same address, so nothing is lost. -->
        <!-- Wrapper rather than a class on Magnet: Magnet's root carries
             `inline-block`, and `hidden` would be fighting it for precedence
             on whichever order Tailwind happened to emit. -->
        <span class="hidden sm:inline-block">
          <Magnet :radius="80" :strength="0.22">
            <a
              :href="`mailto:${CONTACT.email}`"
              class="btn-primary !px-4 !py-2 !text-xs whitespace-nowrap"
            >
              {{ t('nav.resumeCta') }}
            </a>
          </Magnet>
        </span>
      </div>
    </nav>
  </header>
</template>
