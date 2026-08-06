<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Reveal from '@/components/Reveal.vue'
import { SKILL_GROUPS } from '@/data/site'

const { t } = useI18n()
</script>

<template>
  <section id="skills" class="section border-t border-ink-600">
    <div class="container-x">
      <Reveal>
        <p class="eyebrow mb-6">{{ t('skills.eyebrow') }}</p>
      </Reveal>

      <Reveal :delay="60">
        <h2 class="h-display text-display-md mb-4 text-balance">{{ t('skills.title') }}</h2>
      </Reveal>

      <Reveal :delay="100">
        <p class="text-paper-400 max-w-xl mb-14 text-pretty">{{ t('skills.subtitle') }}</p>
      </Reveal>

      <div class="grid sm:grid-cols-2 gap-6">
        <Reveal v-for="(group, i) in SKILL_GROUPS" :key="group.id" :delay="120 + i * 70">
          <div class="card p-6 h-full">
            <h3 class="font-mono text-xs uppercase tracking-wider text-violet-400 mb-5">
              {{ t(`skills.groups.${group.id}`) }}
            </h3>
            <ul class="flex flex-wrap gap-2 list-none p-0 m-0">
              <li v-for="item in group.items" :key="item" class="chip">{{ item }}</li>
            </ul>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
</template>
