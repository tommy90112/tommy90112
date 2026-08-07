<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Reveal from '@/components/Reveal.vue'
import ProjectCard from '@/components/ProjectCard.vue'
import SplitText from '@/components/fx/SplitText.vue'
import { PROJECTS, type Project } from '@/data/site'

const { t } = useI18n()

/**
 * The bento span lives on the reveal wrapper, not the card: the wrapper is the
 * direct grid child, so a span class on the card itself would have no grid to
 * apply to.
 */
function spanClass(project: Project): string {
  return project.span === 'full' ? 'bento-full' : 'bento-half'
}
</script>

<template>
  <section id="work" class="section relative border-t border-white/[0.06]">
    <div class="absolute inset-0 dot-bg opacity-40 pointer-events-none" aria-hidden="true"></div>

    <div class="container-x relative">
      <Reveal>
        <p class="eyebrow mb-6">{{ t('projects.eyebrow') }}</p>
      </Reveal>

      <h2 class="h-display text-display-md mb-5 text-balance max-w-3xl">
        <SplitText :text="t('projects.title')" />
      </h2>

      <Reveal :delay="120">
        <p class="text-paper-400 max-w-2xl mb-14 text-pretty">{{ t('projects.subtitle') }}</p>
      </Reveal>

      <div class="bento">
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
