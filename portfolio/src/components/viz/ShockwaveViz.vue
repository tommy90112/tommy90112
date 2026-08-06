<script setup lang="ts">
/**
 * A traffic shockwave on a space–time diagram.
 *
 * Vertical axis is distance along the highway, horizontal axis is time. The
 * congested band slopes *backwards* — the wave travels upstream against the
 * direction of travel, which is the whole reason a purely data-driven forecast
 * misses it and a physics-informed one does not.
 */
import { computed, onMounted, onUnmounted, ref } from 'vue'

const W = 400
const H = 300
const PAD = { left: 34, right: 12, top: 14, bottom: 30 }

const COLS = 46
const ROWS = 22

const t = ref(0)
let frame = 0
let start = 0

function loop(now: number): void {
  if (!start) start = now
  t.value = ((now - start) / 6000) % 1
  frame = requestAnimationFrame(loop)
}

onMounted(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) {
    t.value = 0.55
    return
  }
  frame = requestAnimationFrame(loop)
})

onUnmounted(() => cancelAnimationFrame(frame))

const cellW = (W - PAD.left - PAD.right) / COLS
const cellH = (H - PAD.top - PAD.bottom) / ROWS

interface Cell {
  x: number
  y: number
  speed: number
}

/**
 * Speed field. A congestion band forms at a bottleneck and its upstream edge
 * moves backwards at a constant wave speed, the classic stop-and-go signature.
 */
const cells = computed<Cell[]>(() => {
  const out: Cell[] = []
  const onset = 0.28 // when the bottleneck activates, in normalised time
  const waveSpeed = 0.9 // rows travelled upstream per unit time

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const time = col / COLS
      const space = row / ROWS

      let speed = 1
      const elapsed = time - onset + t.value * 0.35
      if (elapsed > 0) {
        // Front edge of the jam, sweeping upstream (towards larger `space`).
        const front = 0.42 + elapsed * waveSpeed
        const back = front - 0.34
        if (space < front && space > back) {
          const depth = 1 - Math.abs(space - (front + back) / 2) / 0.17
          speed = Math.max(0.06, 1 - depth * 0.95)
        }
      }

      // Mild free-flow texture so the background is not a flat block.
      speed = Math.min(1, speed + Math.sin(col * 0.7 + row * 1.3) * 0.04)

      out.push({
        x: PAD.left + col * cellW,
        y: PAD.top + row * cellH,
        speed,
      })
    }
  }
  return out
})

/** Free-flowing green-ish → congested amber → stopped violet. */
function colourFor(speed: number): string {
  if (speed > 0.78) return '#18202F'
  if (speed > 0.55) return '#2E3A50'
  if (speed > 0.34) return '#6350E6'
  if (speed > 0.18) return '#9585FF'
  return '#F5B841'
}
</script>

<template>
  <figure class="m-0">
    <svg
      viewBox="0 0 400 300"
      class="w-full h-auto"
      role="img"
      aria-label="Space-time diagram of highway traffic: a congestion band forms at a bottleneck and propagates backwards against the direction of travel."
    >
      <!-- Speed field -->
      <g shape-rendering="crispEdges">
        <rect
          v-for="(cell, i) in cells"
          :key="i"
          :x="cell.x"
          :y="cell.y"
          :width="cellW + 0.6"
          :height="cellH + 0.6"
          :fill="colourFor(cell.speed)"
        />
      </g>

      <!-- Axes -->
      <g stroke="#2E3A50" stroke-width="1">
        <line :x1="PAD.left" :y1="PAD.top" :x2="PAD.left" :y2="H - PAD.bottom" />
        <line :x1="PAD.left" :y1="H - PAD.bottom" :x2="W - PAD.right" :y2="H - PAD.bottom" />
      </g>

      <g class="font-mono fill-paper-500" font-size="9">
        <text :x="PAD.left - 6" :y="PAD.top + 8" text-anchor="end">km</text>
        <text :x="W - PAD.right" :y="H - PAD.bottom + 16" text-anchor="end">time →</text>
      </g>

      <!-- Wave direction annotation -->
      <g>
        <path
          d="M 300 200 L 210 116"
          stroke="#F5B841"
          stroke-width="1.4"
          stroke-dasharray="4 4"
          fill="none"
          marker-end="url(#wave-arrow)"
        />
        <defs>
          <marker id="wave-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#F5B841" />
          </marker>
        </defs>
        <text x="306" y="214" class="font-mono fill-amber-400" font-size="9">shockwave</text>
      </g>
    </svg>
  </figure>
</template>
