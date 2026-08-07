<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Reveal from '@/components/Reveal.vue'
import SplitText from '@/components/fx/SplitText.vue'
import SpotlightCard from '@/components/fx/SpotlightCard.vue'
import { AWARDS, type AwardEntry } from '@/data/site'

const { t } = useI18n()

const ICON_PATHS: Record<AwardEntry['icon'], string> = {
  trophy:
    'M8 21h8m-4-4v4m7-17H5v3a7 7 0 0014 0V4zM5 7H3.5A1.5 1.5 0 002 8.5v.5a4 4 0 004 4m13-5h1.5A1.5 1.5 0 0122 8.5v.5a4 4 0 01-4 4',
  flag: 'M4 21V4m0 0h11l-1.5 3L15 10H4',
  poster: 'M4 4h16v12H4zM8 20h8M12 16v4M7 8h6M7 12h4',
}

const SPAN_CLASS: Record<AwardEntry['span'], string> = {
  2: 'bento-narrow',
  3: 'bento-half',
}
</script>

<template>
  <section id="awards" class="section relative border-t border-white/[0.06]">
    <div class="absolute inset-0 dot-bg opacity-30 pointer-events-none" aria-hidden="true"></div>

    <div class="container-x relative">
      <Reveal>
        <p class="eyebrow mb-6">{{ t('awards.eyebrow') }}</p>
      </Reveal>

      <h2 class="h-display text-display-md mb-12 text-balance">
        <SplitText :text="t('awards.title')" />
      </h2>

      <ul class="bento list-none p-0 m-0">
        <li v-for="(award, i) in AWARDS" :key="award.id" :class="SPAN_CLASS[award.span]">
          <Reveal :delay="100 + i * 70" class="h-full">
            <SpotlightCard
              tilt
              :max-tilt="6"
              rgb="245, 184, 65"
              class="h-full"
              :class="award.link ? '' : 'pointer-events-none'"
            >
              <component
                :is="award.link ? 'a' : 'div'"
                :href="award.link ?? undefined"
                :target="award.link ? '_blank' : undefined"
                :rel="award.link ? 'noopener noreferrer' : undefined"
                class="group/award flex h-full flex-col p-7 no-underline"
              >
                <span
                  class="mb-6 grid place-items-center w-11 h-11 rounded-2xl
                         bg-amber-400/10 border border-amber-400/25 text-amber-300
                         transition-colors duration-300 group-hover/award:bg-amber-400/20"
                  aria-hidden="true"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" :d="ICON_PATHS[award.icon]" />
                  </svg>
                </span>

                <span class="font-mono text-[11px] text-paper-500 mb-3 block">
                  {{ t(`awards.items.${award.id}.date`) }}
                </span>

                <h3 class="text-base md:text-lg text-paper-50 mb-2 text-pretty">
                  {{ t(`awards.items.${award.id}.title`) }}
                </h3>

                <p class="text-sm text-paper-400 text-pretty mb-6">
                  {{ t(`awards.items.${award.id}.org`) }}
                </p>

                <span
                  v-if="award.link"
                  class="mt-auto inline-flex items-center gap-2 font-mono text-xs text-paper-400
                         transition-colors group-hover/award:text-amber-300"
                >
                  {{ t('projects.viewRepo') }}
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 17L17 7m0 0H8m9 0v9" />
                  </svg>
                </span>
              </component>
            </SpotlightCard>
          </Reveal>
        </li>
      </ul>

      <!--
        TODO: 補上其他獎項／證照／發表。
        在 src/data/site.ts 的 AWARDS 加一筆 { id, icon, link }，
        再到兩份 i18n 檔的 awards.items 補 title / org / date。
      -->
    </div>
  </section>
</template>
