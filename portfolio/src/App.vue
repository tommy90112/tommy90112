<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Navbar from '@/components/Navbar.vue'
import Hero from '@/components/Hero.vue'
import About from '@/components/About.vue'
import Experience from '@/components/Experience.vue'
import Projects from '@/components/Projects.vue'
import Skills from '@/components/Skills.vue'
import Certifications from '@/components/Certifications.vue'
import Awards from '@/components/Awards.vue'
import Contact from '@/components/Contact.vue'
import Footer from '@/components/Footer.vue'
import ScrollToTop from '@/components/ScrollToTop.vue'
import Dock from '@/components/fx/Dock.vue'
import type { DockItem } from '@/components/fx/types'
import { CERTIFICATIONS, NAV_SECTIONS } from '@/data/site'
import { useActiveSection } from '@/composables/useActiveSection'

const { t } = useI18n()

/**
 * Some sections only render once they have content. Navigation is derived
 * from the same condition, so the Dock never offers a target that isn't on
 * the page.
 */
const RENDERED_WHEN: Record<string, boolean> = {
  certifications: CERTIFICATIONS.length > 0,
}

const visibleSections = NAV_SECTIONS.filter((section) => RENDERED_WHEN[section.id] ?? true)
const sectionIds = visibleSections.map((section) => section.id)
const activeSection = useActiveSection(sectionIds)

const dockItems = computed<DockItem[]>(() =>
  visibleSections.map((section) => ({
    id: section.id,
    label: t(section.key),
    icon: section.icon,
    active: activeSection.value === section.id,
  })),
)

function scrollToSection(id: string): void {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <a
    href="#about"
    class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-skip
           focus:px-4 focus:py-2 focus:bg-accent focus:text-accent-on
           focus:font-mono focus:text-xs focus:font-medium"
  >
    Skip to content
  </a>

  <Navbar />

  <main>
    <Hero />
    <About />
    <Experience />
    <Projects />
    <Skills />
    <Certifications />
    <Awards />
    <Contact />
  </main>

  <Footer />

  <Dock :items="dockItems" @select="scrollToSection" />
  <ScrollToTop />
</template>
