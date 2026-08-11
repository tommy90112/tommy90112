<script setup lang="ts">
/**
 * Dock — the section index, pinned to the bottom of the viewport.
 *
 * Deliberately *not* the magnifying macOS dock: scaling each bubble as the
 * pointer passes made neighbours overlap at the peak, and worse, it moved the
 * target while the user was aiming at it. A navigation control should hold
 * still. Feedback here is an inverted cell for the current section and a label
 * on hover or focus.
 */
import type { DockItem } from '@/components/fx/types'

defineProps<{ items: readonly DockItem[] }>()

const emit = defineEmits<{ select: [id: string] }>()
</script>

<template>
  <!-- Centred by translation rather than by a full-bleed flex row: an
       `inset-x-0` fixed element is as wide as the layout viewport, which on
       mobile is wider than `clientWidth` and scrolls the page sideways. -->
  <nav
    class="fixed bottom-0 left-1/2 -translate-x-1/2 z-dock pointer-events-none"
    aria-label="Section navigation"
  >
    <ul
      class="pointer-events-auto flex items-center bg-page border border-line border-b-0
             list-none m-0 p-0"
    >
      <li v-for="item in items" :key="item.id" class="relative border-l border-line first:border-l-0">
        <button
          type="button"
          class="group/dock relative grid place-items-center w-11 h-11 transition-colors duration-150"
          :class="
            item.active
              ? 'bg-fg text-page'
              : 'text-fg-faint hover:bg-surface-raised hover:text-fg'
          "
          :aria-label="item.label"
          :aria-current="item.active ? 'true' : undefined"
          @click="emit('select', item.id)"
        >
          <svg
            class="w-[18px] h-[18px]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" :d="item.icon" />
          </svg>

          <!-- Label surfaces on hover / focus; the aria-label carries it otherwise. -->
          <span
            class="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1
                   bg-fg text-page font-mono text-[10px] font-medium uppercase tracking-[0.12em]
                   opacity-0 transition-opacity duration-150 pointer-events-none
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
