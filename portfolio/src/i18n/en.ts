export default {
  nav: {
    about: 'About',
    experience: 'Experience',
    work: 'Work',
    skills: 'Skills',
    certifications: 'Certifications',
    awards: 'Awards',
    contact: 'Contact',
    resumeCta: 'Get in touch',
  },

  hero: {
    tag: 'Causal Inference × Graph Machine Learning',
    headline1: 'Data science on',
    headline2: 'graphs, with',
    headlineEm: 'causal inference.',
    subline: 'MS Data Science, Tamkang University · Cathay Life Insurance · Taipei, Taiwan',
    description:
      'My thesis, CI-RCT, does causal root-cause tracing on graph neural networks. Alongside it I have worked on fraud detection, traffic forecasting, and health risk modelling.',
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
    note: 'Dates to be confirmed — see the TODO in the source.',
    items: {
      cathay: {
        org: 'Cathay Life Insurance Co., Ltd.',
        role: 'Software Engineering Intern',
        period: 'Present',
        description:
          'Building and maintaining internal systems against specifications written by business analysts — primarily Java, JSP, and Vue.',
      },
      tku: {
        org: 'Tamkang University — Department of Statistics',
        role: 'MS, Data Science Program',
        period: 'Graduated',
        description:
          'Master\'s research on causal intervention-based explainable root cause tracing for heterogeneous graph neural networks (CI-RCT).',
      },
    },
  },

  projects: {
    eyebrow: 'Selected work',
    title: 'Six projects, one thread: structure over scale.',
    subtitle:
      'Each of these started from a question about how the data is connected — not from a model I wanted to try.',
    viewRepo: 'View repository',
    viewDemo: 'Live demo',
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
      mva: {
        name: 'Internet Use & Cyberbullying',
        tagline: 'Multivariate analysis of the Taiwan Communication Survey',
        description:
          'An analysis of adult internet usage patterns and cyberbullying tendency using TCS 2021 survey data (672 valid responses, 68 variables). Generalized Association Plots separated five distinct user profiles; PCA and factor analysis reduced the construct space; canonical correlation linked usage behaviour to negative affect; and a classification model with SHAP attribution identified age as the dominant predictor at 39.7% importance.',
        metric1: 'AUC 0.71',
        metric1Label: 'high-risk classification',
        metric2: '5 clusters',
        metric2Label: 'GAP user profiles',
        metric3: '672',
        metric3Label: 'valid responses · 68 variables',
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

  certifications: {
    eyebrow: 'Certifications',
    title: 'Credentials.',
    subtitle: 'The ones backed by a certificate you can check.',
    verify: 'Verify',
    items: {
      az900: {
        name: 'Microsoft Certified: Azure Fundamentals (AZ-900)',
        issuer: 'Microsoft',
        date: 'May 2026',
      },
      ai900: {
        name: 'Microsoft Certified: Azure AI Fundamentals (AI-900)',
        issuer: 'Microsoft',
        date: 'May 2026',
      },
      sas1: {
        name: 'SAS Programming 1: Essentials',
        issuer: 'SAS',
        date: 'Nov 2023',
      },
      sas2: {
        name: 'SAS Programming 2: Data Manipulation Techniques',
        issuer: 'SAS',
        date: 'Nov 2023',
      },
      itsAi: {
        name: 'IT Specialist - Artificial Intelligence',
        issuer: 'Certiport, a Pearson VUE business',
        date: 'Oct 2023',
      },
    },
  },

  awards: {
    eyebrow: 'Awards & recognition',
    title: 'Selected recognition.',
    items: {
      mva: {
        title: 'Merit Award · Most Popular Poster Award',
        org: 'Promenade of Data Science 2024, Institute of Statistical Science, Academia Sinica',
        date: 'Dec 2024',
      },
      highway: {
        title: '2nd Place (1st place vacant)',
        org: 'National Expressway Intelligent Traffic Competition',
        date: 'Oct 2025',
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
