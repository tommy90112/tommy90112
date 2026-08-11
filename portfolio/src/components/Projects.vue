<script setup lang="ts">
/**
 * Selected work, filterable by problem domain.
 *
 * Filtering is client-side over a fixed six-item list — no fetching, no
 * pagination, no URL state. Each card also carries a stable `id` so a specific
 * project can be linked to directly, which matters when the link is going into
 * an application email.
 *
 * The filter never empties the section: every domain in `PROJECT_DOMAINS` is
 * derived from the data, so a domain with no projects cannot be offered.
 */
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Reveal from '@/components/Reveal.vue'
import SectionHeader from '@/components/SectionHeader.vue'
import ProjectFilter from '@/components/ProjectFilter.vue'
import ProjectCard from '@/components/ProjectCard.vue'
import { PROJECTS, PROJECT_DOMAINS, type Project, type ProjectDomain } from '@/data/site'

const { t } = useI18n()

const activeDomain = ref<ProjectDomain | null>(null)

/** Only domains that actually have work behind them become filters. */
const domainCounts = computed(
  () =>
    Object.fromEntries(
      PROJECT_DOMAINS.map((domain) => [
        domain,
        PROJECTS.filter((project) => project.domains.includes(domain)).length,
      ]),
    ) as Record<ProjectDomain, number>,
)

const offeredDomains = computed(() =>
  PROJECT_DOMAINS.filter((domain) => domainCounts.value[domain] > 0),
)

const visibleProjects = computed(() => {
  const domain = activeDomain.value
  if (domain === null) return PROJECTS
  return PROJECTS.filter((project) => project.domains.includes(domain))
})

/**
 * A half-width card left alone on the last row looks like a loading state, so
 * the trailing card takes the full row when the filter leaves an odd count.
 * The card is told about it — its internal layout depends on the width it
 * actually gets, not on the width it was authored at.
 */
function isFullWidth(project: Project, index: number): boolean {
  if (project.span === 'full') return true
  const isLast = index === visibleProjects.value.length - 1
  return isLast && visibleProjects.value.length % 2 === 1
}

function select(domain: ProjectDomain | null): void {
  activeDomain.value = domain
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

      <ProjectFilter
        :domains="offeredDomains"
        :counts="domainCounts"
        :active="activeDomain"
        :shown="visibleProjects.length"
        :total="PROJECTS.length"
        @select="select"
      />

      <div class="grid-12 mt-6">
        <!--
          Keyed by project id, not by index: on filter the list is rebuilt, and
          an index key would make Vue patch card A's DOM into card B rather
          than move it, discarding each card's own visualisation state.
        -->
        <Reveal
          v-for="(project, i) in visibleProjects"
          :key="project.id"
          :delay="i < 2 ? 40 : 0"
          :class="[isFullWidth(project, i) ? 'col-full' : 'col-half', 'h-full']"
        >
          <ProjectCard :project="project" :index="i" :full-width="isFullWidth(project, i)" />
        </Reveal>
      </div>
    </div>
  </section>
</template>
