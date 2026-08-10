<script setup lang="ts">
/**
 * Dock — the section index, pinned to the bottom of the viewport.
 *
 * Deliberately *not* the magnifying macOS dock: scaling each bubble as the
 * pointer passes made neighbours overlap at the peak, and worse, it moved the
 * target while the user was aiming at it. A navigation control should hold
 * still. Feedback here is colour, an underline for the current section, and a
 * label on hover or focus.
 */
import type { DockItem } from '@/components/fx/types'

defineProps<{ items: readonly DockItem[] }>()

const emit = defineEmits<{ select: [id: string] }>()
</script>

<template>
  <nav
    class="fixed inset-x-0 bottom-5 z-dock flex justify-center px-4 pointer-events-none"
    aria-label="Section navigation"
  >
    <ul class="pointer-events-auto flex items-center gap-0.5 rounded-panel px-1.5 py-1.5 chrome list-none m-0">
      <li v-for="item in items" :key="item.id" class="relative">
        <button
          type="button"
          class="group/dock relative grid place-items-center w-10 h-10 rounded-inner
                 transition-colors duration-200"
          :class="
            item.active
              ? 'text-accent bg-surface-raised'
              : 'text-fg-faint hover:bg-surface-raised hover:text-fg'
          "
          :aria-label="item.label"
          :aria-current="item.active ? 'true' : undefined"
          @click="emit('select', item.id)"
        >
          <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" :d="item.icon" />
          </svg>

          <!-- Reading position, marked the way a running head is. -->
          <span
            v-if="item.active"
            class="absolute inset-x-2.5 bottom-1 h-px bg-accent"
            aria-hidden="true"
          ></span>

          <!-- Label surfaces on hover / focus; the aria-label carries it otherwise. -->
          <span
            class="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-inner px-2 py-1
                   bg-surface border border-line font-mono text-[10px] uppercase tracking-[0.12em]
                   text-fg-muted opacity-0 transition-opacity duration-150 pointer-events-none
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
