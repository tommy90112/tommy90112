<script setup lang="ts">
/**
 * BitoGuard's core signal: leave-one-out blacklist density.
 *
 * A user's risk is read off its neighbourhood, not off its own history. The
 * animation sweeps outward from the seeded blacklisted accounts, tinting each
 * neighbour by how much toxicity reaches it — which is exactly the feature
 * transform that took the model from F1 0.37 to 0.83.
 *
 * Pure SVG; positions are hand-placed rather than force-simulated so the
 * picture stays legible at card size.
 */
import { computed, onMounted, onUnmounted, ref } from 'vue'

interface Account {
  id: number
  x: number
  y: number
  r: number
  /** Seeded blacklist label. */
  toxic: boolean
}

const ACCOUNTS: readonly Account[] = [
  { id: 0, x: 200, y: 150, r: 13, toxic: false },
  { id: 1, x: 118, y: 84, r: 8, toxic: true },
  { id: 2, x: 288, y: 96, r: 8, toxic: false },
  { id: 3, x: 96, y: 214, r: 8, toxic: false },
  { id: 4, x: 314, y: 208, r: 8, toxic: true },
  { id: 5, x: 214, y: 58, r: 7, toxic: false },
  { id: 6, x: 54, y: 138, r: 6, toxic: true },
  { id: 7, x: 344, y: 62, r: 6, toxic: false },
  { id: 8, x: 158, y: 258, r: 6, toxic: false },
  { id: 9, x: 268, y: 264, r: 6, toxic: false },
  { id: 10, x: 246, y: 196, r: 6, toxic: false },
  { id: 11, x: 82, y: 52, r: 5, toxic: false },
]

const LINKS: readonly { a: number; b: number }[] = [
  { a: 0, b: 1 }, { a: 0, b: 2 }, { a: 0, b: 3 }, { a: 0, b: 4 }, { a: 0, b: 5 },
  { a: 1, b: 6 }, { a: 2, b: 7 }, { a: 3, b: 8 }, { a: 4, b: 9 },
  { a: 1, b: 5 }, { a: 5, b: 11 }, { a: 0, b: 10 }, { a: 10, b: 4 }, { a: 6, b: 11 },
]

const byId = new Map(ACCOUNTS.map((a) => [a.id, a]))

/**
 * Toxicity density per account: the share of its neighbours that are
 * blacklisted, with its own label left out.
 */
const density = computed(() => {
  const result = new Map<number, number>()
  for (const account of ACCOUNTS) {
    const neighbours = LINKS.filter((l) => l.a === account.id || l.b === account.id).map((l) =>
      l.a === account.id ? l.b : l.a,
    )
    if (neighbours.length === 0) {
      result.set(account.id, 0)
      continue
    }
    const toxicNeighbours = neighbours.filter((n) => byId.get(n)?.toxic).length
    result.set(account.id, toxicNeighbours / neighbours.length)
  }
  return result
})

/** Sweep phase drives the propagation animation, 0 → 1 and back. */
const phase = ref(0)
let frame = 0
let start = 0

function loop(now: number): void {
  if (!start) start = now
  phase.value = ((now - start) / 3400) % 1
  frame = requestAnimationFrame(loop)
}

onMounted(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) {
    phase.value = 1
    return
  }
  frame = requestAnimationFrame(loop)
})

onUnmounted(() => cancelAnimationFrame(frame))

/** How lit an account is at the current sweep phase. */
function heat(account: Account): number {
  const d = density.value.get(account.id) ?? 0
  const base = account.toxic ? 1 : d
  const reach = Math.min(1, Math.max(0, phase.value * 1.8))
  return base * reach
}

function fillFor(account: Account): string {
  if (account.toxic) return '#F5B841'
  const h = heat(account)
  if (h > 0.45) return '#9585FF'
  if (h > 0) return '#4C3CC4'
  return '#2E3A50'
}
</script>

<template>
  <figure class="m-0">
    <svg
      viewBox="0 0 400 300"
      class="w-full h-auto"
      role="img"
      aria-label="Transaction network where blacklist density propagates from seeded accounts to their shared-wallet neighbours."
    >
      <!-- Links -->
      <g stroke="#212B3D" stroke-width="1.1" fill="none">
        <line
          v-for="link in LINKS"
          :key="`${link.a}-${link.b}`"
          :x1="byId.get(link.a)?.x"
          :y1="byId.get(link.a)?.y"
          :x2="byId.get(link.b)?.x"
          :y2="byId.get(link.b)?.y"
        />
      </g>

      <!-- Toxicity halo -->
      <g>
        <circle
          v-for="account in ACCOUNTS"
          :key="`halo-${account.id}`"
          :cx="account.x"
          :cy="account.y"
          :r="account.r + 10 + heat(account) * 12"
          :fill="account.toxic ? '#F5B841' : '#7C6AFF'"
          :opacity="heat(account) * 0.18"
        />
      </g>

      <!-- Accounts -->
      <g>
        <circle
          v-for="account in ACCOUNTS"
          :key="account.id"
          :cx="account.x"
          :cy="account.y"
          :r="account.r"
          :fill="fillFor(account)"
          stroke="#0B1019"
          stroke-width="1.5"
        />
      </g>

      <!-- Legend -->
      <g class="font-mono" font-size="9">
        <circle cx="14" cy="284" r="4.5" fill="#F5B841" />
        <text x="24" y="287" class="fill-paper-400">blacklisted</text>
        <circle cx="110" cy="284" r="4.5" fill="#9585FF" />
        <text x="120" y="287" class="fill-paper-400">high LOO density</text>
      </g>
    </svg>
  </figure>
</template>
