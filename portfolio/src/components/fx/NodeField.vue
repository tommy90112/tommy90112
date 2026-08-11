<script setup lang="ts">
/**
 * A graph on the module grid, with intervention propagating through it.
 *
 * This replaces the old drifting particle cloud, which was the wrong idea
 * twice over: particles floating on their own trajectories fight a layout built
 * on a fixed module, and a random cloud says nothing about the work. Here the
 * nodes sit exactly on the 80px grid intersections the page is already ruled
 * to, edges run orthogonally or at 45°, and the motion is a pulse spreading
 * outward from one node along those edges — which is the thesis: intervene on a
 * cause, watch what changes downstream.
 *
 * Restraint is the point. One wave at a time, a long pause between waves, and
 * the whole layer sits at low alpha. If it reads as "something is moving" and
 * never as "something wants attention", it is doing its job.
 *
 * Cost controls, in order of importance:
 *  - node count follows area and is hard-capped;
 *  - the loop stops when the canvas scrolls out of view or the tab is hidden;
 *  - reduced-motion draws one static frame and never starts a loop.
 */
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { usePrefersReducedMotion } from '@/composables/usePrefersReducedMotion'
import { useThemeChannels } from '@/composables/useTheme'

const props = withDefaults(
  defineProps<{
    /** Grid pitch in px. Must match the `grid-bg` background-size to line up. */
    module?: number
    /** 0–1. Share of grid intersections that carry a node. */
    density?: number
    /** 0–1. Master alpha for the whole layer. */
    intensity?: number
  }>(),
  { module: 80, density: 0.38, intensity: 1 },
)

const canvasRef = ref<HTMLCanvasElement | null>(null)
const prefersReduced = usePrefersReducedMotion()

// Canvas cannot reference a CSS variable, so the tokens are sampled and
// re-sampled whenever the theme changes.
//
// `fg-faint`, not `line`: `line` is calibrated for a 1px hairline sitting
// directly against a surface, and a graph drawn in it disappears into the
// ground in both themes. The graph borrows the faint *text* colour instead and
// gets its quietness from alpha, which is tunable, rather than from a token
// that is already at its floor.
const inkColour = useThemeChannels('fg-faint', '128, 128, 125')
const accentColour = useThemeChannels('accent', '255, 74, 46')

interface GraphNode {
  x: number
  y: number
  /** Indices into `edges` that touch this node. */
  edges: number[]
}

interface Edge {
  a: number
  b: number
  length: number
}

/** A pulse in flight along one edge. */
interface Travel {
  edge: number
  /** Node index the pulse is travelling away from. */
  from: number
  /** Node index it is heading to. */
  to: number
  startedAt: number
  duration: number
  depth: number
}

const MAX_NODES = 220
/** How many edges deep a single wave travels before it stops. */
const MAX_DEPTH = 4
/** ms for a pulse to cross one grid module. */
const SPEED = 620
/** ms a node stays lit after a pulse arrives. */
const GLOW_MS = 2200
/** ms an edge keeps its afterglow once a pulse has crossed it. */
const TRAIL_MS = 2600
/** ms between the end of one wave and the start of the next. */
const WAVE_GAP = 1600

let nodes: readonly GraphNode[] = []
let edges: readonly Edge[] = []
/** Per-node timestamp of the last pulse arrival; 0 means never. */
let litAt = new Float64Array(0)
/**
 * Per-edge timestamp of the last crossing. Without this the path a wave took
 * vanishes the instant the pulse reaches the far end, so what you see is a dot
 * moving rather than a front spreading — the trail is what makes it read as
 * propagation.
 */
let edgeLitAt = new Float64Array(0)

let travels: Travel[] = []
let nextWaveAt = 0

let frameId = 0
let running = false
let width = 0
let height = 0
let dpr = 1

let resizeObserver: ResizeObserver | null = null
let intersectionObserver: IntersectionObserver | null = null

/**
 * Deterministic value in [0, 1) for a grid cell.
 *
 * Deliberately not `Math.random`: on resize the graph is rebuilt, and a random
 * layout would make every node jump to a new home. Hashing the coordinates
 * means a cell that had a node before still has one after.
 */
function hash(x: number, y: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return n - Math.floor(n)
}

function buildGraph(): void {
  const step = props.module
  const cols = Math.ceil(width / step) + 1
  const rows = Math.ceil(height / step) + 1

  // Grid cell -> node index, so edges can be found by coordinate lookup
  // instead of a distance search over every pair.
  const index = new Map<string, number>()
  const built: GraphNode[] = []

  for (let gy = 0; gy <= rows; gy++) {
    for (let gx = 0; gx <= cols; gx++) {
      if (built.length >= MAX_NODES) break
      if (hash(gx, gy) > props.density) continue
      index.set(`${gx},${gy}`, built.length)
      built.push({ x: gx * step, y: gy * step, edges: [] })
    }
  }

  const builtEdges: Edge[] = []
  // Only forward neighbours, so each edge is created once. The diagonal is
  // rarer than the orthogonals — a grid that is fully triangulated stops
  // reading as a grid.
  const NEIGHBOURS: readonly [number, number, number][] = [
    [1, 0, 1],
    [0, 1, 1],
    [1, 1, 0.35],
  ]

  for (let gy = 0; gy <= rows; gy++) {
    for (let gx = 0; gx <= cols; gx++) {
      const from = index.get(`${gx},${gy}`)
      if (from === undefined) continue

      for (const [dx, dy, chance] of NEIGHBOURS) {
        const to = index.get(`${gx + dx},${gy + dy}`)
        if (to === undefined) continue
        if (chance < 1 && hash(gx * 7 + dx, gy * 13 + dy) > chance) continue

        const a = built[from]
        const b = built[to]
        if (!a || !b) continue

        const edgeIndex = builtEdges.length
        builtEdges.push({ a: from, b: to, length: Math.hypot(b.x - a.x, b.y - a.y) })
        a.edges.push(edgeIndex)
        b.edges.push(edgeIndex)
      }
    }
  }

  nodes = built
  edges = builtEdges
  litAt = new Float64Array(built.length)
  edgeLitAt = new Float64Array(builtEdges.length)
  travels = []
  nextWaveAt = 0
}

/** Starts a wave at a node that has somewhere to send it. */
function seedWave(now: number): void {
  if (nodes.length === 0) return

  for (let attempt = 0; attempt < 12; attempt++) {
    const i = Math.floor(Math.random() * nodes.length)
    const node = nodes[i]
    if (!node || node.edges.length === 0) continue

    litAt[i] = now
    for (const edgeIndex of node.edges) {
      const edge = edges[edgeIndex]
      if (!edge) continue
      const to = edge.a === i ? edge.b : edge.a
      travels.push({
        edge: edgeIndex,
        from: i,
        to,
        startedAt: now,
        duration: (edge.length / props.module) * SPEED,
        depth: 0,
      })
    }
    return
  }
}

/** Advances pulses; on arrival, lights the node and spreads one level on. */
function step(now: number): void {
  if (travels.length === 0 && now >= nextWaveAt) {
    seedWave(now)
    return
  }

  const arrived: Travel[] = []
  travels = travels.filter((travel) => {
    if (now - travel.startedAt < travel.duration) return true
    arrived.push(travel)
    return false
  })

  for (const travel of arrived) {
    litAt[travel.to] = now
    edgeLitAt[travel.edge] = now
    if (travel.depth + 1 > MAX_DEPTH) continue

    const node = nodes[travel.to]
    if (!node) continue

    for (const edgeIndex of node.edges) {
      if (edgeIndex === travel.edge) continue
      const edge = edges[edgeIndex]
      if (!edge) continue

      const to = edge.a === travel.to ? edge.b : edge.a
      // Don't double back onto a node the wave has already reached.
      if (now - litAt[to]! < GLOW_MS) continue

      travels.push({
        edge: edgeIndex,
        from: travel.to,
        to,
        startedAt: now,
        duration: (edge.length / props.module) * SPEED,
        depth: travel.depth + 1,
      })
    }
  }

  if (travels.length === 0 && nextWaveAt <= now) {
    nextWaveAt = now + WAVE_GAP
  }
}

function draw(now: number): void {
  const canvas = canvasRef.value
  const ctx = canvas?.getContext('2d')
  if (!canvas || !ctx) return

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, width, height)

  const alpha = Math.min(Math.max(props.intensity, 0), 1)
  const ink = inkColour.value
  const accent = accentColour.value

  // Edges at rest, in one path — a single stroke for the whole graph rather
  // than one per edge.
  ctx.lineWidth = 1
  ctx.strokeStyle = `rgba(${ink}, ${0.42 * alpha})`
  ctx.beginPath()
  for (const edge of edges) {
    const a = nodes[edge.a]
    const b = nodes[edge.b]
    if (!a || !b) continue
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(b.x, b.y)
  }
  ctx.stroke()

  // Edges a wave has already crossed, fading back out. Drawn over the resting
  // pass so the route the pulse took stays legible behind it.
  ctx.lineWidth = 1.5
  for (let i = 0; i < edges.length; i++) {
    const lit = edgeLitAt[i]
    if (!lit) continue
    const trail = Math.max(0, 1 - (now - lit) / TRAIL_MS)
    if (trail <= 0) continue

    const edge = edges[i]
    const a = edge && nodes[edge.a]
    const b = edge && nodes[edge.b]
    if (!a || !b) continue

    ctx.strokeStyle = `rgba(${accent}, ${0.5 * trail * alpha})`
    ctx.beginPath()
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(b.x, b.y)
    ctx.stroke()
  }

  // Pulses in flight.
  ctx.lineWidth = 1.5
  for (const travel of travels) {
    const from = nodes[travel.from]
    const to = nodes[travel.to]
    if (!from || !to) continue

    const t = Math.min((now - travel.startedAt) / travel.duration, 1)
    const x = from.x + (to.x - from.x) * t
    const y = from.y + (to.y - from.y) * t

    // The part already travelled is drawn at full strength, so the pulse has a
    // tail rather than being a bare dot.
    ctx.strokeStyle = `rgba(${accent}, ${0.7 * alpha})`
    ctx.beginPath()
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(x, y)
    ctx.stroke()

    ctx.fillStyle = `rgba(${accent}, ${alpha})`
    ctx.fillRect(x - 2.5, y - 2.5, 5, 5)
  }

  // Nodes. Squares, not dots — everything else in this interface is square.
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    if (!node) continue

    const since = now - (litAt[i] ?? 0)
    const glow = litAt[i] === 0 ? 0 : Math.max(0, 1 - since / GLOW_MS)

    if (glow > 0) {
      const size = 3.5 + glow * 2.5
      ctx.fillStyle = `rgba(${accent}, ${(0.4 + 0.55 * glow) * alpha})`
      ctx.fillRect(node.x - size / 2, node.y - size / 2, size, size)
    } else {
      ctx.fillStyle = `rgba(${ink}, ${0.78 * alpha})`
      ctx.fillRect(node.x - 1.75, node.y - 1.75, 3.5, 3.5)
    }
  }
}

function loop(): void {
  const now = performance.now()
  step(now)
  draw(now)
  frameId = requestAnimationFrame(loop)
}

function start(): void {
  if (running || prefersReduced.value) return
  running = true
  frameId = requestAnimationFrame(loop)
}

function stop(): void {
  running = false
  if (frameId) cancelAnimationFrame(frameId)
  frameId = 0
}

function resize(): void {
  const canvas = canvasRef.value
  if (!canvas) return

  const rect = canvas.getBoundingClientRect()
  if (rect.width === 0 || rect.height === 0) return

  dpr = Math.min(window.devicePixelRatio || 1, 2)
  width = rect.width
  height = rect.height
  canvas.width = Math.round(width * dpr)
  canvas.height = Math.round(height * dpr)

  buildGraph()
  draw(performance.now())
}

function onVisibilityChange(): void {
  if (document.hidden) stop()
  else start()
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return

  resize()

  resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(canvas)

  intersectionObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) start()
      else stop()
    },
    { threshold: 0 },
  )
  intersectionObserver.observe(canvas)

  document.addEventListener('visibilitychange', onVisibilityChange)
})

onUnmounted(() => {
  stop()
  resizeObserver?.disconnect()
  intersectionObserver?.disconnect()
  document.removeEventListener('visibilitychange', onVisibilityChange)
})

// A theme flip changes the sampled colours; under reduced motion nothing is
// looping to pick them up, so repaint the single static frame by hand.
watch([inkColour, accentColour], () => {
  if (!running) draw(performance.now())
})

watch(prefersReduced, (reduced) => {
  if (reduced) {
    stop()
    draw(performance.now())
  } else {
    start()
  }
})
</script>

<template>
  <canvas
    ref="canvasRef"
    class="absolute inset-0 w-full h-full pointer-events-none"
    aria-hidden="true"
  ></canvas>
</template>
