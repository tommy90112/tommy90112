<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Reveal from '@/components/Reveal.vue'
import { AWARDS } from '@/data/site'

const { t } = useI18n()

const ICON_PATHS: Record<string, string> = {
  trophy:
    'M8 21h8m-4-4v4m7-17H5v3a7 7 0 0014 0V4zM5 7H3.5A1.5 1.5 0 002 8.5v.5a4 4 0 004 4m13-5h1.5A1.5 1.5 0 0122 8.5v.5a4 4 0 01-4 4',
  mic: 'M12 15a3 3 0 003-3V6a3 3 0 10-6 0v6a3 3 0 003 3zm7-3a7 7 0 01-14 0m7 7v3m-4 0h8',
  flag: 'M4 21V4m0 0h11l-1.5 3L15 10H4',
}
</script>

<template>
  <section id="awards" class="section border-t border-ink-600">
    <div class="container-x">
      <Reveal>
        <p class="eyebrow mb-6">{{ t('awards.eyebrow') }}</p>
      </Reveal>

      <Reveal :delay="60">
        <h2 class="h-display text-display-md mb-12 text-balance">{{ t('awards.title') }}</h2>
      </Reveal>

      <ul class="list-none p-0 m-0 border-t border-ink-600">
        <li v-for="(award, i) in AWARDS" :key="award.id">
          <Reveal :delay="100 + i * 70">
            <component
              :is="award.link ? 'a' : 'div'"
              :href="award.link ?? undefined"
              :target="award.link ? '_blank' : undefined"
              :rel="award.link ? 'noopener noreferrer' : undefined"
              class="group flex items-start gap-5 py-7 border-b border-ink-600 no-underline
                     transition-colors duration-300"
              :class="award.link ? 'hover:bg-ink-800/50' : ''"
            >
              <span
                class="shrink-0 w-10 h-10 grid place-items-center rounded-full border border-ink-500
                       text-amber-400 group-hover:border-amber-400/50 transition-colors"
                aria-hidden="true"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" :d="ICON_PATHS[award.icon]" />
                </svg>
              </span>

              <div class="flex-1 min-w-0">
                <h3 class="text-base md:text-lg text-paper-50 mb-1.5 text-pretty">
                  {{ t(`awards.items.${award.id}.title`) }}
                </h3>
                <p class="text-sm text-paper-400 text-pretty">
                  {{ t(`awards.items.${award.id}.org`) }}
                </p>
              </div>

              <span class="shrink-0 font-mono text-xs text-paper-500 pt-1">
                {{ t(`awards.items.${award.id}.date`) }}
              </span>
            </component>
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
