<script setup lang="ts">
/**
 * Section header, in the shape of a numbered paper section.
 *
 * Every section used to open with a centred pill and a centred heading, which
 * made the page read as eight identical slabs. Here the index and label sit on
 * one ruled line, the heading hangs below it, and the optional standfirst is
 * held to a readable measure off to one side — so the eye gets a consistent
 * entry point without a consistent silhouette.
 */
import Reveal from '@/components/Reveal.vue'
import SplitText from '@/components/fx/SplitText.vue'

withDefaults(
  defineProps<{
    /** Two-digit section number, e.g. `03`. */
    index: string
    /** Short uppercase label sitting on the rule. */
    label: string
    title: string
    /** Optional standfirst below the heading. */
    subtitle?: string
  }>(),
  { subtitle: undefined },
)
</script>

<template>
  <header class="mb-12 md:mb-16">
    <Reveal>
      <div class="flex items-center gap-4">
        <span class="section-index">{{ index }}</span>
        <span class="eyebrow">{{ label }}</span>
        <span class="rule-fill" aria-hidden="true"></span>
      </div>
    </Reveal>

    <div class="mt-7 grid-12 items-end">
      <h2 class="h-display text-display-md text-balance col-wide m-0">
        <SplitText :text="title" />
      </h2>

      <Reveal v-if="subtitle" :delay="140" class="col-rail">
        <p class="text-sm text-fg-muted leading-relaxed text-pretty m-0 md:pb-2">
          {{ subtitle }}
        </p>
      </Reveal>
    </div>
  </header>
</template>
