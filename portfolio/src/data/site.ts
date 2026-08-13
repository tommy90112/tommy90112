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
 * Job-search state — one switch for the whole site.
 *
 * Flip `openToWork` to false once a role is signed and every open-to-work
 * surface disappears at once. (The profile README is a separate file and has
 * to be edited by hand.)
 */
export const AVAILABILITY = {
  openToWork: true,
  /**
   * First day available, ISO. Rather than going stale, this flips its own
   * wording: before the date the page offers it, on or after it the page says
   * "available immediately". Nothing here needs updating on a deadline.
   */
  availableFrom: '2026-09-01',
} as const

/** True once `availableFrom` has arrived. */
export function isAvailableNow(now: Date = new Date()): boolean {
  return now >= new Date(AVAILABILITY.availableFrom)
}

/** `availableFrom` as "September 2026" / "2026年9月", per locale. */
export function formatAvailableFrom(locale: string): string {
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long' }).format(
    new Date(AVAILABILITY.availableFrom),
  )
}

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
    id: 'certifications',
    key: 'nav.certifications',
    icon: 'M9 12l2 2 4-4M12 3l7 4v5c0 4.4-3 8.4-7 9.5C8 20.4 5 16.4 5 12V7l7-4z',
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
] as const

export type VizKind = 'causal' | 'attribution' | 'network' | 'shockwave' | 'roc' | null

/**
 * Authored width of the card in the 12-column bed.
 * `full` spans the row; `half` pairs two cards side by side. The rendered
 * width can differ — filtering promotes a stranded `half` to a full row.
 */
export type ProjectSpan = 'full' | 'half'

/**
 * Problem domain, used to filter the work section.
 *
 * Deliberately about the *problem*, not the technique: someone hiring for a
 * fraud role is looking for fraud work, and does not care whether it was solved
 * with a graph transformer or a gradient boost. A project can sit in more than
 * one — most real work does.
 */
export type ProjectDomain =
  | 'causal'
  | 'fraud'
  | 'forecasting'
  | 'modelling'
  | 'analysis'
  | 'visualization'

/** Filter order. Not alphabetical — most central to the thesis first. */
export const PROJECT_DOMAINS: readonly ProjectDomain[] = [
  'causal',
  'fraud',
  'forecasting',
  'modelling',
  'analysis',
  'visualization',
] as const

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
  /** Grid footprint. Order + span together define the rhythm. */
  span: ProjectSpan
  /** Problem domains this project belongs to; at least one. */
  domains: readonly ProjectDomain[]
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
    domains: ['causal'],
  },
  {
    id: 'bitoguard',
    repo: 'https://github.com/tommy90112/Bito_AWS_Workshop',
    demo: null,
    stack: ['Python', 'XGBoost', 'LightGBM', 'CatBoost', 'SHAP', 'React', 'TypeScript'],
    viz: 'network',
    featured: true,
    span: 'half',
    domains: ['fraud', 'modelling'],
  },
  {
    id: 'highway',
    repo: 'https://github.com/tommy90112/Highway_trafficwave',
    demo: null,
    stack: ['Python', 'TensorFlow', 'FastAPI', 'Next.js', 'TypeScript'],
    viz: 'shockwave',
    featured: false,
    span: 'half',
    domains: ['forecasting', 'modelling'],
  },
  {
    id: 'mva',
    repo: 'https://github.com/tommy90112/MVA-Internet-use-and-bullying',
    demo: 'https://timwei0801.github.io/MVA-Internet-use-and-bullying/',
    stack: ['R', 'Python', 'scikit-learn', 'SHAP', 'Vue', 'GSAP'],
    viz: null,
    featured: false,
    span: 'full',
    domains: ['analysis', 'visualization'],
  },
  {
    id: 'cyberviz',
    repo: 'https://github.com/tommy90112/Cyber-attack-data-visualization',
    demo: null,
    stack: ['JavaScript', 'three.js', 'React', 'Python'],
    viz: null,
    featured: false,
    span: 'half',
    domains: ['visualization'],
  },
  {
    id: 'stroke',
    repo: 'https://github.com/tommy90112/Comparison-of-Machine-Learning-Methods-for-Stroke-Prediction',
    demo: null,
    stack: ['R', 'GAM', 'Random Forest', 'XGBoost'],
    viz: 'roc',
    featured: false,
    span: 'half',
    domains: ['analysis', 'modelling'],
  },
] as const

export interface SkillGroup {
  /** i18n key under `skills.groups`. */
  id: 'languages' | 'ml' | 'web' | 'methods'
  items: readonly string[]
  /** SVG path `d` on a 24×24 stroked grid. */
  icon: string
}

export const SKILL_GROUPS: readonly SkillGroup[] = [
  {
    id: 'languages',
    icon: 'M9 18l-5-6 5-6M15 6l5 6-5 6',
    items: ['Python', 'R', 'SQL', 'TypeScript', 'JavaScript', 'Java'],
  },
  {
    id: 'ml',
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
    icon: 'M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18M3 12a9 9 0 1118 0 9 9 0 01-18 0z',
    items: ['Vue', 'React', 'Next.js', 'three.js', 'JSP', 'FastAPI', 'Flask', 'PostgreSQL', 'AWS'],
  },
  {
    id: 'methods',
    icon: 'M5 19V5m0 14h14M9 15V9m4 6V6m4 9v-4',
    items: [
      'Causal inference (SCM / do-calculus)',
      'Heterogeneous Graph Transformer',
      'Stacking ensembles',
      'Generalized Additive Models',
      'Multivariate analysis (PCA / FA / CCA)',
      'Anomaly detection (IF / HBOS / LOF)',
      'Fairness auditing',
    ],
  },
] as const

export interface CertificationEntry {
  /** i18n key under `certifications.items` — holds `name` / `issuer` / `date`. */
  id: string
  /** Verification / credential URL, when the issuer provides one. */
  link: string | null
  /**
   * Badge artwork, as a path under `public/` (e.g. `badges/az-900.png`).
   * Self-hosted rather than hot-linked from images.credly.com: an external
   * image makes every visitor's browser announce itself to Credly, and a
   * third-party outage would leave holes in the section. `null` falls back
   * to a generic shield icon.
   */
  badge: string | null
}

/**
 * Certifications, most recent first — with the two SAS courses kept in
 * sequence, since reversing a numbered series reads as a mistake.
 *
 * `link` points at the Credly public badge page, which shows the credential
 * issued to a named earner and verifiable against the issuer. That is what
 * separates a badge from a screenshot anyone could copy, so it is worth
 * keeping populated. UUIDs come from the earner's public badge feed:
 * https://www.credly.com/users/yuhung-shih.e36abb06/badges.json
 *
 * To add one:
 *   1. push an entry here;
 *   2. add `certifications.items.<id>` with `name` / `issuer` / `date` to
 *      BOTH `src/i18n/en.ts` and `src/i18n/zh-TW.ts` — the zh-TW file is
 *      type-checked against en, so a missing key fails the build.
 */
export const CERTIFICATIONS: readonly CertificationEntry[] = [
  {
    id: 'az900',
    link: 'https://www.credly.com/badges/de9bfa37-4f9a-4f12-bbe7-a5a6f23a7902/public_url',
    badge: 'badges/azure_az-900.png',
  },
  {
    id: 'ai900',
    link: 'https://www.credly.com/badges/1461cf20-00d2-4404-9b1e-64cee63b51d7/public_url',
    badge: 'badges/azure_ai-900.png',
  },
  {
    id: 'sas1',
    link: 'https://www.credly.com/badges/faf3af9a-5e0c-4849-8a2a-4755f5897109/public_url',
    badge: 'badges/SAS_programming_1.png',
  },
  {
    id: 'sas2',
    link: 'https://www.credly.com/badges/fd0cc39b-61d8-486f-9025-6421763f38e8/public_url',
    badge: 'badges/SAS_programming_2.png',
  },
  {
    id: 'itsAi',
    link: 'https://www.credly.com/badges/d0275143-3966-4f13-9ea9-9f4e7c997c0b/public_url',
    badge: 'badges/ITS-Badges_ai.png',
  },
]

export interface ExperienceEntry {
  /** i18n key under `experience.items`. */
  id: 'cathay' | 'tku'
  current: boolean
}

export const EXPERIENCE: readonly ExperienceEntry[] = [
  // The internship ended in June 2026; neither entry is ongoing, so no timeline
  // node carries the "current" accent. The `current: true` branch in
  // Experience.vue stays for whenever a new role starts.
  { id: 'cathay', current: false },
  { id: 'tku', current: false },
] as const

export interface AwardEntry {
  /** i18n key under `awards.items`. */
  id: 'highway' | 'mva' | 'hackathon'
  icon: 'trophy' | 'flag' | 'poster'
  link: string | null
}

/** Most recent first. */
export const AWARDS: readonly AwardEntry[] = [
  {
    id: 'hackathon',
    icon: 'flag',
    link: 'https://github.com/tommy90112/Bito_AWS_Workshop',
  },
  {
    id: 'highway',
    icon: 'trophy',
    link: 'https://github.com/tommy90112/Highway_trafficwave',
  },
  {
    id: 'mva',
    icon: 'poster',
    link: 'https://github.com/tommy90112/MVA-Internet-use-and-bullying',
  },
] as const
