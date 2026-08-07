<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Reveal from '@/components/Reveal.vue'
import SplitText from '@/components/fx/SplitText.vue'
import SpotlightCard from '@/components/fx/SpotlightCard.vue'

const { t } = useI18n()

const focusKeys = ['about.focus1', 'about.focus2', 'about.focus3', 'about.focus4'] as const
</script>

<template>
  <section id="about" class="section relative border-t border-white/[0.06]">
    <div class="container-x relative">
      <Reveal>
        <p class="eyebrow mb-6">{{ t('about.eyebrow') }}</p>
      </Reveal>

      <h2 class="h-display text-display-md mb-12 text-balance max-w-3xl">
        <SplitText :text="t('about.title')" />
      </h2>

      <div class="bento">
        <!-- Narrative -->
        <Reveal :delay="60" class="bento-wide h-full">
          <SpotlightCard class="h-full p-7 md:p-9">
            <div class="space-y-5 text-paper-300 leading-relaxed text-pretty">
              <p>{{ t('about.p1') }}</p>
              <p>{{ t('about.p2') }}</p>
              <p>{{ t('about.p3') }}</p>
            </div>
          </SpotlightCard>
        </Reveal>

        <!-- Current status -->
        <Reveal :delay="140" class="bento-narrow h-full">
          <SpotlightCard tilt :max-tilt="5" rgb="245, 184, 65" class="h-full p-7 flex flex-col justify-center">
            <h3 class="font-mono text-xs uppercase tracking-wider text-amber-400 mb-6">
              {{ t('about.currentTitle') }}
            </h3>
            <dl class="space-y-4 text-sm m-0">
              <div>
                <dt class="sr-only">Employer</dt>
                <dd class="text-paper-100 m-0">{{ t('about.currentRole') }}</dd>
              </div>
              <div>
                <dt class="sr-only">Study</dt>
                <dd class="text-paper-300 m-0">{{ t('about.currentStudy') }}</dd>
              </div>
              <div>
                <dt class="sr-only">Location</dt>
                <dd class="font-mono text-xs text-paper-500 m-0">{{ t('about.currentLocation') }}</dd>
              </div>
            </dl>
          </SpotlightCard>
        </Reveal>

        <!-- Focus areas, spread across the full row -->
        <Reveal :delay="200" class="bento-full">
          <SpotlightCard class="p-7 md:p-9" :radius="520">
            <h3 class="font-mono text-xs uppercase tracking-wider text-violet-400 mb-7">
              {{ t('about.focusTitle') }}
            </h3>
            <ul class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 list-none p-0 m-0">
              <li v-for="(key, i) in focusKeys" :key="key" class="flex flex-col gap-3">
                <span class="font-mono text-[11px] text-violet-400/70 tabular-nums">
                  {{ String(i + 1).padStart(2, '0') }}
                </span>
                <span class="text-sm text-paper-300 leading-relaxed text-pretty">
                  {{ t(key) }}
                </span>
              </li>
            </ul>
          </SpotlightCard>
        </Reveal>
      </div>
    </div>
  </section>
</template>
