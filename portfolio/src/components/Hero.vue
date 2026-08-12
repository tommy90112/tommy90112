<script setup lang="ts">
/**
 * Hero, set as a title block in the International Typographic Style.
 *
 * Everything hangs from the same left edge as every other section, and the
 * vertical order is strictly informational: what the field is, then who and
 * what, then the claim, then the evidence. No centring, no ambient colour, no
 * depth — the only thing behind the type is the particle field, kept faint and
 * masked out well above the fold so the background stays background.
 *
 * The headline is one typeface at one weight, sized until it fills the measure;
 * the accent line is the thesis, and it is the only chromatic thing above the
 * fold apart from the availability light.
 */
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { HERO_STATS } from '@/data/site'
import { useAvailability } from '@/composables/useAvailability'
import CausalViz from '@/components/viz/CausalViz.vue'
import ParticleField from '@/components/fx/ParticleField.vue'
import SplitText from '@/components/fx/SplitText.vue'
import CountUp from '@/components/fx/CountUp.vue'

const { t, locale } = useI18n()

const isZh = computed(() => locale.value.startsWith('zh'))

const availability = useAvailability()

function scrollTo(id: string): void {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <!-- Top padding is small because the sticky masthead now reserves its own
       64px in the flow rather than floating over this section. -->
  <section id="top" class="relative overflow-hidden pt-10 pb-14 md:pt-16 md:pb-20">
    <!-- A drifting point field with proximity links. The ruled grid is gone:
         it pinned the graph to the layout module, and a graph free to drift
         reads against the module rather than with it. What is left is texture,
         not a diagram — held to 80% so it stays under the type, and masked out
         over the last stretch of the section so it doesn't run into the viz. -->
    <ParticleField class="fade-down opacity-80" />

    <div class="container-x relative">
      <!-- Standing head: field on the left, status on the right, one rule. -->
      <div class="grid-12 items-baseline pb-4 border-b border-line-strong animate-fade-up">
        <p class="col-wide eyebrow m-0">{{ t('hero.tag') }}</p>

        <p
          v-if="availability.isOpen.value"
          class="col-rail m-0 flex items-baseline gap-2 md:justify-end
                 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-accent"
        >
          <span
            class="self-center w-1.5 h-1.5 rounded-full bg-accent animate-pulse-soft shrink-0"
            aria-hidden="true"
          ></span>
          {{ availability.status.value }}
          <span class="text-fg-faint">/</span>
          <span class="text-fg-faint">{{ availability.timing.value }}</span>
        </p>
      </div>

      <h1 class="h-display text-display-2xl m-0 mt-8 md:mt-10">
        <SplitText :text="t('hero.headline1')" trigger="mount" :stagger="22" />
        <br />
        <SplitText :text="t('hero.headline2')" trigger="mount" :stagger="22" :delay="150" />
        <br />
        <!--
          Set as one element rather than per-glyph so the accent applies to the
          phrase. Not italic: this style separates by weight and colour, and
          Chinese has no true italic anyway — faux-oblique CJK reads as a bug.
        -->
        <em class="not-italic text-accent animate-fade-up" style="animation-delay: 320ms">
          {{ isZh ? t('hero.headlineEm') : t('hero.headlineEm').replace(/\.$/, '') }}
        </em>
      </h1>

      <div class="grid-12 mt-10 md:mt-14 pt-8 border-t border-line">
        <div class="col-wide">
          <p
            class="text-[15px] md:text-base text-fg-muted leading-[1.6] max-w-prose text-pretty
                   m-0 animate-fade-up"
            style="animation-delay: 460ms"
          >
            {{ t('hero.description') }}
          </p>

          <div class="flex flex-wrap items-stretch gap-3 mt-8 animate-fade-up" style="animation-delay: 540ms">
            <button type="button" class="btn-primary" @click="scrollTo('work')">
              {{ t('hero.ctaWork') }}
            </button>
            <button type="button" class="btn-ghost" @click="scrollTo('contact')">
              {{ t('hero.ctaContact') }}
            </button>
          </div>
        </div>

        <aside class="col-rail animate-fade-up" style="animation-delay: 620ms">
          <p
            v-if="availability.isOpen.value"
            class="font-mono text-[11px] leading-[1.65] text-fg-muted m-0 mb-4"
          >
            {{ availability.detail.value }}
          </p>
          <p class="font-mono text-[11px] leading-[1.65] text-fg-faint m-0">
            {{ t('hero.subline') }}
          </p>
        </aside>
      </div>

      <!-- Results table. Three figures, one rule above and below, equal
           columns — the shape a specification sheet uses, because that is
           what it is. -->
      <dl
        class="grid grid-cols-3 mt-12 md:mt-16 border-t border-b border-line-strong m-0
               animate-fade-up"
        style="animation-delay: 700ms"
      >
        <div
          v-for="(stat, i) in HERO_STATS"
          :key="stat.key"
          class="py-6 md:py-7 pr-4"
          :class="i > 0 ? 'border-l border-line pl-4 md:pl-6' : ''"
        >
          <dd class="stat-value m-0">
            <CountUp :value="t(`${stat.key}.value`)" :delay="i * 90" />
          </dd>
          <dt class="stat-label">{{ t(`${stat.key}.label`) }}</dt>
        </div>
      </dl>

      <figure class="mt-12 md:mt-16 m-0 panel p-5 md:p-8 animate-fade-up" style="animation-delay: 780ms">
        <CausalViz />
        <figcaption
          class="mt-6 pt-5 border-t border-line font-mono text-[11px] leading-[1.65] text-fg-faint"
        >
          {{ t('hero.vizCaption') }}
        </figcaption>
      </figure>
    </div>
  </section>
</template>
