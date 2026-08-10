<script setup lang="ts">
/**
 * Experience, set as a ruled table rather than a timeline of cards.
 *
 * The vertical rail with glowing nodes was decoration standing in for
 * structure: two entries don't need a rail to be read in order. A period
 * column against a description column is how a CV is actually typeset, and it
 * scans in one pass.
 */
import { useI18n } from 'vue-i18n'
import Reveal from '@/components/Reveal.vue'
import SectionHeader from '@/components/SectionHeader.vue'
import { EXPERIENCE } from '@/data/site'

const { t } = useI18n()
</script>

<template>
  <section id="experience" class="section section-ruled relative">
    <div class="container-x relative">
      <SectionHeader index="02" :label="t('experience.eyebrow')" :title="t('experience.title')" />

      <ol class="list-none p-0 m-0 border-t border-line">
        <li v-for="(entry, i) in EXPERIENCE" :key="entry.id" class="border-b border-line">
          <Reveal :delay="80 + i * 90">
            <div class="grid-12 py-8 md:py-10 group/entry">
              <!-- Period column: fixed-width mono so every row's dates align. -->
              <div class="col-label flex items-start gap-2.5">
                <span
                  v-if="entry.current"
                  class="mt-[7px] w-1.5 h-1.5 rounded-full bg-accent shrink-0 animate-pulse-soft"
                  :aria-label="t('experience.currentLabel')"
                ></span>
                <span
                  v-else
                  class="mt-[7px] w-1.5 h-1.5 rounded-full border border-line-strong shrink-0"
                  aria-hidden="true"
                ></span>
                <span class="font-mono text-xs text-fg-faint tabular-nums">
                  {{ t(`experience.items.${entry.id}.period`) }}
                </span>
              </div>

              <div class="col-body mt-4 md:mt-0">
                <div class="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <h3
                    class="text-xl text-fg m-0 transition-colors duration-300
                           group-hover/entry:text-accent"
                  >
                    {{ t(`experience.items.${entry.id}.org`) }}
                  </h3>
                  <p class="font-mono text-xs text-accent m-0">
                    {{ t(`experience.items.${entry.id}.role`) }}
                  </p>
                </div>

                <p class="mt-3 text-sm text-fg-muted leading-relaxed max-w-prose text-pretty m-0">
                  {{ t(`experience.items.${entry.id}.description`) }}
                </p>
              </div>
            </div>
          </Reveal>
        </li>
      </ol>

      <!--
        TODO: 若要補上助教等其他經歷：
        在 src/data/site.ts 的 EXPERIENCE 加一筆 { id, current }，
        再到 src/i18n/en.ts 與 zh-TW.ts 的 experience.items 補對應文案。
      -->
    </div>
  </section>
</template>
