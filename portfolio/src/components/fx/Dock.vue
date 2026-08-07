<script setup lang="ts">
/**
 * Dock — a row of glass bubbles for section navigation.
 *
 * Deliberately *not* the magnifying macOS dock: scaling each bubble as the
 * pointer passes made neighbours overlap at the peak, and worse, it moved the
 * target while the user was aiming at it. A navigation control should hold
 * still. Feedback here is colour and border only, plus a label on hover/focus.
 */
import type { DockItem } from '@/components/fx/types'

defineProps<{ items: readonly DockItem[] }>()

const emit = defineEmits<{ select: [id: string] }>()
</script>

<template>
  <nav
    class="fixed inset-x-0 bottom-5 z-40 flex justify-center px-4 pointer-events-none"
    aria-label="Section navigation"
  >
    <ul
      class="pointer-events-auto flex items-center gap-1.5 sm:gap-2 rounded-full px-2.5 py-2
             bg-ink-800/60 border border-white/[0.14] backdrop-blur-2xl shadow-glass-lifted
             list-none m-0"
    >
      <li v-for="item in items" :key="item.id" class="relative">
        <button
          type="button"
          class="group/dock relative grid place-items-center w-11 h-11 rounded-full border
                 transition-colors duration-200"
          :class="
            item.active
              ? 'bg-violet-500/25 border-violet-400/60 text-violet-200'
              : 'bg-white/[0.06] border-white/[0.10] text-paper-300 hover:bg-white/[0.12] hover:border-white/25 hover:text-paper-50'
          "
          :aria-label="item.label"
          :aria-current="item.active ? 'true' : undefined"
          @click="emit('select', item.id)"
        >
          <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" :d="item.icon" />
          </svg>

          <!-- Label surfaces on hover / focus; the aria-label carries it otherwise. -->
          <span
            class="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-1
                   bg-ink-800/95 border border-white/10 font-mono text-[10px] uppercase tracking-wider
                   text-paper-200 opacity-0 transition-opacity duration-150 pointer-events-none
                   group-hover/dock:opacity-100 group-focus-visible/dock:opacity-100"
            aria-hidden="true"
          >
            {{ item.label }}
          </span>
        </button>
      </li>
    </ul>
  </nav>
</template>
