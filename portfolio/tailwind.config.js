/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // "Causal Ink" palette — deep blue-black base
        ink: {
          950: '#070A12', // deepest bg
          900: '#0B1019', // primary bg
          800: '#111827', // surface
          700: '#18202F', // raised surface
          600: '#212B3D', // border
          500: '#2E3A50', // strong border
        },
        paper: {
          50: '#FFFFFF',
          100: '#EEF2F9', // primary fg
          200: '#D6DEEC',
          300: '#A9B4C9', // secondary fg
          400: '#7A869E', // dimmed fg
          500: '#56617A', // muted fg
        },
        // primary accent — the "intervention" colour
        violet: {
          300: '#B6A9FF',
          400: '#9585FF',
          500: '#7C6AFF',
          600: '#6350E6',
          700: '#4C3CC4',
        },
        // secondary accent — the "signal" colour
        amber: {
          300: '#FFD98A',
          400: '#F5B841',
          500: '#EFA820',
          600: '#D08D0D',
        },
        // tertiary accent — used sparingly in aurora / bento gradients
        cyan: {
          300: '#8CE8F5',
          400: '#48D3E8',
          500: '#22B8D1',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans TC', 'system-ui', 'sans-serif'],
        display: ['Instrument Serif', 'Noto Serif TC', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        'display-2xl': ['clamp(46px, 9vw, 124px)', { lineHeight: '0.96', letterSpacing: '-0.035em' }],
        'display-xl': ['clamp(44px, 8vw, 108px)', { lineHeight: '1.02', letterSpacing: '-0.03em' }],
        'display-lg': ['clamp(36px, 6vw, 76px)', { lineHeight: '1.05', letterSpacing: '-0.025em' }],
        'display-md': ['clamp(30px, 4.5vw, 54px)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-sm': ['clamp(24px, 3.5vw, 38px)', { lineHeight: '1.15', letterSpacing: '-0.015em' }],
      },
      maxWidth: {
        content: '76rem',
      },
      borderRadius: {
        bento: '1.5rem',
      },
      boxShadow: {
        // Layered glass: inner top highlight + outer ambient drop.
        glass: '0 1px 0 0 rgba(255,255,255,0.06) inset, 0 16px 48px -16px rgba(0,0,0,0.7)',
        'glass-lifted':
          '0 1px 0 0 rgba(255,255,255,0.10) inset, 0 28px 68px -20px rgba(0,0,0,0.8)',
        glow: '0 0 0 1px rgba(124,106,255,0.28), 0 20px 60px -20px rgba(124,106,255,0.45)',
      },
      animation: {
        'fade-up': 'fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        'pulse-soft': 'pulseSoft 3.2s ease-in-out infinite',
        marquee: 'marquee 42s linear infinite',
        // Reactbits-style decorative motion
        aurora: 'aurora 22s ease-in-out infinite',
        'aurora-slow': 'aurora 34s ease-in-out infinite reverse',
        shimmer: 'shimmer 4.5s linear infinite',
        float: 'float 9s ease-in-out infinite',
        'border-spin': 'borderSpin 6s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(22px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '0.9' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        aurora: {
          '0%, 100%': { transform: 'translate3d(-6%, -4%, 0) scale(1)' },
          '33%': { transform: 'translate3d(8%, 6%, 0) scale(1.18)' },
          '66%': { transform: 'translate3d(-4%, 10%, 0) scale(0.92)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        borderSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
}
