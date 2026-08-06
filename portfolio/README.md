# Portfolio site

The Vue single-page portfolio behind [tommy90112.github.io/tommy90112](https://tommy90112.github.io/tommy90112/).
The Markdown profile that shows on the GitHub account page lives in [`../README.md`](../README.md).

## Stack

Vue 3 (`<script setup>` + TypeScript) · Vite · Tailwind CSS · vue-i18n · Playwright

No charting or animation library: the four data visualisations are hand-written
SVG, and scroll reveals are one `IntersectionObserver` in
[`src/composables/useReveal.ts`](src/composables/useReveal.ts).

## Commands

```bash
npm install
npm run dev        # dev server
npm run build      # type-check (vue-tsc) then production build
npm run preview    # serve the production bundle at /tommy90112/
npm run test:e2e   # Playwright, desktop + mobile
```

Playwright needs its browser once: `npx playwright install chromium`.

## Layout

```
src/
├── data/site.ts          # links, project list, skills, awards — language-independent
├── i18n/{en,zh-TW}.ts    # every user-visible string
├── components/           # one file per page section
│   └── viz/              # the four SVG visualisations
└── composables/          # useReveal
```

**Where to edit what**

| Change | File |
| --- | --- |
| Wording, in either language | `src/i18n/en.ts` and `src/i18n/zh-TW.ts` |
| Add or reorder a project | `PROJECTS` in `src/data/site.ts`, then add its copy to both i18n files |
| Add an award, skill, or role | the matching array in `src/data/site.ts`, then both i18n files |
| Colours, type scale | `tailwind.config.js` |

Both i18n files must stay in step — `npm run test:e2e` fails if a key is
missing in either, because untranslated keys render as their raw dot-path.

## Deployment

[`../.github/workflows/deploy.yml`](../.github/workflows/deploy.yml) builds,
runs the tests, and publishes to GitHub Pages on every push to `main` that
touches `portfolio/`.

Requires **Settings → Pages → Source: GitHub Actions** on the repository.

The site is served from a subpath, so `base` in
[`vite.config.ts`](vite.config.ts) is `/tommy90112/`. Changing the repository
name means changing that value too.

## Open TODOs

Search the source for `TODO:`. Currently:

- `src/i18n/zh-TW.ts` — Chinese name in the footer
- `src/components/Experience.vue` — full roles and dates
- `src/components/Awards.vue` — remaining awards and certifications
- `src/components/viz/RocViz.vue` — real AUC values for the stroke study
