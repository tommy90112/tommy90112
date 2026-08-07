<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Reveal from '@/components/Reveal.vue'
import SplitText from '@/components/fx/SplitText.vue'
import SpotlightCard from '@/components/fx/SpotlightCard.vue'
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
  <section id="contact" class="section relative border-t border-white/[0.06] overflow-hidden">
    <AuroraBackground :intensity="0.62" />

    <div class="container-x relative">
      <div class="bento">
        <!-- Pitch -->
        <Reveal class="bento-half h-full">
          <div class="h-full flex flex-col justify-center">
            <p class="eyebrow mb-6">{{ t('contact.eyebrow') }}</p>

            <h2 class="h-display text-display-lg mb-6 text-balance">
              <SplitText :text="t('contact.title')" />
            </h2>

            <p class="text-paper-300 leading-relaxed max-w-lg text-pretty mb-9">
              {{ t('contact.description') }}
            </p>

            <div>
              <Magnet :radius="130" :strength="0.3">
                <a :href="`mailto:${CONTACT.email}`" class="btn-primary">
                  {{ t('nav.resumeCta') }}
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </Magnet>
            </div>
          </div>
        </Reveal>

        <!-- Channels -->
        <Reveal :delay="140" class="bento-half h-full">
          <SpotlightCard tilt :max-tilt="4" class="h-full p-3 md:p-4">
            <ul class="list-none p-0 m-0">
              <li
                v-for="(channel, i) in channels"
                :key="channel.key"
                :class="i > 0 ? 'border-t border-white/[0.07]' : ''"
              >
                <a
                  :href="channel.href"
                  :target="channel.external ? '_blank' : undefined"
                  :rel="channel.external ? 'noopener noreferrer' : undefined"
                  class="group/ch flex items-baseline justify-between gap-4 rounded-2xl px-5 py-6
                         no-underline transition-colors duration-300 hover:bg-white/[0.05]"
                >
                  <span class="font-mono text-[11px] uppercase tracking-wider text-paper-500">
                    {{ t(channel.key) }}
                  </span>
                  <span
                    class="text-sm text-paper-200 group-hover/ch:text-violet-300 transition-colors
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
          </SpotlightCard>
        </Reveal>
      </div>
    </div>
  </section>
</template>
