<script setup lang="ts">
/**
 * Fixed ambient backdrop for the whole page.
 *
 * Glassmorphism needs something behind the glass. On a flat near-black page
 * every translucent card resolves to the same dark grey and the effect reads
 * as "slightly lighter box". These viewport-fixed colour fields give each card
 * something to actually refract, and because they're fixed rather than
 * per-section, the tint shifts as cards scroll across them.
 *
 * Static by design — the moving layer is `AuroraBackground`, scoped to the
 * hero and contact sections. Two animated backgrounds at once is noise.
 */

/** 160×160 fractal-noise tile, used to dither the gradients. */
const GRAIN_TILE =
  'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNjAiIGhlaWdodD0iMTYwIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC44NSIgbnVtT2N0YXZlcz0iNCIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxNjAiIGhlaWdodD0iMTYwIiBmaWx0ZXI9InVybCgjbikiLz48L3N2Zz4='

const grainStyle = {
  backgroundImage: `url("data:image/svg+xml;base64,${GRAIN_TILE}")`,
}
</script>

<template>
  <div class="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
    <!-- Base wash, slightly warmer at the top than the body colour -->
    <div class="absolute inset-0 bg-gradient-to-b from-ink-900 via-ink-950 to-ink-950"></div>

    <div
      class="absolute -top-[10%] left-[8%] w-[46rem] h-[46rem] rounded-full blur-[120px]"
      style="background: radial-gradient(circle, rgba(124, 106, 255, 0.20), transparent 66%)"
    ></div>

    <div
      class="absolute top-[28%] -right-[8%] w-[40rem] h-[40rem] rounded-full blur-[130px]"
      style="background: radial-gradient(circle, rgba(34, 184, 209, 0.14), transparent 68%)"
    ></div>

    <div
      class="absolute bottom-[-14%] left-[26%] w-[44rem] h-[44rem] rounded-full blur-[140px]"
      style="background: radial-gradient(circle, rgba(245, 184, 65, 0.075), transparent 68%)"
    ></div>

    <!-- Fine grain: breaks up the banding that large blurred gradients leave
         behind on 8-bit displays. Base64 rather than a raw `utf8,` SVG — the
         inline form has to escape `<`, `#` and quotes, and any miss silently
         invalidates the whole URL. -->
    <div class="absolute inset-0 opacity-[0.035] mix-blend-overlay" :style="grainStyle"></div>
  </div>
</template>
