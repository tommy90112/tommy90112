/**
 * Structural site data — anything that is the same in every language.
 * All human-readable copy lives in `src/i18n`.
 */

export const CONTACT = {
  email: 'tommy90112@gmail.com',
  linkedin: 'https://www.linkedin.com/in/tommy90112/',
  github: 'https://github.com/tommy90112',
  repo: 'https://github.com/tommy90112/tommy90112',
} as const

/**
 * Sections in reading order. `icon` is an SVG path `d` on a 24×24 stroked
 * grid, used by the Dock; the text label always comes from `key`.
 */
export const NAV_SECTIONS = [
  {
    id: 'about',
    key: 'nav.about',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM4 21v-1a6 6 0 0116 0v1',
  },
  {
    id: 'experience',
    key: 'nav.experience',
    icon: 'M4 7h16v13H4zM9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M4 12h16',
  },
  {
    id: 'work',
    key: 'nav.work',
    icon: 'M4 5h7v7H4zM13 5h7v4h-7zM13 12h7v7h-7zM4 15h7v4H4z',
  },
  {
    id: 'skills',
    key: 'nav.skills',
    icon: 'M9 18l-5-6 5-6M15 6l5 6-5 6',
  },
  {
    id: 'awards',
    key: 'nav.awards',
    icon: 'M8 21h8m-4-4v4m7-17H5v3a7 7 0 0014 0V4z',
  },
  {
    id: 'contact',
    key: 'nav.contact',
    icon: 'M3 6h18v12H3zM3 7l9 6 9-6',
  },
] as const

export const HERO_STATS = [
  { key: 'stats.thesis' },
  { key: 'stats.records' },
  { key: 'stats.award' },
  { key: 'stats.talks' },
] as const

export type VizKind = 'causal' | 'attribution' | 'network' | 'shockwave' | 'roc' | null

/**
 * Width of the card in the 6-column bento bed.
 * `full` spans the row; `half` pairs two cards side by side.
 */
export type BentoSpan = 'full' | 'half'

export interface Project {
  /** i18n key under `projects.items`. */
  id: string
  repo: string | null
  /** Live deployment, when the project has one. */
  demo: string | null
  stack: readonly string[]
  viz: VizKind
  /** Thesis work gets a distinct badge and the leading slot. */
  featured: boolean
  /** Bento footprint. Order + span together define the grid rhythm. */
  span: BentoSpan
}

export const PROJECTS: readonly Project[] = [
  {
    id: 'circt',
    repo: null,
    demo: null,
    stack: ['Python', 'PyTorch', 'PyTorch Geometric', 'NetworkX', 'SCM / do-calculus'],
    viz: 'attribution',
    featured: true,
    span: 'full',
  },
  {
    id: 'bitoguard',
    repo: 'https://github.com/tommy90112/Bito_AWS_Workshop',
    demo: null,
    stack: ['Python', 'XGBoost', 'LightGBM', 'CatBoost', 'SHAP', 'React', 'TypeScript'],
    viz: 'network',
    featured: true,
    span: 'half',
  },
  {
    id: 'highway',
    repo: 'https://github.com/tommy90112/Highway_trafficwave',
    demo: null,
    stack: ['Python', 'TensorFlow', 'FastAPI', 'Next.js', 'TypeScript'],
    viz: 'shockwave',
    featured: false,
    span: 'half',
  },
  {
    id: 'stroke',
    repo: 'https://github.com/tommy90112/Comparison-of-Machine-Learning-Methods-for-Stroke-Prediction',
    demo: null,
    stack: ['R', 'GAM', 'Random Forest', 'XGBoost'],
    viz: 'roc',
    featured: false,
    span: 'half',
  },
  {
    id: 'cyberviz',
    repo: 'https://github.com/tommy90112/Cyber-attack-data-visualization',
    demo: null,
    stack: ['JavaScript', 'three.js', 'React', 'Python'],
    viz: null,
    featured: false,
    span: 'half',
  },
  {
    id: 'stock',
    repo: 'https://github.com/tommy90112/Stock-recommendation-system',
    demo: null,
    stack: ['Python', 'Flask', 'PostgreSQL', 'Jupyter'],
    viz: null,
    featured: false,
    span: 'full',
  },
] as const

export interface SkillGroup {
  /** i18n key under `skills.groups`. */
  id: 'languages' | 'ml' | 'web' | 'methods'
  items: readonly string[]
  /** Columns out of 6 in the bento bed — wider groups get more room. */
  span: 2 | 3 | 4
  /** SVG path `d` on a 24×24 stroked grid. */
  icon: string
}

export const SKILL_GROUPS: readonly SkillGroup[] = [
  {
    id: 'languages',
    span: 2,
    icon: 'M9 18l-5-6 5-6M15 6l5 6-5 6',
    items: ['Python', 'R', 'SQL', 'TypeScript', 'JavaScript', 'Java'],
  },
  {
    id: 'ml',
    span: 4,
    icon: 'M12 3v4m0 10v4M3 12h4m10 0h4M6.3 6.3l2.9 2.9m5.6 5.6l2.9 2.9m0-11.4l-2.9 2.9m-5.6 5.6l-2.9 2.9',
    items: [
      'PyTorch',
      'PyTorch Geometric',
      'TensorFlow',
      'scikit-learn',
      'XGBoost',
      'LightGBM',
      'CatBoost',
      'SHAP',
    ],
  },
  {
    id: 'web',
    span: 2,
    icon: 'M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18M3 12a9 9 0 1118 0 9 9 0 01-18 0z',
    items: ['Vue', 'React', 'Next.js', 'three.js', 'FastAPI', 'Flask', 'PostgreSQL', 'AWS'],
  },
  {
    id: 'methods',
    span: 4,
    icon: 'M5 19V5m0 14h14M9 15V9m4 6V6m4 9v-4',
    items: [
      'Causal inference (SCM / do-calculus)',
      'Heterogeneous Graph Transformer',
      'Stacking ensembles',
      'Generalized Additive Models',
      'Anomaly detection (IF / HBOS / LOF)',
      'Fairness auditing',
    ],
  },
] as const

export interface ExperienceEntry {
  /** i18n key under `experience.items`. */
  id: 'cathay' | 'tku'
  current: boolean
}

export const EXPERIENCE: readonly ExperienceEntry[] = [
  { id: 'cathay', current: true },
  { id: 'tku', current: true },
] as const

export interface AwardEntry {
  /** i18n key under `awards.items`. */
  id: 'highway' | 'conference' | 'hackathon'
  icon: 'trophy' | 'mic' | 'flag'
  link: string | null
}

export const AWARDS: readonly AwardEntry[] = [
  { id: 'highway', icon: 'trophy', link: 'https://github.com/tommy90112/Highway_trafficwave' },
  { id: 'conference', icon: 'mic', link: 'https://github.com/tommy90112/Highway_trafficwave' },
  { id: 'hackathon', icon: 'flag', link: 'https://github.com/tommy90112/Bito_AWS_Workshop' },
] as const
