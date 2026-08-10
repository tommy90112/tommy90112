<h1 align="center">Yu-Hung Shih</h1>

<p align="center">
  <strong>Data Science Master's Student</strong><br>
</p>

<p align="center">
  <a href="mailto:tommy90112@gmail.com"><img src="https://img.shields.io/badge/Email-tommy90112%40gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white" alt="Email"></a>
  <a href="https://www.linkedin.com/in/tommy90112/"><img src="https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"></a>
  <a href="https://github.com/tommy90112"><img src="https://img.shields.io/badge/GitHub-tommy90112-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"></a>
  <a href="https://tommy90112.github.io/tommy90112/"><img src="https://img.shields.io/badge/Portfolio-Live_site-7C6AFF?style=for-the-badge&logo=vuedotjs&logoColor=white" alt="Portfolio"></a>
</p>

<p align="center">
  <sub>
    An interactive walk through this work — including a clickable causal-intervention graph —
    lives at <a href="https://tommy90112.github.io/tommy90112/">tommy90112.github.io/tommy90112</a>
  </sub>
</p>

---

## About

> 🟢 **Open to work** — looking for data science and machine learning roles, Taipei or remote.
> Reach me at [tommy90112@gmail.com](mailto:tommy90112@gmail.com).

I work at the intersection of **statistics, causal inference, and graph machine learning**. My research asks a question most GNN explainers skip: when a model flags a node as fraudulent, *which upstream cause actually drove that decision* — and can we prove it by intervening rather than by correlating?

- 🎓 **MS, Data Science — Department of Statistics and Data Science, Tamkang University** (2026)
- 🏢 Most recently **Programming Intern at Cathay Life Insurance** (Jun 2025 – Jun 2026)
- 🔬 Focus: causal root-cause tracing on heterogeneous graphs, fraud & anomaly detection, explainable AI
- 📍 Taipei, Taiwan

---

## Highlights

| Achievement | Event | Date |
|---|---|---|
| 🥈 **2nd Place** (1st place vacant) | National Expressway Intelligent Traffic Competition | Oct 2024 |
| 🏆 **Competing team — BitoPro Cryptocurrency Security track** | Agent for Truth Hackathon (DIGITIMES × NDC × AWS) | Mar 2026 |

<!-- TODO: 補上其他獎項／證照／論文發表，格式照上面的表格即可
| 🏅 獎項名稱 | 主辦單位／比賽名稱 | YYYY/MM |
| 📜 證照名稱 | 發證單位 | YYYY/MM |
-->

---

## Selected work

### 🧬 CI-RCT — Causal Intervention-Based Root Cause Tracing
> Master's thesis research · *private repository*

A root-cause tracing methodology for heterogeneous graph neural networks, grounded in structural causal models and do-calculus. Instead of asking which features *correlate* with a prediction, CI-RCT intervenes on the graph to identify which causes are actually responsible. Validated on the **Elliptic++ Bitcoin fraud network**, reaching **F1 = 0.85** and **AUC = 0.95** on detection while producing traceable causal explanations.

`Heterogeneous Graph Transformer` · `SCM / do-calculus` · `PyTorch` · `Python`

---

### 🛡️ [BitoGuard — Intelligent Compliance Risk Radar](https://github.com/tommy90112/Bito_AWS_Workshop)

Blacklisted ("mule") account detection for cryptocurrency exchanges, built over **770,000+ transaction records**. A leave-one-out toxicity feature transform lifted F1 from 0.37 to **0.83**, feeding a 3-model stacking ensemble (XGBoost + LightGBM with focal loss + CatBoost) with SHAP attribution and a 4-dimension fairness audit on top.

[![lang](https://img.shields.io/github/languages/top/tommy90112/Bito_AWS_Workshop?style=flat-square)](https://github.com/tommy90112/Bito_AWS_Workshop)
[![last commit](https://img.shields.io/github/last-commit/tommy90112/Bito_AWS_Workshop?style=flat-square)](https://github.com/tommy90112/Bito_AWS_Workshop/commits)

---

### 🚗 [Highway Intelligent Traffic Shockwave Warning System](https://github.com/tommy90112/Highway_trafficwave)

Traffic shockwave detection and prediction that fuses the **MT-STNet** deep learning model with physics-based shockwave theory, served through a real-time monitoring dashboard. Took **2nd place** in the National Expressway Intelligent Traffic Competition and was presented at the 2025 Chinese Institute of Transportation Annual Conference.

[![lang](https://img.shields.io/github/languages/top/tommy90112/Highway_trafficwave?style=flat-square)](https://github.com/tommy90112/Highway_trafficwave)
[![last commit](https://img.shields.io/github/last-commit/tommy90112/Highway_trafficwave?style=flat-square)](https://github.com/tommy90112/Highway_trafficwave/commits)

---

### 📈 [Stock Recommendation System](https://github.com/tommy90112/Stock-recommendation-system)

A Taiwan-market stock screening platform with a three-tier architecture (Flask + PostgreSQL + web frontend). Rather than scoring every stock the same way, it applies **industry-specific valuation logic** for financials, construction, shipping, semiconductors, electronic components, and ETFs.

[![lang](https://img.shields.io/github/languages/top/tommy90112/Stock-recommendation-system?style=flat-square)](https://github.com/tommy90112/Stock-recommendation-system)
[![last commit](https://img.shields.io/github/last-commit/tommy90112/Stock-recommendation-system?style=flat-square)](https://github.com/tommy90112/Stock-recommendation-system/commits)

---

### 🌐 [Cyber Attack Data Visualization](https://github.com/tommy90112/Cyber-attack-data-visualization)

An interactive 3D node-link exploration of the **UNSW-NB15** intrusion detection dataset — three.js for the network rendering, React for the filtering and inspection interface.

[![lang](https://img.shields.io/github/languages/top/tommy90112/Cyber-attack-data-visualization?style=flat-square)](https://github.com/tommy90112/Cyber-attack-data-visualization)
[![last commit](https://img.shields.io/github/last-commit/tommy90112/Cyber-attack-data-visualization?style=flat-square)](https://github.com/tommy90112/Cyber-attack-data-visualization/commits)

---

### 🧠 [Stroke Prediction — GAM vs. Random Forest vs. XGBoost](https://github.com/tommy90112/Comparison-of-Machine-Learning-Methods-for-Stroke-Prediction)

A comparative study in R across three model families with different bias-variance and interpretability trade-offs, plus an **age-stratified** analysis of risk factors (glucose, hypertension, heart disease). Evaluated on 3,425 cleaned observations via ROC/AUC, sensitivity, and specificity.

[![lang](https://img.shields.io/github/languages/top/tommy90112/Comparison-of-Machine-Learning-Methods-for-Stroke-Prediction?style=flat-square)](https://github.com/tommy90112/Comparison-of-Machine-Learning-Methods-for-Stroke-Prediction)
[![last commit](https://img.shields.io/github/last-commit/tommy90112/Comparison-of-Machine-Learning-Methods-for-Stroke-Prediction?style=flat-square)](https://github.com/tommy90112/Comparison-of-Machine-Learning-Methods-for-Stroke-Prediction/commits)

---

## Tech I work with

**Languages**

![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)
![R](https://img.shields.io/badge/R-276DC3?style=flat-square&logo=r&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![SQL](https://img.shields.io/badge/SQL-4479A1?style=flat-square&logo=postgresql&logoColor=white)
![Java](https://img.shields.io/badge/Java-ED8B00?style=flat-square&logo=openjdk&logoColor=white)

**Data Science / ML**

![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=flat-square&logo=pytorch&logoColor=white)
![TensorFlow](https://img.shields.io/badge/TensorFlow-FF6F00?style=flat-square&logo=tensorflow&logoColor=white)
![XGBoost](https://img.shields.io/badge/XGBoost-337AB7?style=flat-square)
![LightGBM](https://img.shields.io/badge/LightGBM-9ACD32?style=flat-square)
![CatBoost](https://img.shields.io/badge/CatBoost-FFCC00?style=flat-square&logoColor=black)
![SHAP](https://img.shields.io/badge/SHAP-000000?style=flat-square)

Heterogeneous Graph Transformer · causal inference (SCM / do-calculus) · stacking ensembles · GAM · Random Forest · anomaly detection (Isolation Forest / HBOS / LOF) · fairness auditing

**Web & Data Infrastructure**

![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![three.js](https://img.shields.io/badge/three.js-000000?style=flat-square&logo=threedotjs&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=flat-square&logo=flask&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-232F3E?style=flat-square&logo=amazonwebservices&logoColor=white)

---

## This profile

The [portfolio site](https://tommy90112.github.io/tommy90112/) is built from the
[`portfolio/`](portfolio/) directory of this repository — Vue 3, TypeScript,
Vite and Tailwind, with every data visualisation hand-written in SVG rather than
pulled from a charting library. It deploys itself on push.

## More

Beyond the projects above, my repositories also cover a RAG-based conversational assistant for statistics students, traffic flow prediction, multivariate analysis of internet use and bullying, and coursework in generative AI and data engineering. Browse them all at [github.com/tommy90112?tab=repositories](https://github.com/tommy90112?tab=repositories).

<!-- TODO: star / follower 數成長後，可以把下面這組即時徽章取消註解放回來
<p align="center">
  <img src="https://img.shields.io/github/followers/tommy90112?style=for-the-badge&label=followers&color=181717&logo=github" alt="followers">
  <img src="https://img.shields.io/github/stars/tommy90112?style=for-the-badge&label=total%20stars&color=181717&logo=github" alt="total stars">
</p>
-->

---

<p align="center">
  Always happy to talk about causal inference, graph learning, or anything that makes a black-box model less black.<br>
  📮 <a href="mailto:tommy90112@gmail.com">tommy90112@gmail.com</a> · 💼 <a href="https://www.linkedin.com/in/tommy90112/">LinkedIn</a>
</p>
