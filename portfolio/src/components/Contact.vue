<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Reveal from '@/components/Reveal.vue'
import SplitText from '@/components/fx/SplitText.vue'
import AuroraBackground from '@/components/fx/AuroraBackground.vue'
import Magnet from '@/components/fx/Magnet.vue'
import { CONTACT } from '@/data/site'

const { t } = useI18n()

const channels = [
  { key: 'contact.emailLabel', value: CONTACT.email, href: `mailto:${CONTACT.email}`, external: false },
  { key: 'contact.linkedinLabel', value: 'in/tommy90112', href: CONTACT.linkedin, external: true },
  { key: 'contact.githubLabel', value: '@tommy90112', href: CONTACT.github, external: true },
] as const
</script>

<template>
  <section id="contact" class="section section-ruled relative overflow-hidden">
    <AuroraBackground :intensity="0.5" />

    <div class="container-x relative">
      <div class="grid-12 gap-y-14">
        <Reveal class="col-major">
          <div class="flex items-center gap-3.5 mb-7">
            <p class="eyebrow m-0">{{ t('contact.eyebrow') }}</p>
            <span class="rule-fill" aria-hidden="true"></span>
          </div>

          <h2 class="h-display text-display-lg m-0 mb-7 text-balance">
            <SplitText :text="t('contact.title')" />
          </h2>

          <p class="text-[17px] text-fg-muted leading-relaxed max-w-prose text-pretty m-0 mb-10">
            {{ t('contact.description') }}
          </p>

          <Magnet :radius="120" :strength="0.26">
            <a :href="`mailto:${CONTACT.email}`" class="btn-primary">
              {{ t('nav.resumeCta') }}
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </Magnet>
        </Reveal>

        <!-- Channels as a ruled index, not a panel: three links do not need a
             container to be understood as a group. -->
        <Reveal :delay="140" class="col-rail md:col-start-9">
          <ul class="list-none p-0 m-0 border-t border-line">
            <li v-for="channel in channels" :key="channel.key" class="border-b border-line">
              <a
                :href="channel.href"
                :target="channel.external ? '_blank' : undefined"
                :rel="channel.external ? 'noopener noreferrer' : undefined"
                class="group/ch flex items-baseline justify-between gap-4 py-5 no-underline"
              >
                <span class="font-mono text-[10.5px] uppercase tracking-[0.16em] text-fg-faint">
                  {{ t(channel.key) }}
                </span>
                <span
                  class="text-sm text-fg group-hover/ch:text-accent transition-colors
                         truncate flex items-center gap-2"
                >
                  {{ channel.value }}
                  <svg
                    class="w-3.5 h-3.5 shrink-0 opacity-0 -translate-x-1 transition-all duration-200
                           group-hover/ch:opacity-100 group-hover/ch:translate-x-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 17L17 7m0 0H8m9 0v9" />
                  </svg>
                </span>
              </a>
            </li>
          </ul>
        </Reveal>
      </div>
    </div>
  </section>
</template>
