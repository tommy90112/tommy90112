<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { HERO_STATS } from '@/data/site'
import CausalViz from '@/components/viz/CausalViz.vue'

const { t, locale } = useI18n()

const isZh = computed(() => locale.value.startsWith('zh'))

function scrollTo(id: string): void {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <section id="top" class="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden">
    <!-- Blueprint grid + accent glows -->
    <div class="absolute inset-0 grid-bg pointer-events-none" aria-hidden="true"></div>
    <div
      class="absolute top-1/4 -right-40 w-[620px] h-[620px] rounded-full bg-violet-500/[0.07] blur-3xl pointer-events-none"
      aria-hidden="true"
    ></div>
    <div
      class="absolute -bottom-20 -left-40 w-[520px] h-[520px] rounded-full bg-amber-400/[0.05] blur-3xl pointer-events-none"
      aria-hidden="true"
    ></div>

    <div class="container-x relative">
      <div class="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        <!-- Copy -->
        <div class="lg:col-span-7">
          <p class="eyebrow mb-7 animate-fade-up">{{ t('hero.tag') }}</p>

          <h1
            class="h-display text-display-xl mb-7 text-balance animate-fade-up"
            style="animation-delay: 80ms"
          >
            {{ t('hero.headline1') }}<br />
            {{ t('hero.headline2') }}
            <!-- Chinese has no true italic; faux-oblique CJK reads as a rendering bug. -->
            <em class="text-violet-400" :class="isZh ? 'not-italic' : ''">
              {{ t('hero.headlineEm') }}
            </em>
          </h1>

          <p
            class="font-mono text-xs md:text-sm text-paper-400 mb-7 animate-fade-up"
            style="animation-delay: 160ms"
          >
            {{ t('hero.subline') }}
          </p>

          <p
            class="text-base md:text-lg text-paper-300 max-w-xl leading-relaxed mb-10 text-pretty animate-fade-up"
            style="animation-delay: 240ms"
          >
            {{ t('hero.description') }}
          </p>

          <div class="flex flex-wrap gap-4 animate-fade-up" style="animation-delay: 320ms">
            <button type="button" class="btn-primary" @click="scrollTo('work')">
              {{ t('hero.ctaWork') }}
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            <button type="button" class="btn-ghost" @click="scrollTo('contact')">
              {{ t('hero.ctaContact') }}
            </button>
          </div>
        </div>

        <!-- Signature visual: the thesis idea, in one picture -->
        <div class="lg:col-span-5 animate-fade-up" style="animation-delay: 400ms">
          <div class="card p-5 md:p-7">
            <CausalViz />
            <p class="mt-4 font-mono text-[11px] leading-relaxed text-paper-500">
              {{ t('hero.vizCaption') }}
            </p>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <dl
        class="grid grid-cols-2 md:grid-cols-4 mt-16 md:mt-20 border-t border-ink-600 animate-fade-up"
        style="animation-delay: 480ms"
      >
        <div
          v-for="stat in HERO_STATS"
          :key="stat.key"
          class="py-6 md:py-7 pr-6 border-b md:border-b-0 border-ink-600
                 md:border-r md:last:border-r-0"
        >
          <dt class="sr-only">{{ t(`${stat.key}.label`) }}</dt>
          <dd>
            <span class="block h-display text-3xl md:text-4xl text-paper-50">
              {{ t(`${stat.key}.value`) }}
            </span>
            <span class="block mt-1.5 font-mono text-[11px] leading-snug text-paper-500">
              {{ t(`${stat.key}.label`) }}
            </span>
          </dd>
        </div>
      </dl>
    </div>
  </section>
</template>
