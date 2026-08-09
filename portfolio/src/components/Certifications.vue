<script setup lang="ts">
/**
 * Certifications.
 *
 * Renders nothing at all while `CERTIFICATIONS` is empty — an empty section
 * would otherwise leave a titled panel with no content, which reads worse
 * than not having the section. Sits between Skills and Awards: what you can
 * do, then what is certified, then what was recognised.
 *
 * Uses a plain auto-fitting grid rather than the 6-column bento bed, because
 * the entry count is open-ended and a fixed span would strand the last card.
 */
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Reveal from '@/components/Reveal.vue'
import SplitText from '@/components/fx/SplitText.vue'
import SpotlightCard from '@/components/fx/SpotlightCard.vue'
import { CERTIFICATIONS, type CertificationEntry } from '@/data/site'

const { t } = useI18n()

const BADGE_ICON = 'M9 12l2 2 4-4M12 3l7 4v5c0 4.4-3 8.4-7 9.5C8 20.4 5 16.4 5 12V7l7-4z'

/**
 * Ids whose badge image failed to load, so the card can fall back to the
 * generic mark. Without this a `badge` path pointing at a file that has not
 * been added yet renders the browser's broken-image glyph.
 */
const failedBadges = ref<ReadonlySet<string>>(new Set())

function onBadgeError(id: string): void {
  failedBadges.value = new Set([...failedBadges.value, id])
}

const showsBadge = computed(
  () => (cert: CertificationEntry) => Boolean(cert.badge) && !failedBadges.value.has(cert.id),
)

/** Resolve a `public/` path against the deploy base (`/tommy90112/`). */
function assetUrl(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}
</script>

<template>
  <section
    v-if="CERTIFICATIONS.length > 0"
    id="certifications"
    class="section relative border-t border-white/[0.06]"
  >
    <div class="container-x relative">
      <Reveal>
        <p class="eyebrow mb-6">{{ t('certifications.eyebrow') }}</p>
      </Reveal>

      <h2 class="h-display text-display-md mb-4 text-balance">
        <SplitText :text="t('certifications.title')" />
      </h2>

      <Reveal :delay="100">
        <p class="text-paper-400 max-w-xl mb-14 text-pretty">
          {{ t('certifications.subtitle') }}
        </p>
      </Reveal>

      <ul class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 list-none p-0 m-0">
        <li v-for="(cert, i) in CERTIFICATIONS" :key="cert.id">
          <Reveal :delay="120 + i * 70" class="h-full">
            <SpotlightCard tilt :max-tilt="5" class="h-full">
              <component
                :is="cert.link ? 'a' : 'div'"
                :href="cert.link ?? undefined"
                :target="cert.link ? '_blank' : undefined"
                :rel="cert.link ? 'noopener noreferrer' : undefined"
                class="group/cert flex h-full flex-col p-6 md:p-7 no-underline"
              >
                <!-- Issuer badge artwork when supplied and loadable, generic
                     mark otherwise. -->
                <img
                  v-if="showsBadge(cert)"
                  :src="assetUrl(cert.badge!)"
                  alt=""
                  loading="lazy"
                  decoding="async"
                  class="mb-5 w-16 h-16 object-contain
                         transition-transform duration-300 group-hover/cert:scale-105"
                  @error="onBadgeError(cert.id)"
                />
                <span
                  v-else
                  class="mb-5 grid place-items-center w-10 h-10 rounded-xl
                         bg-violet-500/10 border border-violet-400/25 text-violet-300
                         transition-colors duration-300 group-hover/cert:bg-violet-500/20"
                  aria-hidden="true"
                >
                  <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" :d="BADGE_ICON" />
                  </svg>
                </span>

                <h3 class="text-base text-paper-50 mb-2 text-pretty">
                  {{ t(`certifications.items.${cert.id}.name`) }}
                </h3>

                <p class="text-sm text-paper-400 text-pretty mb-4">
                  {{ t(`certifications.items.${cert.id}.issuer`) }}
                </p>

                <div class="mt-auto flex items-center justify-between gap-3">
                  <!-- An empty `date` collapses to zero width; `justify-between`
                       then simply pins the verify link to the right. -->
                  <span class="font-mono text-[11px] text-paper-500">
                    {{ t(`certifications.items.${cert.id}.date`) }}
                  </span>

                  <span
                    v-if="cert.link"
                    class="inline-flex items-center gap-1.5 font-mono text-[11px] text-paper-400
                           transition-colors group-hover/cert:text-violet-300"
                  >
                    {{ t('certifications.verify') }}
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 17L17 7m0 0H8m9 0v9" />
                    </svg>
                  </span>
                </div>
              </component>
            </SpotlightCard>
          </Reveal>
        </li>
      </ul>
    </div>
  </section>
</template>
