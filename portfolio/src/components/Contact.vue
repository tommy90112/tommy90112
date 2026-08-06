<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Reveal from '@/components/Reveal.vue'
import { CONTACT } from '@/data/site'

const { t } = useI18n()

const channels = [
  { key: 'contact.emailLabel', value: CONTACT.email, href: `mailto:${CONTACT.email}`, external: false },
  { key: 'contact.linkedinLabel', value: 'in/tommy90112', href: CONTACT.linkedin, external: true },
  { key: 'contact.githubLabel', value: '@tommy90112', href: CONTACT.github, external: true },
] as const
</script>

<template>
  <section id="contact" class="section border-t border-ink-600 relative overflow-hidden">
    <div
      class="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[420px] rounded-full
             bg-violet-500/[0.06] blur-3xl pointer-events-none"
      aria-hidden="true"
    ></div>

    <div class="container-x relative">
      <div class="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        <div class="lg:col-span-6">
          <Reveal>
            <p class="eyebrow mb-6">{{ t('contact.eyebrow') }}</p>
          </Reveal>
          <Reveal :delay="60">
            <h2 class="h-display text-display-lg mb-6 text-balance">{{ t('contact.title') }}</h2>
          </Reveal>
          <Reveal :delay="120">
            <p class="text-paper-300 leading-relaxed max-w-lg text-pretty mb-9">
              {{ t('contact.description') }}
            </p>
          </Reveal>
          <Reveal :delay="180">
            <a :href="`mailto:${CONTACT.email}`" class="btn-primary">
              {{ t('nav.resumeCta') }}
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </Reveal>
        </div>

        <div class="lg:col-span-6 lg:pt-4">
          <ul class="list-none p-0 m-0 border-t border-ink-600">
            <li v-for="(channel, i) in channels" :key="channel.key">
              <Reveal :delay="140 + i * 70">
                <a
                  :href="channel.href"
                  :target="channel.external ? '_blank' : undefined"
                  :rel="channel.external ? 'noopener noreferrer' : undefined"
                  class="group flex items-baseline justify-between gap-4 py-5 border-b border-ink-600
                         no-underline hover:bg-ink-800/50 transition-colors duration-300 px-1"
                >
                  <span class="font-mono text-[11px] uppercase tracking-wider text-paper-500">
                    {{ t(channel.key) }}
                  </span>
                  <span
                    class="text-sm text-paper-200 group-hover:text-violet-300 transition-colors
                           truncate flex items-center gap-2"
                  >
                    {{ channel.value }}
                    <svg
                      class="w-3.5 h-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 17L17 7m0 0H8m9 0v9" />
                    </svg>
                  </span>
                </a>
              </Reveal>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
