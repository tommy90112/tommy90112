<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWindowScroll } from '@vueuse/core'

const { t } = useI18n()
const { y } = useWindowScroll()

const isVisible = computed(() => y.value > 600)

function toTop(): void {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-300"
    enter-from-class="opacity-0 translate-y-2"
    leave-active-class="transition duration-200"
    leave-to-class="opacity-0 translate-y-2"
  >
    <button
      v-show="isVisible"
      type="button"
      class="fixed bottom-24 right-6 z-40 w-11 h-11 grid place-items-center rounded-full
             bg-ink-900/70 border border-white/[0.10] backdrop-blur-2xl shadow-glass text-paper-300
             hover:border-violet-400/60 hover:text-paper-50 transition-colors"
      :aria-label="t('a11y.backToTop')"
      @click="toTop"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  </Transition>
</template>
