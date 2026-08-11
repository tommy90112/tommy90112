<script setup lang="ts">
/**
 * Contact.
 *
 * The ambient wash behind this section was removed with the rest of the
 * atmosphere: the closing block is the one place the page asks for something,
 * and a coloured haze under the ask reads as decoration exactly where clarity
 * is worth most.
 */
import { useI18n } from 'vue-i18n'
import Reveal from '@/components/Reveal.vue'
import SplitText from '@/components/fx/SplitText.vue'
import { CONTACT } from '@/data/site'
import { useAvailability } from '@/composables/useAvailability'

const { t } = useI18n()

const availability = useAvailability()

const channels = [
  { key: 'contact.emailLabel', value: CONTACT.email, href: `mailto:${CONTACT.email}`, external: false },
  { key: 'contact.linkedinLabel', value: 'in/tommy90112', href: CONTACT.linkedin, external: true },
  { key: 'contact.githubLabel', value: '@tommy90112', href: CONTACT.github, external: true },
] as const
</script>

<template>
  <section id="contact" class="section section-ruled relative">
    <div class="container-x relative">
      <div class="grid-12 gap-y-12">
        <Reveal class="col-major">
          <div class="flex items-center gap-4 pb-4 border-b border-line-strong">
            <span class="section-index">07</span>
            <span class="eyebrow">{{ t('contact.eyebrow') }}</span>
            <span class="rule-fill" aria-hidden="true"></span>
          </div>

          <h2 class="h-display text-display-lg m-0 mt-8 mb-6">
            <SplitText :text="t('contact.title')" />
          </h2>

          <p class="text-base text-fg-muted leading-[1.6] max-w-prose text-pretty m-0 mb-4">
            {{ t('contact.description') }}
          </p>

          <p
            v-if="availability.isOpen.value"
            class="font-mono text-[11px] leading-[1.65] text-fg-faint max-w-prose m-0 mb-9"
          >
            {{ availability.detail.value }}
          </p>

          <a :href="`mailto:${CONTACT.email}`" class="btn-primary">
            {{ t('nav.resumeCta') }}
          </a>
        </Reveal>

        <!-- Channels as a ruled index, not a panel: three links do not need a
             container to be understood as a group. -->
        <Reveal :delay="120" class="col-rail md:col-start-9">
          <ul class="list-none p-0 m-0 border-t border-line-strong">
            <li v-for="channel in channels" :key="channel.key" class="border-b border-line">
              <a
                :href="channel.href"
                :target="channel.external ? '_blank' : undefined"
                :rel="channel.external ? 'noopener noreferrer' : undefined"
                class="group/ch flex items-baseline justify-between gap-4 py-4 no-underline"
              >
                <span
                  class="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-fg-faint"
                >
                  {{ t(channel.key) }}
                </span>
                <span
                  class="text-sm text-fg group-hover/ch:text-accent transition-colors
                         truncate flex items-center gap-2"
                >
                  {{ channel.value }}
                  <svg
                    class="w-3 h-3 shrink-0 opacity-0 -translate-x-1 transition-all duration-150
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
