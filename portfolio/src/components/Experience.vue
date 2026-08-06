<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Reveal from '@/components/Reveal.vue'
import { EXPERIENCE } from '@/data/site'

const { t } = useI18n()
</script>

<template>
  <section id="experience" class="section border-t border-ink-600">
    <div class="container-x">
      <Reveal>
        <p class="eyebrow mb-6">{{ t('experience.eyebrow') }}</p>
      </Reveal>

      <Reveal :delay="60">
        <h2 class="h-display text-display-md mb-12 text-balance">{{ t('experience.title') }}</h2>
      </Reveal>

      <ol class="list-none p-0 m-0 relative">
        <!-- Timeline rail -->
        <span
          class="absolute left-[7px] top-2 bottom-2 w-px bg-ink-600 hidden sm:block"
          aria-hidden="true"
        ></span>

        <li v-for="(entry, i) in EXPERIENCE" :key="entry.id">
          <Reveal :delay="100 + i * 80">
            <div class="relative sm:pl-10 pb-10">
              <!-- Node -->
              <span
                class="absolute left-0 top-1.5 hidden sm:grid place-items-center w-[15px] h-[15px] rounded-full
                       border-2 border-ink-900"
                :class="entry.current ? 'bg-violet-500' : 'bg-ink-500'"
                aria-hidden="true"
              ></span>

              <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-2">
                <h3 class="text-lg text-paper-50">
                  {{ t(`experience.items.${entry.id}.org`) }}
                </h3>
                <span class="font-mono text-xs text-paper-500">
                  {{ t(`experience.items.${entry.id}.period`) }}
                </span>
              </div>

              <p class="font-mono text-xs text-violet-400 mb-3">
                {{ t(`experience.items.${entry.id}.role`) }}
              </p>

              <p class="text-sm text-paper-300 leading-relaxed max-w-2xl text-pretty">
                {{ t(`experience.items.${entry.id}.description`) }}
              </p>
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
        <p class="font-mono text-[11px] text-paper-500 sm:pl-10">
          {{ t('experience.note') }}
        </p>
      </Reveal>
    </div>
  </section>
</template>
