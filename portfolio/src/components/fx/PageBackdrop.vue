<script setup lang="ts">
/**
 * Fixed ambient ground for the whole page.
 *
 * Two jobs. First, it keeps the page from being one flat fill: viewport-fixed
 * colour fields mean the tint under a panel shifts as it scrolls, which is what
 * stops a column of identical panels reading as a spreadsheet. Second, the
 * grain tile dithers the large blurred gradients, which otherwise band visibly
 * on 8-bit displays.
 *
 * Static by design — the moving layer is `AuroraBackground`, scoped to the hero
 * and contact sections. Two animated backgrounds at once is noise.
 *
 * The grain's blend mode flips per theme: `multiply` darkens the paper ground
 * where the noise is bright, `overlay` lifts the charcoal one. Using either on
 * both leaves the grain invisible in one of them.
 */

/** 160×160 fractal-noise tile. */
const GRAIN_TILE =
  'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNjAiIGhlaWdodD0iMTYwIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC44NSIgbnVtT2N0YXZlcz0iNCIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxNjAiIGhlaWdodD0iMTYwIiBmaWx0ZXI9InVybCgjbikiLz48L3N2Zz4='

/* Base64 rather than a raw `utf8,` SVG — the inline form has to escape `<`,
   `#` and quotes, and any miss silently invalidates the whole URL.
   Opacity and blend mode come from `.grain-overlay`; see style.css. */
const grainStyle = {
  backgroundImage: `url("data:image/svg+xml;base64,${GRAIN_TILE}")`,
}

/**
 * `scale` is relative to the theme's master alpha rather than absolute, so the
 * light theme's much quieter wash applies to every field at once.
 */
function wash(hue: 'a' | 'b' | 'c', scale: number): Record<string, string> {
  return {
    background: `radial-gradient(circle, rgb(var(--wash-${hue}) / calc(var(--wash-alpha) * ${scale})), transparent 68%)`,
  }
}
</script>

<template>
  <div class="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
    <!-- Base wash: the sunk tone at the top settling into the page colour, so
         the masthead has something to sit against. -->
    <div class="absolute inset-0 bg-gradient-to-b from-sunk via-page to-page"></div>

    <div
      class="absolute -top-[12%] left-[4%] w-[52rem] h-[52rem] rounded-full blur-[120px]"
      :style="wash('a', 0.9)"
    ></div>

    <div
      class="absolute top-[26%] -right-[10%] w-[46rem] h-[46rem] rounded-full blur-[130px]"
      :style="wash('b', 0.7)"
    ></div>

    <div
      class="absolute bottom-[-16%] left-[20%] w-[48rem] h-[48rem] rounded-full blur-[140px]"
      :style="wash('c', 0.55)"
    ></div>

    <div class="absolute inset-0 grain-overlay" :style="grainStyle"></div>
  </div>
</template>
