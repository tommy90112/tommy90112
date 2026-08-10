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
 * The roles are semantic. `signal` and `series` exist because a chart with two
 * categories cannot encode both in one hue; everything else is interface
 * furniture and stays on the neutral ramp.
 */
export const VIZ = {
  /** The intervention / primary series. */
  accent: 'rgb(var(--accent))',
  /** Lighter accent, for a second pass of the same quantity. */
  accentSoft: 'rgb(var(--accent-soft))',
  /** The flagged / anomalous category. */
  signal: 'rgb(var(--data-3))',
  /** A third category, when accent and signal are both taken. */
  series: 'rgb(var(--data-2))',

  /** Gridlines and inactive edges. */
  grid: 'rgb(var(--line))',
  /** Axes and reference lines — one step stronger than the grid. */
  axis: 'rgb(var(--line-strong))',
  /** Unfilled portion of a bar or gauge. */
  track: 'rgb(var(--surface-raised))',
  /** The page behind the chart, for knockout strokes on overlapping marks. */
  ground: 'rgb(var(--surface))',
  /** Struck-through / suppressed marks. */
  muted: 'rgb(var(--fg-faint))',
} as const

export type VizColour = (typeof VIZ)[keyof typeof VIZ]
