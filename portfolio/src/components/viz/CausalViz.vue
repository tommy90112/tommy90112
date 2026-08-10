<script setup lang="ts">
/**
 * CI-RCT in one picture.
 *
 * A small heterogeneous causal graph over a flagged account. Clicking an
 * upstream cause performs do(X) on it: every path through that node is cut and
 * the downstream risk score is recomputed from what remains. That difference —
 * not a correlation ranking — is what the thesis calls the node's causal
 * responsibility.
 *
 * Pure SVG. No charting or graph library involved.
 */
import { computed, ref } from 'vue'
import { VIZ } from '@/components/viz/palette'

type NodeKind = 'cause' | 'mediator' | 'target'

interface GraphNode {
  id: string
  x: number
  y: number
  kind: NodeKind
  /** Direct contribution to the risk score; causes only. */
  weight?: number
  label: string
}

const NODES: readonly GraphNode[] = [
  { id: 'c1', x: 72, y: 54, kind: 'cause', weight: 0.28, label: 'shared wallet' },
  { id: 'c2', x: 196, y: 40, kind: 'cause', weight: 0.11, label: 'device fingerprint' },
  { id: 'c3', x: 322, y: 60, kind: 'cause', weight: 0.34, label: 'transfer ring' },
  { id: 'm1', x: 104, y: 150, kind: 'mediator', label: 'wallet cluster' },
  { id: 'm2', x: 214, y: 144, kind: 'mediator', label: 'co-occurrence' },
  { id: 'm3', x: 316, y: 158, kind: 'mediator', label: 'flow pattern' },
  { id: 't', x: 204, y: 250, kind: 'target', label: 'flagged account' },
]

/** Directed edges, upstream → downstream. */
const EDGES: readonly { from: string; to: string }[] = [
  { from: 'c1', to: 'm1' },
  { from: 'c1', to: 'm2' },
  { from: 'c2', to: 'm2' },
  { from: 'c3', to: 'm2' },
  { from: 'c3', to: 'm3' },
  { from: 'm1', to: 't' },
  { from: 'm2', to: 't' },
  { from: 'm3', to: 't' },
]

/** Risk that remains when every modelled cause is intervened away. */
const BASELINE = 0.22

const nodeById = new Map(NODES.map((n) => [n.id, n]))
const causes = NODES.filter((n) => n.kind === 'cause')

const intervened = ref<Set<string>>(new Set())

function toggle(id: string): void {
  const node = nodeById.get(id)
  if (!node || node.kind !== 'cause') return
  // Immutable update — replace the set rather than mutating it in place.
  const next = new Set(intervened.value)
  if (next.has(id)) {
    next.delete(id)
  } else {
    next.add(id)
  }
  intervened.value = next
}

function reset(): void {
  intervened.value = new Set()
}

const score = computed(() => {
  const active = causes
    .filter((c) => !intervened.value.has(c.id))
    .reduce((sum, c) => sum + (c.weight ?? 0), 0)
  return Math.min(0.99, BASELINE + active)
})

/** An edge is live only if nothing on its upstream side was intervened on. */
function isEdgeLive(from: string): boolean {
  if (intervened.value.has(from)) return false
  const source = nodeById.get(from)
  if (source?.kind !== 'mediator') return true
  // A mediator carries signal only while at least one of its parents is live.
  return EDGES.filter((e) => e.to === from).some((e) => !intervened.value.has(e.from))
}

function isNodeLive(id: string): boolean {
  const node = nodeById.get(id)
  if (!node) return false
  if (node.kind === 'cause') return !intervened.value.has(id)
  if (node.kind === 'target') return true
  return EDGES.filter((e) => e.to === id).some((e) => !intervened.value.has(e.from))
}

function edgePath(from: string, to: string): string {
  const a = nodeById.get(from)
  const b = nodeById.get(to)
  if (!a || !b) return ''
  const midY = (a.y + b.y) / 2
  return `M ${a.x} ${a.y} C ${a.x} ${midY}, ${b.x} ${midY}, ${b.x} ${b.y}`
}

const scoreLabel = computed(() => score.value.toFixed(2))
const delta = computed(() => score.value - (BASELINE + causes.reduce((s, c) => s + (c.weight ?? 0), 0)))
const hasIntervention = computed(() => intervened.value.size > 0)
</script>

<template>
  <figure class="m-0">
    <svg
      viewBox="0 0 400 300"
      class="w-full h-auto"
      role="img"
      aria-label="Interactive causal graph: selecting an upstream cause performs an intervention and recomputes the downstream risk score."
    >
      <defs>
        <marker id="causal-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
        </marker>
      </defs>

      <!-- Edges -->
      <g fill="none" stroke-linecap="round">
        <path
          v-for="edge in EDGES"
          :key="`${edge.from}-${edge.to}`"
          :d="edgePath(edge.from, edge.to)"
          :style="{ stroke: isEdgeLive(edge.from) ? VIZ.accent : VIZ.grid }"
          :stroke-width="isEdgeLive(edge.from) ? 1.6 : 1.2"
          :stroke-dasharray="isEdgeLive(edge.from) ? undefined : '3 4'"
          :opacity="isEdgeLive(edge.from) ? 0.75 : 0.5"
          class="transition-all duration-500"
        />
      </g>

      <!-- Signal pulses along live edges -->
      <g>
        <circle
          v-for="(edge, i) in EDGES.filter((e) => isEdgeLive(e.from))"
          :key="`pulse-${edge.from}-${edge.to}`"
          r="2.4"
          :style="{ fill: VIZ.accentSoft }"
        >
          <animateMotion
            :path="edgePath(edge.from, edge.to)"
            :dur="`${2.4 + (i % 3) * 0.5}s`"
            repeatCount="indefinite"
            :begin="`${i * 0.32}s`"
          />
          <animate
            attributeName="opacity"
            values="0;0.9;0.9;0"
            :dur="`${2.4 + (i % 3) * 0.5}s`"
            repeatCount="indefinite"
            :begin="`${i * 0.32}s`"
          />
        </circle>
      </g>

      <!-- Nodes -->
      <g>
        <template v-for="node in NODES" :key="node.id">
          <!-- Target: the prediction under explanation -->
          <g v-if="node.kind === 'target'">
            <circle
              :cx="node.x"
              :cy="node.y"
              :r="20"
              :style="{ fill: VIZ.signal }"
              :opacity="0.14 + score * 0.2"
              class="transition-opacity duration-500"
            />
            <circle :cx="node.x" :cy="node.y" r="11" :style="{ fill: VIZ.signal }" />
            <text
              :x="node.x"
              :y="node.y + 38"
              text-anchor="middle"
              class="fill-fg-muted font-mono"
              font-size="9"
            >
              {{ node.label }}
            </text>
          </g>

          <!-- Mediators: not directly clickable -->
          <g v-else-if="node.kind === 'mediator'">
            <circle
              :cx="node.x"
              :cy="node.y"
              r="7"
              :style="{
                fill: isNodeLive(node.id) ? VIZ.track : VIZ.ground,
                stroke: isNodeLive(node.id) ? VIZ.accent : VIZ.grid,
              }"
              stroke-width="1.4"
              class="transition-all duration-500"
            />
          </g>

          <!-- Causes: clickable intervention targets -->
          <g
            v-else
            class="cursor-pointer"
            role="button"
            tabindex="0"
            :aria-pressed="intervened.has(node.id)"
            :aria-label="`Intervene on ${node.label}`"
            @click="toggle(node.id)"
            @keydown.enter.prevent="toggle(node.id)"
            @keydown.space.prevent="toggle(node.id)"
          >
            <!-- Generous invisible hit area -->
            <circle :cx="node.x" :cy="node.y" r="22" fill="transparent" />
            <circle
              v-if="!intervened.has(node.id)"
              :cx="node.x"
              :cy="node.y"
              r="15"
              :style="{ fill: VIZ.accent }"
              opacity="0.16"
              class="animate-pulse-soft"
            />
            <circle
              :cx="node.x"
              :cy="node.y"
              :r="9"
              :style="{
                fill: intervened.has(node.id) ? VIZ.ground : VIZ.accent,
                stroke: intervened.has(node.id) ? VIZ.muted : 'transparent',
              }"
              stroke-width="1.6"
              stroke-dasharray="3 3"
              class="transition-all duration-300"
            />
            <!-- do(X) scissor mark on an intervened node -->
            <path
              v-if="intervened.has(node.id)"
              :d="`M ${node.x - 4.5} ${node.y - 4.5} L ${node.x + 4.5} ${node.y + 4.5} M ${node.x + 4.5} ${node.y - 4.5} L ${node.x - 4.5} ${node.y + 4.5}`"
              :style="{ stroke: VIZ.muted }"
              stroke-width="1.6"
              stroke-linecap="round"
            />
            <text
              :x="node.x"
              :y="node.y - 19"
              text-anchor="middle"
              class="font-mono transition-colors duration-300"
              :class="intervened.has(node.id) ? 'fill-fg-faint' : 'fill-fg-muted'"
              font-size="9"
            >
              {{ node.label }}
            </text>
          </g>
        </template>
      </g>
    </svg>

    <!-- Readout -->
    <div class="mt-4 flex items-end justify-between gap-4 border-t border-line pt-4">
      <div>
        <p class="font-mono text-[10px] uppercase tracking-wider text-fg-faint">
          {{ hasIntervention ? 'P(fraud | do(·))' : 'P(fraud)' }}
        </p>
        <p class="h-display text-3xl text-fg tabular-nums">
          {{ scoreLabel }}
          <span v-if="hasIntervention" class="font-mono text-xs text-data-3 align-middle">
            {{ delta.toFixed(2) }}
          </span>
        </p>
      </div>

      <button
        v-if="hasIntervention"
        type="button"
        class="font-mono text-[10px] uppercase tracking-wider text-fg-muted
               hover:text-accent transition-colors"
        @click="reset"
      >
        reset
      </button>
      <p v-else class="font-mono text-[10px] text-fg-faint text-right max-w-[52%] leading-relaxed">
        click a cause to intervene
      </p>
    </div>
  </figure>
</template>
