import type en from './en'

/**
 * Same shape as `en`, but with every leaf free to hold its own string.
 *
 * This exists because `fallbackLocale: 'en'` silently papers over a missing
 * translation — the page renders the English string instead of a visible
 * `foo.bar` key, so neither the eye nor the "every visible string is
 * translated" e2e check catches it. Annotating the file makes a dropped or
 * misspelled key a compile error instead.
 */
type Messages<T> = {
  [K in keyof T]: T[K] extends string ? string : Messages<T[K]>
}

const messages: Messages<typeof en> = {
  nav: {
    about: '關於',
    experience: '經歷',
    work: '作品',
    skills: '技能',
    certifications: '證照',
    awards: '獎項',
    contact: '聯絡',
    resumeCta: '聯絡我',
  },

  hero: {
    tag: '因果推論 × 圖機器學習',
    // 大標題不帶句末標點：全形標點固定佔一個字寬，在 100px 級距下
    // 會在行末留下明顯空隙。換行本身已經是斷句。
    headline1: '我做資料科學',
    headline2: '在圖上做',
    headlineEm: '因果推論',
    subline: '淡江大學統計與資料科學學系 數據科學碩士 · 台北',
    description:
      '碩士論文 CI-RCT 做的是圖神經網路上的因果根因追溯；此外也做過詐欺偵測、交通預測與健康風險建模。',
    ctaWork: '查看作品',
    ctaContact: '聯絡我',
    scroll: '向下捲動',
    vizCaption: '對候選原因進行干預，量測下游預測如何改變。',
  },

  stats: {
    thesis: { value: '0.95', label: '碩論詐欺偵測 AUC' },
    records: { value: '77 萬+', label: '筆交易紀錄建模' },
    award: { value: '第二名', label: '全國競賽名次' },
  },

  about: {
    eyebrow: '關於我',
    title: '先是統計，然後才是圖。',
    p1: '我是從統計進入機器學習的，這反映在我問的問題上。當一個圖神經網路把某個帳戶標記為詐欺，有用的答案不是鄰居節點的重要度熱圖——而是究竟哪一個上游原因該負責，以及如果那個原因不存在，結果會如何。',
    p2: '這正是我碩士論文 CI-RCT 的主題：一套將結構因果模型與 do-calculus 應用到異質圖神經網路的根因追溯框架。它不以特徵與輸出的相關性排序，而是直接對圖進行干預，量測結果如何改變。',
    p3: '論文之外，我的工作橫跨詐欺與異常偵測、交通預測、健康結果建模——通常有趣的地方在於資料的結構，而不是模型的規模。',
    focusTitle: '我專注的方向',
    focus1: '異質圖上的因果根因追溯',
    focus2: '大規模詐欺、異常與風險偵測',
    focus3: '已部署模型的可解釋性與公平性稽核',
    focus4: '把研究成果變成人真的能用的東西',
    factsTitle: '簡歷',
    factsEducation: '淡江大學統計與資料科學學系 數據科學碩士（2026 畢業）',
    factsLatest: '國泰人壽 程式設計實習生（2025/06 – 2026/06）',
    factsLocation: '台北，台灣',
  },

  experience: {
    eyebrow: '經歷',
    title: '我待過的地方。',
    currentLabel: '目前在職',
    items: {
      cathay: {
        org: '國泰人壽保險股份有限公司',
        role: '程式設計實習生',
        period: '2025/06 - 2026/06, 1年1個月',
        description:
          '依業務需求與系統分析師規格進行內部系統的程式設計與維運，技術以 Java、JSP、SpringBoot 與 Vue 為主。',
      },
      tku: {
        org: '淡江大學 統計與資料科學學系',
        role: '數據科學碩士班',
        period: '畢業',
        description: '碩士研究：基於因果干預之異質圖神經網路可解釋根因追溯（CI-RCT）。',
      },
    },
  },

  projects: {
    eyebrow: '精選作品',
    title: '六個專案，一條主線：結構重於規模。',
    subtitle: '這些專案都始於一個關於「資料是怎麼連起來的」的問題，而不是我想試某個模型。',
    viewRepo: '查看原始碼',
    viewDemo: '線上展示',
    privateRepo: '私有專案庫',
    thesisBadge: '碩士論文',
    items: {
      circt: {
        name: 'CI-RCT',
        tagline: '基於因果干預的根因追溯',
        description:
          '一套建立在結構因果模型與 do-calculus 之上的異質圖神經網路根因追溯框架。它不問哪些特徵與預測相關，而是對圖進行干預，找出真正該負責的原因——產生的解釋能通過「如果不是這樣，會怎麼樣？」這個問題的檢驗。',
        metric1: 'F1 0.85',
        metric1Label: '詐欺偵測',
        metric2: 'AUC 0.95',
        metric2Label: 'Elliptic++ 基準',
        metric3: '異質圖',
        metric3Label: 'Graph Transformer 骨幹',
        vizCaption: '同一組候選原因的兩種排序。兩者並不一致——這正是「以干預量測責任」而非「讀取相關性」的理由。',
      },
      bitoguard: {
        name: 'BitoGuard',
        tagline: '智慧合規風險雷達',
        description:
          '針對加密貨幣交易所的人頭帳戶偵測，建立在 77 萬筆以上的交易紀錄之上。一個留一法毒性轉換——計算使用者在共用錢包、共用 IP、直接轉帳鄰域中的黑名單密度，並移除自身標籤以防洩漏——把 F1 從 0.37 拉到 0.83，再送進三模型堆疊集成，上層搭配 SHAP 歸因與四維度公平性稽核。',
        metric1: 'F1 0.83',
        metric1Label: '自 0.37 提升',
        metric2: '77 萬+',
        metric2Label: '筆交易紀錄',
        metric3: '三模型',
        metric3Label: '堆疊集成',
        vizCaption: '黑名單密度在共用錢包鄰域中的傳播。',
      },
      highway: {
        name: '高速公路衝擊波預警系統',
        tagline: '融合物理的交通預測',
        description:
          '結合 MT-STNet 時空深度學習模型與物理衝擊波理論的交通衝擊波偵測與預測系統，透過即時監控儀表板呈現。物理約束是讓預測在最關鍵時刻——波正在形成而非已經過去時——值得信任的關鍵。',
        metric1: '第二名',
        metric1Label: '全國競賽',
        metric2: 'MT-STNet',
        metric2Label: '時空模型骨幹',
        metric3: '即時',
        metric3Label: '監控儀表板',
        vizCaption: '走走停停波逆著行車方向向後傳播。',
      },
      stroke: {
        name: '中風預測模型研究',
        tagline: 'GAM vs. 隨機森林 vs. XGBoost',
        description:
          '以 R 進行的三種模型族比較研究，三者在可解釋性上有實質不同的取捨，並加上風險因子的年齡分層分析。有趣的結果不是哪個模型贏——而是風險因子的排序會隨年齡層改變，而單一合併模型會完全掩蓋這件事。',
        metric1: '3 種模型',
        metric1Label: 'GAM · RF · XGBoost',
        metric2: '3,425',
        metric2Label: '筆清理後觀測值',
        metric3: '年齡分層',
        metric3Label: '風險因子分析',
        vizCaption: '三種模型族的 ROC 曲線比較。',
      },
      cyberviz: {
        name: '網路攻擊資料視覺化',
        tagline: 'UNSW-NB15 網路探索',
        description:
          'UNSW-NB15 入侵偵測資料集的 3D 節點連結互動探索——three.js 負責網路渲染，React 負責篩選與檢視介面。設計目的是讓攻擊樣態可以「走進去看」，而不是讀一張表。',
        metric1: 'three.js',
        metric1Label: '3D 渲染',
        metric2: 'UNSW-NB15',
        metric2Label: '入侵偵測資料集',
        metric3: 'React',
        metric3Label: '互動篩選',
      },
      mva: {
        name: '網路使用行為與網路霸凌傾向',
        tagline: '台灣傳播調查資料庫的多變量分析',
        description:
          '以 TCS 2021 台灣傳播調查資料（672 份有效樣本、68 個變數）分析成人的網路使用型態與網路霸凌傾向。用 GAP 廣義關聯圖分出五種使用者輪廓，再以主成分與因素分析壓縮構面、典型相關分析連結使用行為與負面情緒，最後訓練分類模型並用 SHAP 拆解預測依據——年齡是最強的預測因子，重要性佔 39.7%。',
        metric1: 'AUC 0.71',
        metric1Label: '高風險傾向分類',
        metric2: '5 群',
        metric2Label: 'GAP 使用者輪廓',
        metric3: '672',
        metric3Label: '份有效樣本 · 68 變數',
      },
    },
  },

  skills: {
    eyebrow: '技能',
    title: '我使用的工具。',
    subtitle: '只列出我真的用它做出過東西的項目。',
    groups: {
      languages: '程式語言',
      ml: '機器學習與統計',
      web: '網頁與基礎設施',
      methods: '方法論',
    },
  },

  certifications: {
    eyebrow: '證照',
    title: '證照與檢定。',
    subtitle: '有正式證書可查的部分。',
    verify: '驗證',
    items: {
      az900: {
        name: 'Microsoft Certified: Azure Fundamentals (AZ-900)',
        issuer: 'Microsoft',
        date: '2026 年 5 月',
      },
      ai900: {
        name: 'Microsoft Certified: Azure AI Fundamentals (AI-900)',
        issuer: 'Microsoft',
        date: '2026 年 5 月',
      },
      sas1: {
        name: 'SAS Programming 1: Essentials',
        issuer: 'SAS',
        date: '2023 年 11 月',
      },
      sas2: {
        name: 'SAS Programming 2: Data Manipulation Techniques',
        issuer: 'SAS',
        date: '2023 年 11 月',
      },
      itsAi: {
        name: 'IT Specialist - Artificial Intelligence',
        issuer: 'Certiport, a Pearson VUE business',
        date: '2023 年 10 月',
      },
    },
  },

  awards: {
    eyebrow: '獎項與肯定',
    title: '精選紀錄。',
    items: {
      mva: {
        title: '優選獎 · 最佳人氣海報獎',
        org: '2024 資料科學漫步（中央研究院統計科學研究所）',
        date: '2024 年 12 月',
      },
      highway: {
        title: '第二名（第一名從缺）',
        org: '全國高速公路智慧交通競賽',
        date: '2025 年 10 月',
      },
      hackathon: {
        title: '參賽隊伍 — BitoPro 加密貨幣交易安全賽道',
        org: 'Agent for Truth Hackathon（DIGITIMES × 國發會 × AWS）',
        date: '2026 年 3 月',
      },
    },
  },

  contact: {
    eyebrow: '聯絡',
    title: '聊聊吧。',
    description:
      '很樂意聊因果推論、圖學習，或任何能讓黑箱模型不那麼黑的東西。最快的方式是寄信給我。',
    emailLabel: '電子郵件',
    linkedinLabel: 'LinkedIn',
    githubLabel: 'GitHub',
  },

  footer: {
    built: '以 Vue、Vite 與 Tailwind 建置。原始碼在 GitHub。',
    // TODO: 換成你的中文姓名。GitHub 上只有羅馬拼音 YUHUNG,SHIH，我不猜漢字。
    rights: 'Yu-Hung Shih',
    privacy: '無流量分析、無 Cookie、無追蹤。',
  },

  theme: {
    auto: '自動',
    light: '亮色',
    dark: '暗色',
  },

  a11y: {
    toggleLanguage: '切換語言',
    toggleTheme: '色彩主題',
    openMenu: '開啟導覽選單',
    closeMenu: '關閉導覽選單',
    backToTop: '回到頂端',
  },
}

export default messages
