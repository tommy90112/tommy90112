<script setup lang="ts">
/**
 * Particles — a drifting point field with proximity links and a soft pointer
 * repulsion, rendered on a 2D canvas.
 *
 * Cost controls, in order of importance:
 *  - particle count is derived from area and hard-capped;
 *  - the loop stops entirely when the canvas scrolls out of view or the tab
 *    is hidden;
 *  - reduced-motion renders one static frame and never starts a loop.
 */
import { onMounted, onUnmounted, ref } from 'vue'
import { usePrefersReducedMotion } from '@/composables/usePrefersReducedMotion'

const props = withDefaults(
  defineProps<{
    /** Particles per 100k device-independent px², before the cap. */
    density?: number
    /** Upper bound on particle count regardless of viewport size. */
    maxParticles?: number
    /** Max px distance at which two particles are linked. */
    linkDistance?: number
    /** Base dot + link colour, as `r, g, b`. */
    rgb?: string
  }>(),
  {
    density: 9,
    maxParticles: 110,
    linkDistance: 132,
    rgb: '124, 106, 255',
  },
)

const canvasRef = ref<HTMLCanvasElement | null>(null)
const prefersReduced = usePrefersReducedMotion()

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  r: number
}

const POINTER_RADIUS = 140
const POINTER_STRENGTH = 26

let particles: Particle[] = []
let frameId = 0
let running = false
let width = 0
let height = 0
let dpr = 1

/** Pointer position in canvas space; null when the pointer has left. */
let pointer: { x: number; y: number } | null = null

let resizeObserver: ResizeObserver | null = null
let intersectionObserver: IntersectionObserver | null = null

function seedParticles(): void {
  const area = width * height
  const target = Math.min(Math.round((area / 100_000) * props.density), props.maxParticles)

  particles = Array.from({ length: Math.max(target, 0) }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.28,
    vy: (Math.random() - 0.5) * 0.28,
    r: 0.8 + Math.random() * 1.5,
  }))
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

  seedParticles()
  draw()
}

function step(): void {
  for (const p of particles) {
    p.x += p.vx
    p.y += p.vy

    // Wrap rather than bounce: no visible walls, no clustering at edges.
    if (p.x < -10) p.x = width + 10
    if (p.x > width + 10) p.x = -10
    if (p.y < -10) p.y = height + 10
    if (p.y > height + 10) p.y = -10

    if (!pointer) continue

    const dx = p.x - pointer.x
    const dy = p.y - pointer.y
    const dist = Math.hypot(dx, dy)
    if (dist > 0 && dist < POINTER_RADIUS) {
      const push = ((POINTER_RADIUS - dist) / POINTER_RADIUS) * (POINTER_STRENGTH / dist)
      p.x += dx * push * 0.05
      p.y += dy * push * 0.05
    }
  }
}

function draw(): void {
  const canvas = canvasRef.value
  const ctx = canvas?.getContext('2d')
  if (!canvas || !ctx) return

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, width, height)

  // Links first, so dots sit on top of their own threads.
  const maxDist = props.linkDistance
  for (let i = 0; i < particles.length; i++) {
    const a = particles[i]
    if (!a) continue
    for (let j = i + 1; j < particles.length; j++) {
      const b = particles[j]
      if (!b) continue
      const dx = a.x - b.x
      const dy = a.y - b.y
      const distSq = dx * dx + dy * dy
      if (distSq > maxDist * maxDist) continue

      const alpha = (1 - Math.sqrt(distSq) / maxDist) * 0.22
      ctx.strokeStyle = `rgba(${props.rgb}, ${alpha})`
      ctx.lineWidth = 0.6
      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(b.x, b.y)
      ctx.stroke()
    }
  }

  for (const p of particles) {
    ctx.fillStyle = `rgba(${props.rgb}, 0.55)`
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    ctx.fill()
  }
}

function loop(): void {
  step()
  draw()
  frameId = requestAnimationFrame(loop)
}

function start(): void {
  if (running || prefersReduced.value) return
  running = true
  frameId = requestAnimationFrame(loop)
}

function stop(): void {
  if (!running) return
  running = false
  cancelAnimationFrame(frameId)
}

function onPointerMove(event: PointerEvent): void {
  const canvas = canvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top }
}

function onPointerLeave(): void {
  pointer = null
}

function onVisibilityChange(): void {
  if (document.hidden) stop()
  else start()
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return

  resize()

  if (prefersReduced.value) return // one static frame is enough

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)
  } else {
    window.addEventListener('resize', resize)
  }

  // Only animate while actually on screen.
  if (typeof IntersectionObserver !== 'undefined') {
    intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) start()
        else stop()
      },
      { threshold: 0 },
    )
    intersectionObserver.observe(canvas)
  } else {
    start()
  }

  window.addEventListener('pointermove', onPointerMove, { passive: true })
  window.addEventListener('pointerleave', onPointerLeave)
  document.addEventListener('visibilitychange', onVisibilityChange)
})

onUnmounted(() => {
  stop()
  resizeObserver?.disconnect()
  intersectionObserver?.disconnect()
  window.removeEventListener('resize', resize)
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerleave', onPointerLeave)
  document.removeEventListener('visibilitychange', onVisibilityChange)
})
</script>

<template>
  <canvas ref="canvasRef" class="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true"></canvas>
</template>
