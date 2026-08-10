<script setup lang="ts">
/**
 * Awards, as a ruled list.
 *
 * Three tinted cards with big amber icons gave four lines of text the visual
 * weight of the whole projects section. A dated list is how recognition is
 * normally cited, and it lets the entries be read in order — which matters,
 * because they are chronological.
 *
 * `AwardEntry.span` is no longer read here; the list sets its own rhythm.
 */
import { useI18n } from 'vue-i18n'
import Reveal from '@/components/Reveal.vue'
import SectionHeader from '@/components/SectionHeader.vue'
import { AWARDS, type AwardEntry } from '@/data/site'

const { t } = useI18n()

const ICON_PATHS: Record<AwardEntry['icon'], string> = {
  trophy:
    'M8 21h8m-4-4v4m7-17H5v3a7 7 0 0014 0V4zM5 7H3.5A1.5 1.5 0 002 8.5v.5a4 4 0 004 4m13-5h1.5A1.5 1.5 0 0122 8.5v.5a4 4 0 01-4 4',
  flag: 'M4 21V4m0 0h11l-1.5 3L15 10H4',
  poster: 'M4 4h16v12H4zM8 20h8M12 16v4M7 8h6M7 12h4',
}
</script>

<template>
  <section id="awards" class="section section-ruled relative bg-sunk">
    <div class="container-x relative">
      <SectionHeader index="06" :label="t('awards.eyebrow')" :title="t('awards.title')" />

      <ol class="list-none p-0 m-0 border-t border-line">
        <li v-for="(award, i) in AWARDS" :key="award.id" class="border-b border-line">
          <Reveal :delay="80 + i * 70">
            <component
              :is="award.link ? 'a' : 'div'"
              :href="award.link ?? undefined"
              :target="award.link ? '_blank' : undefined"
              :rel="award.link ? 'noopener noreferrer' : undefined"
              class="group/award grid-12 py-7 md:py-8 no-underline"
              :class="award.link ? 'cursor-pointer' : ''"
            >
              <div class="col-label flex items-center gap-3">
                <span
                  class="grid place-items-center w-8 h-8 rounded-inner border border-line
                         text-fg-faint shrink-0 transition-colors duration-300
                         group-hover/award:border-accent group-hover/award:text-accent"
                  aria-hidden="true"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" :d="ICON_PATHS[award.icon]" />
                  </svg>
                </span>
                <span class="font-mono text-xs text-fg-faint tabular-nums">
                  {{ t(`awards.items.${award.id}.date`) }}
                </span>
              </div>

              <div class="col-body mt-4 md:mt-0 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                <div>
                  <h3
                    class="text-lg text-fg m-0 text-pretty transition-colors duration-300
                           group-hover/award:text-accent"
                  >
                    {{ t(`awards.items.${award.id}.title`) }}
                  </h3>
                  <p class="text-sm text-fg-muted text-pretty m-0 mt-1.5">
                    {{ t(`awards.items.${award.id}.org`) }}
                  </p>
                </div>

                <span
                  v-if="award.link"
                  class="inline-flex items-center gap-2 font-mono text-[10.5px] uppercase
                         tracking-[0.14em] text-fg-faint shrink-0 transition-colors
                         group-hover/award:text-accent"
                >
                  {{ t('projects.viewRepo') }}
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 17L17 7m0 0H8m9 0v9" />
                  </svg>
                </span>
              </div>
            </component>
          </Reveal>
        </li>
      </ol>

      <!--
        TODO: 補上其他獎項／證照／發表。
        在 src/data/site.ts 的 AWARDS 加一筆 { id, icon, link }，
        再到兩份 i18n 檔的 awards.items 補 title / org / date。
      -->
    </div>
  </section>
</template>
