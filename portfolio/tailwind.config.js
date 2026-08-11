/** @type {import('tailwindcss').Config} */

/**
 * Every colour resolves through a CSS custom property rather than a literal,
 * so one `data-theme` flip on `<html>` re-tints the whole page without a second
 * set of utilities. The channel triples live in `src/style.css`; this file only
 * names them.
 *
 * The names are semantic, not hue-based — `accent` rather than `red` — so a
 * palette change stays a variable edit instead of a find-and-replace across
 * forty components.
 */
const themed = (name) => `rgb(var(--${name}) / <alpha-value>)`

export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        page: themed('bg'),
        sunk: themed('bg-sunk'),

        surface: {
          DEFAULT: themed('surface'),
          raised: themed('surface-raised'),
        },

        line: {
          DEFAULT: themed('line'),
          strong: themed('line-strong'),
        },

        fg: {
          DEFAULT: themed('fg'),
          muted: themed('fg-muted'),
          faint: themed('fg-faint'),
        },

        accent: {
          DEFAULT: themed('accent'),
          soft: themed('accent-soft'),
          on: themed('accent-on'),
        },

        // Chart series only — never interface chrome.
        data: {
          1: themed('accent'),
          2: themed('data-2'),
          3: themed('data-3'),
        },
      },

      fontFamily: {
        // One family for everything that is not a number or a label. Archivo is
        // a grotesque in the Akzidenz line with a real width axis, which is
        // what lets display sizes tighten without a separate condensed cut.
        sans: ['Archivo', 'Noto Sans TC', 'Helvetica Neue', 'Arial', 'sans-serif'],
        // Aliased to the same stack: the display face in this style is the text
        // face at a different weight, not a second typeface.
        display: ['Archivo', 'Noto Sans TC', 'Helvetica Neue', 'Arial', 'sans-serif'],
        // Reserved for data, labels, and metadata — the voice that says
        // "this is a measurement".
        mono: ['IBM Plex Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },

      fontSize: {
        // Tight leading and negative tracking throughout: at these sizes the
        // default spacing reads as loose.
        'display-2xl': ['clamp(40px, 7.6vw, 104px)', { lineHeight: '0.9', letterSpacing: '-0.04em' }],
        'display-xl': ['clamp(34px, 5.8vw, 76px)', { lineHeight: '0.94', letterSpacing: '-0.035em' }],
        'display-lg': ['clamp(30px, 4.6vw, 58px)', { lineHeight: '0.98', letterSpacing: '-0.03em' }],
        'display-md': ['clamp(24px, 3.4vw, 42px)', { lineHeight: '1.02', letterSpacing: '-0.025em' }],
        'display-sm': ['clamp(19px, 2.2vw, 26px)', { lineHeight: '1.12', letterSpacing: '-0.02em' }],
      },

      maxWidth: {
        content: '80rem',
        // ~66 characters at the body size — the readable measure.
        prose: '33rem',
      },

      // Square by default. The one exception is the availability dot, which is
      // a circle because it is a status light, not a container.
      borderRadius: {
        none: '0',
      },

      spacing: {
        // 8px base unit, exposed for the places that need it by name.
        unit: '0.5rem',
      },

      zIndex: {
        backdrop: '-10',
        dock: '40',
        header: '50',
        skip: '60',
      },

      animation: {
        'fade-up': 'fadeUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) both',
        'pulse-soft': 'pulseSoft 2.6s ease-in-out infinite',
      },

      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
