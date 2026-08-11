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
  /** Home position: the grid intersection this node belongs to. */
  x: number
  y: number
  /**
   * Rendered position. Equals the home position at rest and is pushed away
   * from the pointer on approach, easing back when it leaves — so the graph
   * is exactly on-grid whenever nobody is touching it, and yielding when
   * somebody is.
   */
  cx: number
  cy: number
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

/**
 * Pointer interaction. The push is deliberately a fraction of the module —
 * enough that the graph visibly yields, small enough that a node never reads
 * as having left its own intersection.
 */
const POINTER_RADIUS = 200
const POINTER_PUSH = 22
/** Per-frame easing toward the target position. Lower is heavier. */
const EASE = 0.14

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
/** Per-node pointer nearness in [0, 1], recomputed each frame by `relax`. */
let proximity = new Float64Array(0)

let travels: Travel[] = []
let nextWaveAt = 0

/** Pointer in canvas space; null when it has left or was never over. */
let pointer: { x: number; y: number } | null = null

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
      const x = gx * step
      const y = gy * step
      built.push({ x, y, cx: x, cy: y, edges: [] })
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
  proximity = new Float64Array(built.length)
  travels = []
  nextWaveAt = 0
}

/**
 * Eases every node toward its target for this frame: its own intersection,
 * displaced away from the pointer when the pointer is near.
 *
 * Falloff is quadratic rather than linear so the effect has a soft edge —
 * with a linear ramp the outermost nodes pop as the radius crosses them.
 * `proximity` is cached here rather than recomputed in `draw`, since both
 * the displacement and the highlight need it.
 */
function relax(): void {
  const p = pointer

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    if (!node) continue

    let tx = node.x
    let ty = node.y
    let near = 0

    if (p) {
      const dx = node.x - p.x
      const dy = node.y - p.y
      const dist = Math.hypot(dx, dy)

      if (dist < POINTER_RADIUS && dist > 0.01) {
        near = (1 - dist / POINTER_RADIUS) ** 2
        const push = near * POINTER_PUSH
        tx += (dx / dist) * push
        ty += (dy / dist) * push
      }
    }

    proximity[i] = near
    node.cx += (tx - node.cx) * EASE
    node.cy += (ty - node.cy) * EASE
  }
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

  // Everything below draws from `cx`/`cy`, the pointer-displaced positions, so
  // the edges bend with the nodes they connect instead of detaching from them.

  // Edges at rest, in one path — a single stroke for the whole graph rather
  // than one per edge.
  ctx.lineWidth = 1
  ctx.strokeStyle = `rgba(${ink}, ${0.42 * alpha})`
  ctx.beginPath()
  for (const edge of edges) {
    const a = nodes[edge.a]
    const b = nodes[edge.b]
    if (!a || !b) continue
    ctx.moveTo(a.cx, a.cy)
    ctx.lineTo(b.cx, b.cy)
  }
  ctx.stroke()

  // Edges under the pointer, lifted. Drawn per-edge because each one carries
  // its own alpha — this is the pass that makes the cursor feel like it is
  // touching the graph rather than floating over it.
  for (let i = 0; i < edges.length; i++) {
    const edge = edges[i]
    const a = edge && nodes[edge.a]
    const b = edge && nodes[edge.b]
    if (!edge || !a || !b) continue

    const near = Math.max(proximity[edge.a] ?? 0, proximity[edge.b] ?? 0)
    if (near <= 0.01) continue

    // Weight as well as alpha: a 1px line brightened in place is barely
    // perceptible, and thickening is what makes the cursor feel like it has
    // weight on the graph.
    ctx.lineWidth = 1 + near * 0.9
    ctx.strokeStyle = `rgba(${ink}, ${0.85 * near * alpha})`
    ctx.beginPath()
    ctx.moveTo(a.cx, a.cy)
    ctx.lineTo(b.cx, b.cy)
    ctx.stroke()
  }

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
    ctx.moveTo(a.cx, a.cy)
    ctx.lineTo(b.cx, b.cy)
    ctx.stroke()
  }

  // Pulses in flight.
  ctx.lineWidth = 1.5
  for (const travel of travels) {
    const from = nodes[travel.from]
    const to = nodes[travel.to]
    if (!from || !to) continue

    const t = Math.min((now - travel.startedAt) / travel.duration, 1)
    const x = from.cx + (to.cx - from.cx) * t
    const y = from.cy + (to.cy - from.cy) * t

    // The part already travelled is drawn at full strength, so the pulse has a
    // tail rather than being a bare dot.
    ctx.strokeStyle = `rgba(${accent}, ${0.7 * alpha})`
    ctx.beginPath()
    ctx.moveTo(from.cx, from.cy)
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
    const near = proximity[i] ?? 0

    if (glow > 0) {
      // A pulse owns the node: accent wins over the pointer highlight, but the
      // pointer still adds size, so the two effects compose instead of one
      // cancelling the other.
      const size = 3.5 + glow * 2.5 + near * 3.5
      ctx.fillStyle = `rgba(${accent}, ${(0.4 + 0.55 * glow) * alpha})`
      ctx.fillRect(node.cx - size / 2, node.cy - size / 2, size, size)
    } else {
      const size = 3.5 + near * 3.5
      ctx.fillStyle = `rgba(${ink}, ${(0.78 + 0.22 * near) * alpha})`
      ctx.fillRect(node.cx - size / 2, node.cy - size / 2, size, size)
    }
  }
}

function loop(): void {
  const now = performance.now()
  relax()
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

/**
 * Listens on the window, not the canvas: the canvas is `pointer-events-none`
 * so that it never intercepts a click meant for the content sitting on top of
 * it, which also means it receives no pointer events of its own.
 *
 * The position is only stored here; the work happens once per frame in
 * `relax`, so a high-frequency pointer cannot outpace the render.
 */
function onPointerMove(event: PointerEvent): void {
  const canvas = canvasRef.value
  if (!canvas) return

  const rect = canvas.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  // Drop the pointer once it is a full radius outside the canvas, so nodes
  // settle back home instead of straining toward a cursor in another section.
  if (
    x < -POINTER_RADIUS ||
    y < -POINTER_RADIUS ||
    x > rect.width + POINTER_RADIUS ||
    y > rect.height + POINTER_RADIUS
  ) {
    pointer = null
    return
  }

  pointer = { x, y }
}

function onPointerLeave(): void {
  pointer = null
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return

  // Coarse pointers have no hover to track, and reduced-motion means the
  // graph is a static frame that should not react at all.
  const pointerEnabled =
    !prefersReduced.value &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches

  if (pointerEnabled) {
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('pointerleave', onPointerLeave)
  }

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
  window.removeEventListener('pointermove', onPointerMove)
  document.removeEventListener('pointerleave', onPointerLeave)
})

// A theme flip changes the sampled colours; under reduced motion nothing is
// looping to pick them up, so repaint the single static frame by hand.
watch([inkColour, accentColour], () => {
  if (!running) draw(performance.now())
})

watch(prefersReduced, (reduced) => {
  if (reduced) {
    stop()
    // Drop any displacement so the static frame is the graph at rest, on-grid.
    pointer = null
    for (const node of nodes) {
      node.cx = node.x
      node.cy = node.y
    }
    proximity.fill(0)
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
