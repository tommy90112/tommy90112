<script setup lang="ts">
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
</script>

<template>
  <a
    href="#about"
    class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60]
           focus:px-4 focus:py-2 focus:rounded-full focus:bg-violet-500 focus:text-white"
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
    <Awards />
    <Contact />
  </main>

  <Footer />
  <ScrollToTop />
</template>
