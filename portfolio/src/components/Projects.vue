<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Reveal from '@/components/Reveal.vue'
import SectionHeader from '@/components/SectionHeader.vue'
import ProjectCard from '@/components/ProjectCard.vue'
import { PROJECTS, type Project } from '@/data/site'

const { t } = useI18n()

/**
 * The column span lives on the reveal wrapper, not the card: the wrapper is the
 * direct grid child, so a span class on the card itself would have no grid to
 * apply to.
 */
function spanClass(project: Project): string {
  return project.span === 'full' ? 'col-full' : 'col-half'
}
</script>

<template>
  <section id="work" class="section section-ruled relative bg-sunk">
    <div class="container-x relative">
      <SectionHeader
        index="03"
        :label="t('projects.eyebrow')"
        :title="t('projects.title')"
        :subtitle="t('projects.subtitle')"
      />

      <div class="grid-12">
        <Reveal
          v-for="(project, i) in PROJECTS"
          :key="project.id"
          :delay="i < 2 ? 60 : 0"
          :class="[spanClass(project), 'h-full']"
        >
          <ProjectCard :project="project" :index="i" />
        </Reveal>
      </div>
    </div>
  </section>
</template>
