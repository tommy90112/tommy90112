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

export const NAV_SECTIONS = [
  { id: 'about', key: 'nav.about' },
  { id: 'experience', key: 'nav.experience' },
  { id: 'work', key: 'nav.work' },
  { id: 'skills', key: 'nav.skills' },
  { id: 'awards', key: 'nav.awards' },
  { id: 'contact', key: 'nav.contact' },
] as const

export const HERO_STATS = [
  { key: 'stats.thesis' },
  { key: 'stats.records' },
  { key: 'stats.award' },
  { key: 'stats.talks' },
] as const

export type VizKind = 'causal' | 'attribution' | 'network' | 'shockwave' | 'roc' | null

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
}

export const PROJECTS: readonly Project[] = [
  {
    id: 'circt',
    repo: null,
    demo: null,
    stack: ['Python', 'PyTorch', 'PyTorch Geometric', 'NetworkX', 'SCM / do-calculus'],
    viz: 'attribution',
    featured: true,
  },
  {
    id: 'bitoguard',
    repo: 'https://github.com/tommy90112/Bito_AWS_Workshop',
    demo: null,
    stack: ['Python', 'XGBoost', 'LightGBM', 'CatBoost', 'SHAP', 'React', 'TypeScript'],
    viz: 'network',
    featured: true,
  },
  {
    id: 'highway',
    repo: 'https://github.com/tommy90112/Highway_trafficwave',
    demo: null,
    stack: ['Python', 'TensorFlow', 'FastAPI', 'Next.js', 'TypeScript'],
    viz: 'shockwave',
    featured: false,
  },
  {
    id: 'stroke',
    repo: 'https://github.com/tommy90112/Comparison-of-Machine-Learning-Methods-for-Stroke-Prediction',
    demo: null,
    stack: ['R', 'GAM', 'Random Forest', 'XGBoost'],
    viz: 'roc',
    featured: false,
  },
  {
    id: 'cyberviz',
    repo: 'https://github.com/tommy90112/Cyber-attack-data-visualization',
    demo: null,
    stack: ['JavaScript', 'three.js', 'React', 'Python'],
    viz: null,
    featured: false,
  },
  {
    id: 'stock',
    repo: 'https://github.com/tommy90112/Stock-recommendation-system',
    demo: null,
    stack: ['Python', 'Flask', 'PostgreSQL', 'Jupyter'],
    viz: null,
    featured: false,
  },
] as const

export interface SkillGroup {
  /** i18n key under `skills.groups`. */
  id: 'languages' | 'ml' | 'web' | 'methods'
  items: readonly string[]
}

export const SKILL_GROUPS: readonly SkillGroup[] = [
  {
    id: 'languages',
    items: ['Python', 'R', 'SQL', 'TypeScript', 'JavaScript', 'Java'],
  },
  {
    id: 'ml',
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
    items: ['Vue', 'React', 'Next.js', 'three.js', 'FastAPI', 'Flask', 'PostgreSQL', 'AWS'],
  },
  {
    id: 'methods',
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
