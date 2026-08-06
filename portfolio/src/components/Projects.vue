<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Reveal from '@/components/Reveal.vue'
import ProjectCard from '@/components/ProjectCard.vue'
import { PROJECTS } from '@/data/site'

const { t } = useI18n()
</script>

<template>
  <section id="work" class="section border-t border-ink-600">
    <div class="container-x">
      <Reveal>
        <p class="eyebrow mb-6">{{ t('projects.eyebrow') }}</p>
      </Reveal>

      <Reveal :delay="60">
        <h2 class="h-display text-display-md mb-5 text-balance max-w-3xl">
          {{ t('projects.title') }}
        </h2>
      </Reveal>

      <Reveal :delay="120">
        <p class="text-paper-400 max-w-2xl mb-14 text-pretty">{{ t('projects.subtitle') }}</p>
      </Reveal>

      <div class="space-y-8">
        <Reveal v-for="(project, i) in PROJECTS" :key="project.id" :delay="i < 2 ? 60 : 0">
          <ProjectCard :project="project" :index="i" />
        </Reveal>
      </div>
    </div>
  </section>
</template>
