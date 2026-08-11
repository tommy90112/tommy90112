<script setup lang="ts">
/**
 * Theme control — a three-state menu, not a sun/moon switch.
 *
 * A binary toggle can't express "follow my system", which is the state most
 * visitors arrive in and the only one that stays correct after sunset. So the
 * control names all three states and shows which is active, at the cost of one
 * extra click for the people who want to override.
 *
 * Semantics are a radio group inside a popover: the options are mutually
 * exclusive settings, not commands, and screen readers announce the current
 * choice without needing a live region.
 */
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { onClickOutside, onKeyStroke } from '@vueuse/core'
import { THEME_PREFERENCES, useTheme, type ThemePreference } from '@/composables/useTheme'

const { t } = useI18n()
const { preference, resolved, setPreference } = useTheme()

const rootRef = ref<HTMLElement | null>(null)
const buttonRef = ref<HTMLButtonElement | null>(null)
const isOpen = ref(false)

const currentLabel = computed(() => t(`theme.${preference.value}`))

function close(): void {
  isOpen.value = false
}

function choose(next: ThemePreference): void {
  setPreference(next)
  close()
  // Focus belongs back on the trigger, or keyboard users are dropped at the
  // top of the document when the menu unmounts.
  buttonRef.value?.focus()
}

onClickOutside(rootRef, close)

onKeyStroke('Escape', () => {
  if (!isOpen.value) return
  close()
  buttonRef.value?.focus()
})
</script>

<template>
  <div ref="rootRef" class="relative">
    <button
      ref="buttonRef"
      type="button"
      class="flex items-center gap-2 h-9 px-3 border border-line
             font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-fg-muted
             transition-colors duration-150 hover:border-line-strong hover:text-fg"
      :aria-label="t('a11y.toggleTheme')"
      :aria-expanded="isOpen"
      aria-haspopup="true"
      @click="isOpen = !isOpen"
    >
      <!-- Filled when the page is currently dark, hollow when light: the state
           the label can't show, since "auto" names a rule rather than a result.
           The one round thing in the interface — it is a status light, not a
           container. -->
      <span
        class="w-2 h-2 rounded-full border border-current"
        :class="resolved === 'dark' ? 'bg-current' : 'bg-transparent'"
        aria-hidden="true"
      ></span>
      {{ currentLabel }}
    </button>

    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      leave-active-class="transition duration-75 ease-in"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 top-full mt-1 min-w-[8.5rem] bg-page border border-line"
        role="radiogroup"
        :aria-label="t('a11y.toggleTheme')"
      >
        <button
          v-for="option in THEME_PREFERENCES"
          :key="option"
          type="button"
          role="radio"
          :aria-checked="preference === option"
          class="flex w-full items-center justify-between gap-3 px-3 py-2
                 border-b border-line last:border-b-0
                 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-left
                 transition-colors duration-100"
          :class="
            preference === option
              ? 'bg-fg text-page'
              : 'text-fg-muted hover:bg-surface-raised hover:text-fg'
          "
          @click="choose(option)"
        >
          {{ t(`theme.${option}`) }}
        </button>
      </div>
    </Transition>
  </div>
</template>
