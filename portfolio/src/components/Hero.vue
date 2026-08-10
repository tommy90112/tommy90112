<script setup lang="ts">
/**
 * Hero.
 *
 * Left-aligned and asymmetric rather than centred: a centred stack of
 * badge → headline → paragraph → two buttons is the most recognisable
 * generated-landing-page shape there is, and it reads worse besides — every
 * line starts at a different x, so the eye has no rag to follow.
 *
 * The headline runs across the first eight columns, the standfirst is held to
 * a ~68-character measure, and the figure row below splits 8/4 so it never
 * resolves into halves.
 */
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { HERO_STATS } from '@/data/site'
import CausalViz from '@/components/viz/CausalViz.vue'
import AuroraBackground from '@/components/fx/AuroraBackground.vue'
import ParticleField from '@/components/fx/ParticleField.vue'
import SplitText from '@/components/fx/SplitText.vue'
import CountUp from '@/components/fx/CountUp.vue'
import TiltedCard from '@/components/fx/TiltedCard.vue'
import Magnet from '@/components/fx/Magnet.vue'

const { t, locale } = useI18n()

const isZh = computed(() => locale.value.startsWith('zh'))

function scrollTo(id: string): void {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <section id="top" class="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
    <AuroraBackground :intensity="0.85" />
    <ParticleField class="opacity-60" />
    <div class="absolute inset-0 grid-bg pointer-events-none" aria-hidden="true"></div>

    <div class="container-x relative">
      <!-- Standing head: a department label sitting on a rule. -->
      <div class="flex items-center gap-3.5 animate-fade-up">
        <span class="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-soft shrink-0" aria-hidden="true"></span>
        <p class="eyebrow m-0">{{ t('hero.tag') }}</p>
        <span class="rule-fill" aria-hidden="true"></span>
      </div>

      <h1 class="h-display text-display-2xl m-0 mt-8 md:mt-12 text-balance max-w-[16ch] md:max-w-[18ch]">
        <SplitText :text="t('hero.headline1')" trigger="mount" :stagger="26" />
        <br />
        <SplitText :text="t('hero.headline2')" trigger="mount" :stagger="26" :delay="170" />
        <!--
          Set as one element rather than per-glyph: the accent colour and the
          italic belong to the phrase, and SplitText's per-token spans would
          break the shared baseline of an italic Fraunces run.
          Chinese has no true italic; faux-oblique CJK reads as a rendering bug.
        -->
        <em
          class="inline-block text-accent animate-fade-up"
          :class="isZh ? 'not-italic' : 'ml-[0.16em]'"
          style="animation-delay: 360ms"
        >
          {{ t('hero.headlineEm') }}
        </em>
      </h1>

      <div class="grid-12 mt-10 md:mt-14">
        <div class="col-major">
          <p
            class="text-base md:text-[17px] text-fg-muted leading-relaxed max-w-prose text-pretty
                   m-0 animate-fade-up"
            style="animation-delay: 520ms"
          >
            {{ t('hero.description') }}
          </p>

          <!-- One filled action, then a text-weight one. Two buttons of nearly
               equal weight leave neither reading as the primary path. -->
          <div
            class="flex flex-wrap items-center gap-x-8 gap-y-5 mt-9 animate-fade-up"
            style="animation-delay: 620ms"
          >
            <Magnet :radius="110" :strength="0.24">
              <button type="button" class="btn-primary" @click="scrollTo('work')">
                {{ t('hero.ctaWork') }}
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </Magnet>

            <button type="button" class="btn-text" @click="scrollTo('contact')">
              {{ t('hero.ctaContact') }}
            </button>
          </div>
        </div>

        <!-- Dateline rail — the metadata a paper hangs under its title block.
             Availability leads it: this portfolio exists to find a role, so the
             status belongs above the fold rather than inferred from a date. -->
        <aside
          class="col-rail md:pl-8 md:border-l md:border-line animate-fade-up"
          style="animation-delay: 700ms"
        >
          <p
            class="inline-flex items-center gap-2 m-0 mb-4 px-3 py-1.5 rounded-full
                   border border-accent/35 bg-accent/10 font-mono text-[11px] text-accent"
          >
            <span
              class="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-soft shrink-0"
              aria-hidden="true"
            ></span>
            {{ t('availability.status') }}
          </p>

          <p class="font-mono text-[11px] leading-relaxed text-fg-muted m-0 mb-3">
            {{ t('availability.detail') }}
          </p>

          <p class="font-mono text-[11px] leading-relaxed text-fg-faint m-0">
            {{ t('hero.subline') }}
          </p>
        </aside>
      </div>

      <!-- Figure, with the headline numbers set on a rail beside it. -->
      <div class="grid-12 mt-16 md:mt-24 animate-fade-up" style="animation-delay: 780ms">
        <TiltedCard as="figure" class="col-wide p-5 md:p-8 m-0" :max-tilt="4" :depth="18">
          <CausalViz />
          <figcaption
            class="mt-6 pt-5 border-t border-line font-mono text-[11px] leading-relaxed text-fg-faint"
          >
            {{ t('hero.vizCaption') }}
          </figcaption>
        </TiltedCard>

        <dl
          class="col-rail m-0 flex flex-col justify-end divide-y divide-line
                 border-t border-b border-line md:border-t-0"
        >
          <div v-for="(stat, i) in HERO_STATS" :key="stat.key" class="py-5 md:py-6">
            <dt class="font-mono text-[10.5px] tracking-[0.14em] uppercase text-fg-faint m-0">
              {{ t(`${stat.key}.label`) }}
            </dt>
            <dd class="stat-value mt-2 m-0">
              <CountUp :value="t(`${stat.key}.value`)" :delay="i * 110" />
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </section>
</template>
