<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Reveal from '@/components/Reveal.vue'

const { t } = useI18n()

const focusKeys = ['about.focus1', 'about.focus2', 'about.focus3', 'about.focus4'] as const
</script>

<template>
  <section id="about" class="section border-t border-ink-600">
    <div class="container-x">
      <Reveal>
        <p class="eyebrow mb-6">{{ t('about.eyebrow') }}</p>
      </Reveal>

      <div class="grid lg:grid-cols-12 gap-10 lg:gap-16">
        <div class="lg:col-span-7">
          <Reveal :delay="60">
            <h2 class="h-display text-display-md mb-8 text-balance">{{ t('about.title') }}</h2>
          </Reveal>

          <Reveal :delay="120">
            <div class="space-y-5 text-paper-300 leading-relaxed text-pretty">
              <p>{{ t('about.p1') }}</p>
              <p>{{ t('about.p2') }}</p>
              <p>{{ t('about.p3') }}</p>
            </div>
          </Reveal>
        </div>

        <div class="lg:col-span-5 space-y-6">
          <Reveal :delay="180">
            <div class="card p-6">
              <h3 class="font-mono text-xs uppercase tracking-wider text-violet-400 mb-5">
                {{ t('about.focusTitle') }}
              </h3>
              <ul class="space-y-3.5 list-none p-0 m-0">
                <li
                  v-for="key in focusKeys"
                  :key="key"
                  class="flex gap-3 text-sm text-paper-300 leading-relaxed"
                >
                  <span class="mt-2 w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" aria-hidden="true"></span>
                  {{ t(key) }}
                </li>
              </ul>
            </div>
          </Reveal>

          <Reveal :delay="240">
            <div class="card p-6">
              <h3 class="font-mono text-xs uppercase tracking-wider text-amber-400 mb-5">
                {{ t('about.currentTitle') }}
              </h3>
              <dl class="space-y-3 text-sm m-0">
                <div>
                  <dt class="sr-only">Employer</dt>
                  <dd class="text-paper-100">{{ t('about.currentRole') }}</dd>
                </div>
                <div>
                  <dt class="sr-only">Study</dt>
                  <dd class="text-paper-300">{{ t('about.currentStudy') }}</dd>
                </div>
                <div>
                  <dt class="sr-only">Location</dt>
                  <dd class="font-mono text-xs text-paper-500">{{ t('about.currentLocation') }}</dd>
                </div>
              </dl>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  </section>
</template>
