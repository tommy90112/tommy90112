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
    enter-active-class="transition duration-200"
    enter-from-class="opacity-0 translate-y-1"
    leave-active-class="transition duration-150"
    leave-to-class="opacity-0 translate-y-1"
  >
    <!-- Sits clear of the Dock, which is centred and bottom-flush. -->
    <button
      v-show="isVisible"
      type="button"
      class="fixed bottom-4 right-4 z-dock w-10 h-10 grid place-items-center
             bg-page border border-line text-fg-muted transition-colors duration-150
             hover:bg-fg hover:border-fg hover:text-page"
      :aria-label="t('a11y.backToTop')"
      @click="toTop"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  </Transition>
</template>
