<script setup lang="ts">
/**
 * Dock — macOS-style magnifying navigation bar.
 *
 * Scale falls off as a Gaussian of the pointer's horizontal distance from each
 * item's centre, which is what gives the smooth "wave" instead of items
 * snapping between sizes. Item centres are measured once per pointer frame
 * from live rects, so the magnification stays correct while the row is itself
 * resizing under the effect.
 *
 * Keyboard users get a plain focusable button row with no magnification —
 * the effect is pointer-only decoration, never the affordance.
 */
import { computed, onUnmounted, ref } from 'vue'
import { usePrefersReducedMotion } from '@/composables/usePrefersReducedMotion'
import type { DockItem } from '@/components/fx/types'

const props = withDefaults(
  defineProps<{
    items: readonly DockItem[]
    /** Peak extra scale directly under the pointer. */
    amplitude?: number
    /** px over which magnification falls off. */
    spread?: number
  }>(),
  { amplitude: 0.55, spread: 88 },
)

const emit = defineEmits<{ select: [id: string] }>()

const prefersReduced = usePrefersReducedMotion()
const listRef = ref<HTMLElement | null>(null)
const scales = ref<number[]>([])

let frameId = 0
let pendingX: number | null = null

const enabled = computed(
  () =>
    !prefersReduced.value &&
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches,
)

function scaleAt(index: number): number {
  return scales.value[index] ?? 1
}

function itemStyle(index: number): Record<string, string> | undefined {
  if (!enabled.value) return undefined
  const scale = scaleAt(index)
  return {
    transform: `scale(${scale}) translateY(${-(scale - 1) * 12}px)`,
  }
}

function applyPointer(): void {
  frameId = 0
  const x = pendingX
  const list = listRef.value
  pendingX = null
  if (x === null || !list) return

  const buttons = Array.from(list.querySelectorAll<HTMLElement>('[data-dock-item]'))
  scales.value = buttons.map((button) => {
    const rect = button.getBoundingClientRect()
    const centre = rect.left + rect.width / 2
    const distance = Math.abs(x - centre)
    // Gaussian falloff — smooth, and reaches ~1 well before the row's edge.
    return 1 + props.amplitude * Math.exp(-((distance / props.spread) ** 2))
  })
}

function onPointerMove(event: PointerEvent): void {
  if (!enabled.value) return
  pendingX = event.clientX
  if (frameId) return
  frameId = requestAnimationFrame(applyPointer)
}

function onPointerLeave(): void {
  if (frameId) {
    cancelAnimationFrame(frameId)
    frameId = 0
  }
  pendingX = null
  scales.value = []
}

onUnmounted(() => {
  if (frameId) cancelAnimationFrame(frameId)
})
</script>

<template>
  <nav
    class="fixed inset-x-0 bottom-5 z-40 flex justify-center px-4 pointer-events-none"
    :aria-label="'Section navigation'"
  >
    <ul
      ref="listRef"
      class="pointer-events-auto flex items-end gap-1 sm:gap-2 rounded-full px-3 py-2
             bg-ink-900/70 border border-white/[0.10] backdrop-blur-2xl shadow-glass-lifted
             list-none m-0"
      @pointermove="onPointerMove"
      @pointerleave="onPointerLeave"
    >
      <li v-for="(item, i) in props.items" :key="item.id" class="relative">
        <button
          type="button"
          data-dock-item
          class="group/dock relative grid place-items-center w-10 h-10 sm:w-11 sm:h-11 rounded-full
                 border transition-[background-color,border-color,color,transform] duration-200
                 origin-bottom will-change-transform"
          :class="
            item.active
              ? 'bg-violet-500/20 border-violet-400/50 text-violet-200'
              : 'bg-white/[0.04] border-white/[0.08] text-paper-400 hover:text-paper-100 hover:border-white/20'
          "
          :style="itemStyle(i)"
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
