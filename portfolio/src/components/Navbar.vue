<script setup lang="ts">
/**
 * Masthead — a full-bleed bar ruled off from the page, not a floating pill.
 *
 * Section links live in the Dock at the bottom of the viewport; two copies of
 * the same navigation is clutter, and the Dock is the one that tracks reading
 * position. This bar carries identity plus the three global controls (theme,
 * language, contact), so it stays a single row at every width and needs no
 * mobile drawer.
 *
 * It only grows a ground once the page has scrolled: over the hero it is type
 * on the grid, which is what lets the headline start as high as it does.
 */
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWindowScroll } from '@vueuse/core'
import { CONTACT } from '@/data/site'
import { persistLocale, type Locale } from '@/i18n'
import ThemeToggle from '@/components/ThemeToggle.vue'

const { t, locale } = useI18n()
const { y } = useWindowScroll()

const isScrolled = computed(() => y.value > 24)

const otherLocale = computed<Locale>(() => (locale.value === 'en' ? 'zh-TW' : 'en'))
const otherLocaleLabel = computed(() => (otherLocale.value === 'en' ? 'EN' : '中'))

const mailto = computed(() => `mailto:${CONTACT.email}`)

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
  <!--
    Sticky, not fixed. A fixed full-bleed bar is sized against the layout
    viewport, which on mobile includes the scrollbar gutter — it comes out 2px
    wider than `clientWidth` and gives the page a horizontal scroll nobody
    asked for. Sticky sizes against the normal flow, so it is exactly as wide
    as the content column, and it reserves its own height instead of the hero
    having to pad around it.
  -->
  <header
    class="sticky top-0 z-header transition-colors duration-200"
    :class="isScrolled ? 'chrome' : 'bg-transparent border-b border-transparent'"
  >
    <nav class="container-x flex items-center justify-between gap-4 h-16">
      <a
        href="#top"
        class="font-sans font-extrabold text-base md:text-lg tracking-[-0.03em] text-fg
               whitespace-nowrap no-underline hover:text-accent transition-colors"
        @click.prevent="scrollToTop"
      >
        Yu-Hung <span class="text-accent">Shih</span>
      </a>

      <div class="flex items-center gap-2">
        <ThemeToggle />

        <button
          type="button"
          data-testid="locale-toggle"
          class="h-9 px-3 border border-line font-mono text-[10px] font-medium
                 uppercase tracking-[0.14em] text-fg-muted transition-colors duration-150
                 hover:border-line-strong hover:text-fg"
          :aria-label="t('a11y.toggleLanguage')"
          @click="toggleLocale"
        >
          {{ otherLocaleLabel }}
        </button>

        <!-- Hidden on phones: the wordmark plus three controls wraps to two
             lines below ~420px. The Dock's mail icon and the contact section's
             own button both reach the same address, so nothing is lost. -->
        <a :href="mailto" class="btn-primary hidden sm:inline-flex !h-9 !px-4 !text-xs whitespace-nowrap">
          {{ t('nav.resumeCta') }}
        </a>
      </div>
    </nav>
  </header>
</template>
