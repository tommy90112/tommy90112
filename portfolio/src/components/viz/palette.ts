/**
 * Chart colours, shared by every visual in this folder.
 *
 * Each entry is a CSS colour *function*, not a hex literal, so the charts
 * re-tint with the theme. They have to be applied through `style` or a class —
 * SVG presentation attributes (`fill="…"`) are not parsed as CSS values, so a
 * `var()` written there is silently dropped and the shape renders black.
 *
 *     WRONG:  <circle :fill="VIZ.accent" />
 *     RIGHT:  <circle :style="{ fill: VIZ.accent }" />
 *
 * Three chromatic values exist in total — accent red, a blue, and the neutral
 * ramp — because a chart with three categories cannot encode them in one hue.
 * Everything else is interface furniture and stays greyscale. The red/blue pair
 * is the classic Swiss data split and stays separable under deuteranopia, where
 * a red/green pair collapses.
 */
export const VIZ = {
  /** The intervention / primary series. */
  accent: 'rgb(var(--accent))',
  /** Lighter accent, for a second pass of the same quantity. */
  accentSoft: 'rgb(var(--accent-soft))',
  /** The second category — the blue half of the pair. */
  series: 'rgb(var(--data-2))',
  /** The third category, and the flagged/anomalous mark: a strong neutral. */
  signal: 'rgb(var(--data-3))',

  /** Gridlines and inactive edges. */
  grid: 'rgb(var(--line))',
  /** Axes and reference lines — full-strength ink, as a Swiss axis is. */
  axis: 'rgb(var(--fg))',
  /** Unfilled portion of a bar or gauge. */
  track: 'rgb(var(--surface-raised))',
  /** The panel behind the chart, for knockout strokes on overlapping marks. */
  ground: 'rgb(var(--surface))',
  /** Struck-through / suppressed marks. */
  muted: 'rgb(var(--fg-faint))',
} as const

export type VizColour = (typeof VIZ)[keyof typeof VIZ]
