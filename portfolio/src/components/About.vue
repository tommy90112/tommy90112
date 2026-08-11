<script setup lang="ts">
/**
 * About.
 *
 * Body copy sits directly on the page rather than inside a panel. Prose in a
 * card reads as a UI element; prose on the ground reads as something written.
 * The only enclosed block here is the status rail, where the panel is doing
 * real work — separating facts from argument.
 */
import { useI18n } from 'vue-i18n'
import Reveal from '@/components/Reveal.vue'
import SectionHeader from '@/components/SectionHeader.vue'
import { useAvailability } from '@/composables/useAvailability'

const { t } = useI18n()

const availability = useAvailability()

const focusKeys = ['about.focus1', 'about.focus2', 'about.focus3', 'about.focus4'] as const
</script>

<template>
  <section id="about" class="section section-ruled relative">
    <div class="container-x relative">
      <SectionHeader index="01" :label="t('about.eyebrow')" :title="t('about.title')" />

      <div class="grid-12">
        <Reveal :delay="60" class="col-major">
          <div class="space-y-6 text-[17px] leading-[1.7] text-fg-muted text-pretty max-w-prose">
            <!-- The opening paragraph carries the thesis, so it is set a step
                 larger and darker than the two that qualify it. -->
            <p class="text-fg text-lg leading-[1.65] m-0">{{ t('about.p1') }}</p>
            <p class="m-0">{{ t('about.p2') }}</p>
            <p class="m-0">{{ t('about.p3') }}</p>
          </div>
        </Reveal>

        <!-- Starts at column 8, not 9: a 5-column span from 9 runs off the
             12-column bed and grid silently creates a 13th track for it. -->
        <Reveal :delay="140" class="col-minor md:col-start-8">
          <div class="panel p-6 md:p-7">
            <h3 class="font-mono text-[10.5px] uppercase tracking-[0.18em] text-accent m-0 mb-5">
              {{ t('about.factsTitle') }}
            </h3>
            <!--
              Education leads because it is the completed credential; the
              internship is listed as the most recent role, with its dates, so
              the card never implies an ongoing position.
            -->
            <dl class="m-0 divide-y divide-line">
              <div v-if="availability.isOpen.value" class="pb-4">
                <dt class="sr-only">Availability</dt>
                <dd class="m-0 flex items-baseline gap-2 flex-wrap text-accent">
                  <span
                    class="self-center w-1.5 h-1.5 rounded-full bg-accent animate-pulse-soft shrink-0"
                    aria-hidden="true"
                  ></span>
                  <span class="font-mono text-[11px]">{{ availability.status.value }}</span>
                  <span class="font-mono text-[11px] text-fg-faint">
                    {{ availability.timing.value }}
                  </span>
                </dd>
              </div>
              <div :class="availability.isOpen.value ? 'py-4' : 'pb-4'">
                <dt class="sr-only">Education</dt>
                <dd class="text-fg m-0">{{ t('about.factsEducation') }}</dd>
              </div>
              <div class="py-4">
                <dt class="sr-only">Most recent role</dt>
                <dd class="text-sm text-fg-muted m-0">{{ t('about.factsLatest') }}</dd>
              </div>
              <div class="pt-4">
                <dt class="sr-only">Location</dt>
                <dd class="font-mono text-[11px] text-fg-faint m-0">{{ t('about.factsLocation') }}</dd>
              </div>
            </dl>
          </div>
        </Reveal>
      </div>

      <!-- Focus areas as a ruled four-up, not four cards: each item is one
           line of text, and a card around one line is all frame, no picture. -->
      <Reveal :delay="200">
        <h3
          class="font-mono text-[10.5px] uppercase tracking-[0.18em] text-fg-faint
                 mt-16 md:mt-24 pb-4 border-b border-line"
        >
          {{ t('about.focusTitle') }}
        </h3>
        <ul class="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-6 list-none p-0 m-0">
          <li
            v-for="(key, i) in focusKeys"
            :key="key"
            class="flex flex-col gap-3 py-6 border-b border-line
                   lg:border-b-0 lg:border-r lg:last:border-r-0 lg:pr-6"
          >
            <span class="font-mono text-[11px] text-accent tabular-nums">
              {{ String(i + 1).padStart(2, '0') }}
            </span>
            <span class="text-sm text-fg-muted leading-relaxed text-pretty">{{ t(key) }}</span>
          </li>
        </ul>
      </Reveal>
    </div>
  </section>
</template>
