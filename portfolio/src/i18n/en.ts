export default {
  nav: {
    about: 'About',
    experience: 'Experience',
    work: 'Work',
    skills: 'Skills',
    awards: 'Awards',
    contact: 'Contact',
    resumeCta: 'Get in touch',
  },

  hero: {
    tag: 'Causal Inference × Graph Machine Learning',
    headline1: 'Models that explain',
    headline2: 'why, not just',
    headlineEm: 'what.',
    subline: 'MS Data Science, Tamkang University · Cathay Life Insurance · Taipei, Taiwan',
    description:
      'I build machine learning systems on graph-structured data — and then I take them apart. My research traces a prediction back to the cause that actually produced it, by intervening on the graph rather than reading off correlations.',
    ctaWork: 'See selected work',
    ctaContact: 'Get in touch',
    scroll: 'Scroll',
    vizCaption:
      'Intervening on a candidate cause and measuring how the downstream prediction shifts.',
  },

  stats: {
    thesis: { value: '0.95', label: 'AUC — thesis fraud detection' },
    records: { value: '770K+', label: 'transactions modelled' },
    award: { value: '2nd', label: 'national competition placing' },
    talks: { value: '1', label: 'invited conference talk' },
  },

  about: {
    eyebrow: 'About',
    title: 'Statistics first, then the graph.',
    p1: 'I came to machine learning through statistics, and it shows in the questions I ask. When a graph neural network flags an account as fraudulent, the useful answer is not a saliency map over its neighbours — it is which upstream cause is actually responsible, and what would have happened had that cause been absent.',
    p2: 'That question is the subject of my master\'s thesis, CI-RCT: a root-cause tracing framework that applies structural causal models and do-calculus to heterogeneous graph neural networks. Instead of ranking features by correlation with the output, it intervenes on the graph and measures what changes.',
    p3: 'Outside the thesis I work across fraud and anomaly detection, traffic prediction, and health outcome modelling — usually where the interesting part is the structure of the data rather than the size of the model.',
    focusTitle: 'What I focus on',
    focus1: 'Causal root-cause tracing on heterogeneous graphs',
    focus2: 'Fraud, anomaly, and risk detection at scale',
    focus3: 'Explainability and fairness auditing of deployed models',
    focus4: 'Turning research output into something a person can actually use',
    currentTitle: 'Right now',
    currentRole: 'Cathay Life Insurance Co., Ltd.',
    currentStudy: 'MS, Data Science Program — Department of Statistics, Tamkang University',
    currentLocation: 'Taipei, Taiwan',
  },

  experience: {
    eyebrow: 'Experience',
    title: 'Where I have been working.',
    note: 'Roles and dates to be confirmed — see the TODO in the source.',
    items: {
      cathay: {
        org: 'Cathay Life Insurance Co., Ltd.',
        role: 'Data Science',
        period: 'Present',
        description:
          'Applying statistical modelling and machine learning in an insurance data environment.',
      },
      tku: {
        org: 'Tamkang University — Department of Statistics',
        role: 'MS, Data Science Program',
        period: 'Present',
        description:
          'Master\'s research on causal intervention-based root cause tracing for heterogeneous graph neural networks (CI-RCT).',
      },
    },
  },

  projects: {
    eyebrow: 'Selected work',
    title: 'Six projects, one thread: structure over scale.',
    subtitle:
      'Each of these started from a question about how the data is connected — not from a model I wanted to try.',
    viewRepo: 'View repository',
    privateRepo: 'Private repository',
    thesisBadge: "Master's thesis",
    items: {
      circt: {
        name: 'CI-RCT',
        tagline: 'Causal Intervention-Based Root Cause Tracing',
        description:
          'A root-cause tracing framework for heterogeneous graph neural networks built on structural causal models and do-calculus. Rather than asking which features correlate with a prediction, CI-RCT intervenes on the graph to identify which causes are actually responsible — producing explanations that survive the question "what would have happened otherwise?"',
        metric1: 'F1 0.85',
        metric1Label: 'fraud detection',
        metric2: 'AUC 0.95',
        metric2Label: 'Elliptic++ benchmark',
        metric3: 'Heterogeneous',
        metric3Label: 'graph transformer backbone',
        vizCaption:
          'The same candidate causes, ranked two ways. The orderings disagree — which is the argument for measuring responsibility under intervention rather than reading off correlation.',
      },
      bitoguard: {
        name: 'BitoGuard',
        tagline: 'Intelligent Compliance Risk Radar',
        description:
          'Mule-account detection for a cryptocurrency exchange, built over 770,000+ transaction records. A leave-one-out toxicity transform — blacklist density across a user\'s shared-wallet, shared-IP, and direct-transfer neighbourhood, with self-label removal to prevent leakage — lifted F1 from 0.37 to 0.83, feeding a three-model stacking ensemble with SHAP attribution and a four-dimension fairness audit on top.',
        metric1: 'F1 0.83',
        metric1Label: 'up from 0.37',
        metric2: '770K+',
        metric2Label: 'transaction records',
        metric3: '3-model',
        metric3Label: 'stacking ensemble',
        vizCaption:
          'Blacklist density propagating through a shared-wallet neighbourhood.',
      },
      highway: {
        name: 'Highway Shockwave Warning',
        tagline: 'Physics-informed traffic prediction',
        description:
          'A traffic shockwave detection and prediction system that fuses the MT-STNet spatiotemporal deep learning model with physics-based shockwave theory, served through a real-time monitoring dashboard. The physics constraint is what makes the forecast trustworthy at the moment it matters — when a wave is forming, not after it has passed.',
        metric1: '2nd place',
        metric1Label: 'national competition',
        metric2: 'MT-STNet',
        metric2Label: 'spatiotemporal backbone',
        metric3: 'Real-time',
        metric3Label: 'monitoring dashboard',
        vizCaption:
          'A stop-and-go wave propagating backwards against the direction of travel.',
      },
      stroke: {
        name: 'Stroke Prediction',
        tagline: 'GAM vs. Random Forest vs. XGBoost',
        description:
          'A comparative study in R across three model families with genuinely different interpretability trade-offs, plus an age-stratified analysis of risk factors. The interesting result was not which model won — it was that the risk factor ranking changes by age stratum, which a single pooled model hides entirely.',
        metric1: '3 models',
        metric1Label: 'GAM · RF · XGBoost',
        metric2: '3,425',
        metric2Label: 'cleaned observations',
        metric3: 'Age-stratified',
        metric3Label: 'risk factor analysis',
        vizCaption: 'ROC comparison across the three model families.',
      },
      cyberviz: {
        name: 'Cyber Attack Visualization',
        tagline: 'UNSW-NB15 network exploration',
        description:
          'An interactive 3D node-link exploration of the UNSW-NB15 intrusion detection dataset — three.js for the network rendering, React for filtering and inspection. Built to make attack patterns legible by moving through them rather than reading a table of them.',
        metric1: 'three.js',
        metric1Label: '3D rendering',
        metric2: 'UNSW-NB15',
        metric2Label: 'intrusion dataset',
        metric3: 'React',
        metric3Label: 'interactive filtering',
      },
      stock: {
        name: 'Stock Recommendation System',
        tagline: 'Industry-aware equity screening',
        description:
          'A Taiwan-market stock screening platform on a three-tier architecture. The premise is that one valuation formula cannot fairly score a bank and a semiconductor fab, so it applies separate evaluation logic per industry — financials, construction, shipping, semiconductors, electronic components, and ETFs.',
        metric1: '6 industries',
        metric1Label: 'separate valuation logic',
        metric2: 'PostgreSQL',
        metric2Label: 'data layer',
        metric3: 'Flask',
        metric3Label: 'application layer',
      },
    },
  },

  skills: {
    eyebrow: 'Skills',
    title: 'What I work with.',
    subtitle: 'Listed only where I have shipped something with it.',
    groups: {
      languages: 'Languages',
      ml: 'Machine Learning & Statistics',
      web: 'Web & Infrastructure',
      methods: 'Methods',
    },
  },

  awards: {
    eyebrow: 'Awards & recognition',
    title: 'Selected recognition.',
    items: {
      highway: {
        title: '2nd Place (1st place vacant)',
        org: 'National Expressway Intelligent Traffic Competition',
        date: 'Oct 2024',
      },
      conference: {
        title: 'Invited Speaker',
        org: '2025 Chinese Institute of Transportation Annual Conference',
        date: 'Dec 2025',
      },
      hackathon: {
        title: 'Competing team — BitoPro Cryptocurrency Security track',
        org: 'Agent for Truth Hackathon (DIGITIMES × NDC × AWS)',
        date: 'Mar 2026',
      },
    },
  },

  contact: {
    eyebrow: 'Contact',
    title: 'Let\'s talk.',
    description:
      'Always happy to talk about causal inference, graph learning, or anything that makes a black-box model less black. The fastest way to reach me is email.',
    emailLabel: 'Email',
    linkedinLabel: 'LinkedIn',
    githubLabel: 'GitHub',
  },

  footer: {
    built: 'Built with Vue, Vite and Tailwind. Source on GitHub.',
    rights: 'Yu-Hung Shih',
  },

  a11y: {
    toggleLanguage: 'Switch language',
    openMenu: 'Open navigation menu',
    closeMenu: 'Close navigation menu',
    backToTop: 'Back to top',
  },
} as const
