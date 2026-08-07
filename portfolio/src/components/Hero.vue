<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { HERO_STATS } from '@/data/site'
import CausalViz from '@/components/viz/CausalViz.vue'
import AuroraBackground from '@/components/fx/AuroraBackground.vue'
import ParticleField from '@/components/fx/ParticleField.vue'
import SplitText from '@/components/fx/SplitText.vue'
import CountUp from '@/components/fx/CountUp.vue'
import TiltedCard from '@/components/fx/TiltedCard.vue'
import SpotlightCard from '@/components/fx/SpotlightCard.vue'
import Magnet from '@/components/fx/Magnet.vue'

const { t, locale } = useI18n()

const isZh = computed(() => locale.value.startsWith('zh'))

function scrollTo(id: string): void {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <section id="top" class="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
    <!-- Layered background: aurora fields, particle lattice, dot grid -->
    <AuroraBackground :intensity="0.9" />
    <ParticleField class="opacity-70" />
    <div class="absolute inset-0 dot-bg pointer-events-none" aria-hidden="true"></div>

    <div class="container-x relative">
      <!-- Centred headline block -->
      <div class="flex flex-col items-center text-center">
        <p class="badge mb-8 animate-fade-up">
          <span class="badge-dot" aria-hidden="true"></span>
          {{ t('hero.tag') }}
        </p>

        <h1 class="h-display text-display-2xl mb-8 text-balance max-w-5xl">
          <SplitText :text="t('hero.headline1')" trigger="mount" :stagger="30" />
          <br />
          <SplitText :text="t('hero.headline2')" trigger="mount" :stagger="30" :delay="180" />
          <!--
            Animates as one block rather than per-glyph: `background-clip: text`
            has to sit on the element that owns the text, and SplitText's
            per-token spans would each clip their own copy of the gradient.
            Chinese has no true italic; faux-oblique CJK reads as a rendering bug.
          -->
          <em
            class="inline-block text-gradient animate-fade-up
                   bg-[linear-gradient(100deg,#B6A9FF,#7C6AFF_40%,#48D3E8)]"
            :class="isZh ? 'not-italic' : 'ml-[0.22em]'"
            style="animation-delay: 380ms"
          >
            {{ t('hero.headlineEm') }}
          </em>
        </h1>

        <p
          class="font-mono text-xs md:text-sm text-paper-400 mb-7 animate-fade-up"
          style="animation-delay: 520ms"
        >
          {{ t('hero.subline') }}
        </p>

        <p
          class="text-base md:text-lg text-paper-300 max-w-2xl leading-relaxed mb-11 text-pretty
                 animate-fade-up"
          style="animation-delay: 600ms"
        >
          {{ t('hero.description') }}
        </p>

        <div class="flex flex-wrap justify-center gap-4 animate-fade-up" style="animation-delay: 680ms">
          <Magnet :radius="120" :strength="0.28">
            <button type="button" class="btn-primary" @click="scrollTo('work')">
              {{ t('hero.ctaWork') }}
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </Magnet>

          <Magnet :radius="120" :strength="0.28">
            <button type="button" class="btn-ghost" @click="scrollTo('contact')">
              {{ t('hero.ctaContact') }}
            </button>
          </Magnet>
        </div>
      </div>

      <!-- Bento: signature visual beside a stacked stat block -->
      <div class="bento mt-20 md:mt-24 animate-fade-up" style="animation-delay: 760ms">
        <TiltedCard class="bento-wide p-5 md:p-8" :max-tilt="8" :depth="26">
          <CausalViz />
          <p class="mt-5 font-mono text-[11px] leading-relaxed text-paper-500">
            {{ t('hero.vizCaption') }}
          </p>
        </TiltedCard>

        <dl class="bento-narrow grid grid-cols-3 md:grid-cols-1 gap-3 md:gap-5 m-0">
          <SpotlightCard
            v-for="(stat, i) in HERO_STATS"
            :key="stat.key"
            class="p-5 flex flex-col justify-center"
            :rgb="i % 2 === 0 ? '124, 106, 255' : '245, 184, 65'"
            :radius="220"
          >
            <dt class="sr-only">{{ t(`${stat.key}.label`) }}</dt>
            <dd class="m-0">
              <span class="block h-display text-3xl md:text-4xl text-paper-50">
                <CountUp :value="t(`${stat.key}.value`)" :delay="i * 110" />
              </span>
              <span class="block mt-2 font-mono text-[11px] leading-snug text-paper-500">
                {{ t(`${stat.key}.label`) }}
              </span>
            </dd>
          </SpotlightCard>
        </dl>
      </div>
    </div>
  </section>
</template>
