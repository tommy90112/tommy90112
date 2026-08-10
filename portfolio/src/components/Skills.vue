<script setup lang="ts">
/**
 * Skills, as a ruled definition list.
 *
 * Previously a grid of five panels, each holding a heading and a row of tags —
 * which is a lot of frame around very little content, and made the section the
 * heaviest thing on the page despite being the least important. A label column
 * against a tag column says the same thing in a third of the ink.
 */
import { useI18n } from 'vue-i18n'
import Reveal from '@/components/Reveal.vue'
import SectionHeader from '@/components/SectionHeader.vue'
import { SKILL_GROUPS } from '@/data/site'

const { t } = useI18n()
</script>

<template>
  <section id="skills" class="section section-ruled relative">
    <div class="container-x relative">
      <SectionHeader
        index="04"
        :label="t('skills.eyebrow')"
        :title="t('skills.title')"
        :subtitle="t('skills.subtitle')"
      />

      <dl class="m-0 border-t border-line">
        <Reveal
          v-for="(group, i) in SKILL_GROUPS"
          :key="group.id"
          :delay="80 + i * 60"
          class="block border-b border-line"
        >
          <div class="grid-12 py-6 md:py-7 group/skill">
            <dt class="col-label flex items-center gap-3 m-0">
              <span
                class="grid place-items-center w-7 h-7 rounded-inner border border-line
                       text-fg-faint shrink-0 transition-colors duration-300
                       group-hover/skill:border-accent group-hover/skill:text-accent"
                aria-hidden="true"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" :d="group.icon" />
                </svg>
              </span>
              <span class="font-mono text-[11px] uppercase tracking-[0.14em] text-fg">
                {{ t(`skills.groups.${group.id}`) }}
              </span>
            </dt>

            <dd class="col-body m-0 mt-4 md:mt-0">
              <ul class="flex flex-wrap gap-1.5 list-none p-0 m-0">
                <li v-for="item in group.items" :key="item" class="chip">{{ item }}</li>
              </ul>
            </dd>
          </div>
        </Reveal>
      </dl>
    </div>
  </section>
</template>
