<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Reveal from '@/components/Reveal.vue'
import SplitText from '@/components/fx/SplitText.vue'
import SpotlightCard from '@/components/fx/SpotlightCard.vue'
import { EXPERIENCE } from '@/data/site'

const { t } = useI18n()
</script>

<template>
  <section id="experience" class="section relative border-t border-white/[0.06]">
    <div class="container-x relative">
      <Reveal>
        <p class="eyebrow mb-6">{{ t('experience.eyebrow') }}</p>
      </Reveal>

      <h2 class="h-display text-display-md mb-12 text-balance">
        <SplitText :text="t('experience.title')" />
      </h2>

      <ol class="list-none p-0 m-0 relative">
        <!-- Timeline rail, sitting behind the cards -->
        <span
          class="absolute left-[7px] top-3 bottom-14 w-px hidden sm:block
                 bg-gradient-to-b from-violet-500/50 via-white/10 to-transparent"
          aria-hidden="true"
        ></span>

        <li v-for="(entry, i) in EXPERIENCE" :key="entry.id">
          <Reveal :delay="100 + i * 80">
            <div class="relative sm:pl-12 pb-5">
              <!-- Node -->
              <span
                class="absolute left-0 top-7 hidden sm:grid place-items-center w-[15px] h-[15px]
                       rounded-full border-2 border-ink-950"
                :class="entry.current ? 'bg-violet-500 shadow-[0_0_16px_2px_rgba(124,106,255,0.6)]' : 'bg-ink-500'"
                aria-hidden="true"
              ></span>

              <SpotlightCard tilt :max-tilt="3" class="p-6 md:p-7">
                <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-2">
                  <h3 class="text-lg text-paper-50 m-0">
                    {{ t(`experience.items.${entry.id}.org`) }}
                  </h3>
                  <span class="font-mono text-xs text-paper-500">
                    {{ t(`experience.items.${entry.id}.period`) }}
                  </span>
                </div>

                <p class="font-mono text-xs text-violet-400 mb-3">
                  {{ t(`experience.items.${entry.id}.role`) }}
                </p>

                <p class="text-sm text-paper-300 leading-relaxed max-w-2xl text-pretty m-0">
                  {{ t(`experience.items.${entry.id}.description`) }}
                </p>
              </SpotlightCard>
            </div>
          </Reveal>
        </li>
      </ol>

      <!--
        TODO: 補上完整經歷。目前只有 GitHub profile 上能確認的兩筆（國泰人壽、淡江統研），
        缺實際職稱與起迄年月，也缺實習／助教等其他經歷。
        補法：在 src/data/site.ts 的 EXPERIENCE 加一筆 { id, current }，
        再到 src/i18n/en.ts 與 zh-TW.ts 的 experience.items 補對應文案。
      -->
      <Reveal :delay="300">
        <p class="font-mono text-[11px] text-paper-500 sm:pl-12 mt-4">
          {{ t('experience.note') }}
        </p>
      </Reveal>
    </div>
  </section>
</template>
