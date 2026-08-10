/** @type {import('tailwindcss').Config} */

/**
 * Every colour resolves through a CSS custom property rather than a literal,
 * so one `data-theme` flip on `<html>` re-tints the whole page without a second
 * set of utilities. The channel triples live in `src/style.css`; this file only
 * names them.
 *
 * The names are semantic, not hue-based — `accent` rather than `violet` — so a
 * future palette change is a variable edit, not a find-and-replace across 40
 * components.
 */
const themed = (name) => `rgb(var(--${name}) / <alpha-value>)`

export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // ---- Ground ---------------------------------------------------------
        // `page` is the body; `sunk` is the recessed band used to separate
        // sections without jumping to a different lightness family.
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

        // ---- Foreground -----------------------------------------------------
        // Three steps only. A longer ramp invites picking the wrong one; these
        // each clear 4.5:1 on `page` in both themes.
        fg: {
          DEFAULT: themed('fg'),
          muted: themed('fg-muted'),
          faint: themed('fg-faint'),
        },

        // ---- Accent ---------------------------------------------------------
        // One accent, full stop. `on` is the text colour that sits on top of a
        // filled accent surface.
        accent: {
          DEFAULT: themed('accent'),
          soft: themed('accent-soft'),
          on: themed('accent-on'),
        },

        // ---- Data ----------------------------------------------------------
        // Reserved for chart series, where a single hue can't encode two
        // categories. Never used for interface chrome.
        data: {
          1: themed('accent'),
          2: themed('data-2'),
          3: themed('data-3'),
        },
      },

      fontFamily: {
        // Geist over Inter: same neutral-grotesque job, but with a real
        // personality in the `a`, `g` and `t` terminals instead of the
        // house-style-of-everything Inter has become.
        sans: ['Geist', 'Noto Sans TC', 'system-ui', 'sans-serif'],
        // Fraunces is a variable serif with an optical-size axis, so display
        // sizes get genuinely different letterforms rather than a scaled-up
        // text face.
        display: ['Fraunces', 'Noto Serif TC', 'Georgia', 'serif'],
        mono: ['Geist Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },

      fontSize: {
        'display-2xl': ['clamp(46px, 8.4vw, 120px)', { lineHeight: '0.94', letterSpacing: '-0.035em' }],
        'display-xl': ['clamp(40px, 6.6vw, 88px)', { lineHeight: '0.98', letterSpacing: '-0.032em' }],
        'display-lg': ['clamp(34px, 5.4vw, 68px)', { lineHeight: '1.02', letterSpacing: '-0.028em' }],
        'display-md': ['clamp(28px, 4vw, 50px)', { lineHeight: '1.06', letterSpacing: '-0.022em' }],
        'display-sm': ['clamp(22px, 2.8vw, 32px)', { lineHeight: '1.14', letterSpacing: '-0.016em' }],
      },

      maxWidth: {
        content: '78rem',
        // Roughly 68 characters at the body size — the readable measure.
        prose: '34rem',
      },

      borderRadius: {
        // Editorial, not pill-shaped: containers get a modest radius and inner
        // elements get less, so the nesting reads as printed panels.
        panel: '0.75rem',
        inner: '0.375rem',
      },

      boxShadow: {
        // Tinted with the page's warm hue instead of neutral black, so shadows
        // sit in the same light as everything else.
        panel: '0 1px 2px rgb(var(--shadow) / 0.05), 0 8px 24px -12px rgb(var(--shadow) / 0.16)',
        lifted: '0 2px 4px rgb(var(--shadow) / 0.06), 0 20px 44px -18px rgb(var(--shadow) / 0.26)',
        float: '0 4px 10px rgb(var(--shadow) / 0.08), 0 28px 60px -22px rgb(var(--shadow) / 0.34)',
      },

      zIndex: {
        backdrop: '-10',
        dock: '40',
        header: '50',
        skip: '60',
      },

      animation: {
        'fade-up': 'fadeUp 0.75s cubic-bezier(0.22, 1, 0.36, 1) both',
        'pulse-soft': 'pulseSoft 3.2s ease-in-out infinite',
        drift: 'drift 26s ease-in-out infinite',
        'drift-slow': 'drift 38s ease-in-out infinite reverse',
        float: 'float 9s ease-in-out infinite',
      },

      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '0.9' },
        },
        // Replaces the old `aurora` loop: smaller travel, no scaling, so the
        // fields read as ambient light rather than as moving blobs.
        drift: {
          '0%, 100%': { transform: 'translate3d(-3%, -2%, 0)' },
          '50%': { transform: 'translate3d(4%, 3%, 0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
}
