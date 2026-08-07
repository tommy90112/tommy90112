<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Navbar from '@/components/Navbar.vue'
import Hero from '@/components/Hero.vue'
import About from '@/components/About.vue'
import Experience from '@/components/Experience.vue'
import Projects from '@/components/Projects.vue'
import Skills from '@/components/Skills.vue'
import Awards from '@/components/Awards.vue'
import Contact from '@/components/Contact.vue'
import Footer from '@/components/Footer.vue'
import ScrollToTop from '@/components/ScrollToTop.vue'
import Dock from '@/components/fx/Dock.vue'
import ClickSpark from '@/components/fx/ClickSpark.vue'
import PageBackdrop from '@/components/fx/PageBackdrop.vue'
import type { DockItem } from '@/components/fx/types'
import { NAV_SECTIONS } from '@/data/site'
import { useActiveSection } from '@/composables/useActiveSection'

const { t } = useI18n()

const sectionIds = NAV_SECTIONS.map((section) => section.id)
const activeSection = useActiveSection(sectionIds)

const dockItems = computed<DockItem[]>(() =>
  NAV_SECTIONS.map((section) => ({
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
    class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60]
           focus:px-4 focus:py-2 focus:rounded-full focus:bg-violet-500 focus:text-white"
  >
    Skip to content
  </a>

  <PageBackdrop />

  <Navbar />

  <main>
    <Hero />
    <About />
    <Experience />
    <Projects />
    <Skills />
    <Awards />
    <Contact />
  </main>

  <Footer />

  <Dock :items="dockItems" @select="scrollToSection" />
  <ScrollToTop />
  <ClickSpark />
</template>
