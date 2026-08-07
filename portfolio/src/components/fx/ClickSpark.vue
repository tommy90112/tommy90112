<script setup lang="ts">
/**
 * ClickSpark — a short radial burst of lines at every primary click.
 *
 * Mounted once at the app root over a fixed, non-interactive canvas. The rAF
 * loop only runs while sparks exist, so an idle page costs nothing. Suppressed
 * entirely under reduced-motion and for non-primary / modifier clicks, which
 * are usually "open in new tab" and shouldn't grow confetti.
 */
import { onMounted, onUnmounted, ref } from 'vue'
import { usePrefersReducedMotion } from '@/composables/usePrefersReducedMotion'

const props = withDefaults(
  defineProps<{
    /** Rays per burst. */
    count?: number
    /** px each ray travels. */
    distance?: number
    /** ms a burst lasts. */
    duration?: number
    /** Ray colour as `r, g, b`. */
    rgb?: string
  }>(),
  { count: 8, distance: 20, duration: 420, rgb: '149, 133, 255' },
)

const canvasRef = ref<HTMLCanvasElement | null>(null)
const prefersReduced = usePrefersReducedMotion()

interface Spark {
  x: number
  y: number
  start: number
}

let sparks: Spark[] = []
let frameId = 0
let dpr = 1

function resize(): void {
  const canvas = canvasRef.value
  if (!canvas) return
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = Math.round(window.innerWidth * dpr)
  canvas.height = Math.round(window.innerHeight * dpr)
}

/** easeOutCubic — rays shoot out then decelerate into their fade. */
function ease(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

function draw(now: number): void {
  const canvas = canvasRef.value
  const ctx = canvas?.getContext('2d')
  if (!canvas || !ctx) return

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

  sparks = sparks.filter((spark) => now - spark.start < props.duration)

  for (const spark of sparks) {
    const t = (now - spark.start) / props.duration
    const eased = ease(t)
    const reach = props.distance * eased
    const length = props.distance * 0.42 * (1 - t)
    const alpha = 1 - t

    ctx.strokeStyle = `rgba(${props.rgb}, ${alpha})`
    ctx.lineWidth = 1.6
    ctx.lineCap = 'round'

    for (let i = 0; i < props.count; i++) {
      const angle = (Math.PI * 2 * i) / props.count
      const cos = Math.cos(angle)
      const sin = Math.sin(angle)
      ctx.beginPath()
      ctx.moveTo(spark.x + cos * reach, spark.y + sin * reach)
      ctx.lineTo(spark.x + cos * (reach + length), spark.y + sin * (reach + length))
      ctx.stroke()
    }
  }

  if (sparks.length > 0) {
    frameId = requestAnimationFrame(draw)
  } else {
    frameId = 0
  }
}

function onPointerDown(event: PointerEvent): void {
  // Primary button only, and never when a modifier turns this into a
  // new-tab / context action.
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

  sparks.push({ x: event.clientX, y: event.clientY, start: performance.now() })
  if (!frameId) frameId = requestAnimationFrame(draw)
}

onMounted(() => {
  if (prefersReduced.value) return
  resize()
  window.addEventListener('resize', resize)
  window.addEventListener('pointerdown', onPointerDown, { passive: true })
})

onUnmounted(() => {
  if (frameId) cancelAnimationFrame(frameId)
  window.removeEventListener('resize', resize)
  window.removeEventListener('pointerdown', onPointerDown)
})
</script>

<template>
  <canvas
    v-if="!prefersReduced"
    ref="canvasRef"
    class="fixed inset-0 z-[70] w-full h-full pointer-events-none"
    aria-hidden="true"
  ></canvas>
</template>
