<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Reveal from '@/components/Reveal.vue'
import SplitText from '@/components/fx/SplitText.vue'
import SpotlightCard from '@/components/fx/SpotlightCard.vue'
import { SKILL_GROUPS, type SkillGroup } from '@/data/site'

const { t } = useI18n()

const SPAN_CLASS: Record<SkillGroup['span'], string> = {
  2: 'bento-narrow',
  3: 'bento-half',
  4: 'bento-wide',
}
</script>

<template>
  <section id="skills" class="section relative border-t border-white/[0.06]">
    <div class="container-x relative">
      <Reveal>
        <p class="eyebrow mb-6">{{ t('skills.eyebrow') }}</p>
      </Reveal>

      <h2 class="h-display text-display-md mb-4 text-balance">
        <SplitText :text="t('skills.title')" />
      </h2>

      <Reveal :delay="100">
        <p class="text-paper-400 max-w-xl mb-14 text-pretty">{{ t('skills.subtitle') }}</p>
      </Reveal>

      <div class="bento">
        <Reveal
          v-for="(group, i) in SKILL_GROUPS"
          :key="group.id"
          :delay="120 + i * 70"
          :class="[SPAN_CLASS[group.span], 'h-full']"
        >
          <SpotlightCard tilt :max-tilt="3" class="h-full p-6 md:p-7">
            <div class="flex items-center gap-3 mb-6">
              <span
                class="grid place-items-center w-9 h-9 rounded-xl bg-violet-500/10
                       border border-violet-400/25 text-violet-300 shrink-0"
                aria-hidden="true"
              >
                <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" :d="group.icon" />
                </svg>
              </span>
              <h3 class="font-mono text-xs uppercase tracking-wider text-paper-200 m-0">
                {{ t(`skills.groups.${group.id}`) }}
              </h3>
            </div>

            <ul class="flex flex-wrap gap-2 list-none p-0 m-0">
              <li v-for="item in group.items" :key="item" class="chip">{{ item }}</li>
            </ul>
          </SpotlightCard>
        </Reveal>
      </div>
    </div>
  </section>
</template>
