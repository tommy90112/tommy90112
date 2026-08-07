/** Shared prop types for the `fx` effect components. */

export interface DockItem {
  id: string
  label: string
  /** SVG path `d` for a 24×24 stroked icon. */
  icon: string
  /** Marks the currently visible section. */
  active?: boolean
}
