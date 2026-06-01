/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        card: 'var(--card)',
        'card-soft': 'var(--card-soft)',
        divider: 'var(--divider)',
        'divider-strong': 'var(--divider-strong)',

        ink: 'var(--text)',
        'ink-2': 'var(--text-2)',
        'ink-3': 'var(--text-3)',

        mint: 'var(--mint)',
        'mint-deep': 'var(--mint-deep)',
        'mint-soft': 'var(--mint-soft)',
        'mint-line': 'var(--mint-line)',

        coral: 'var(--coral)',
        'coral-deep': 'var(--coral-deep)',
        'coral-soft': 'var(--coral-soft)',

        gold: 'var(--gold)',
        'gold-deep': 'var(--gold-deep)',
        'gold-bg': 'var(--gold-bg)',
        'gold-soft': 'var(--gold-soft)',

        blue: 'var(--blue)',
        purple: 'var(--purple)',

        common: 'var(--common)',
        'common-bg': 'var(--common-bg)',
        rare: 'var(--rare)',
        'rare-bg': 'var(--rare-bg)',
        epic: 'var(--epic)',
        'epic-bg': 'var(--epic-bg)',
        big: 'var(--big)',
        'big-bg': 'var(--big-bg)',
      },
      borderRadius: {
        card: 'var(--r-card)',
        'card-lg': 'var(--r-card-lg)',
        pill: 'var(--r-pill)',
        chip: 'var(--r-chip)',
      },
      fontFamily: {
        sans: ['Pretendard Variable', 'Pretendard', '-apple-system', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        pop: 'var(--shadow-pop)',
      },
      keyframes: {
        spinBox: { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } },
        popIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '60%': { transform: 'scale(1.04)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        pulseBig: {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(250,199,117,0.45)' },
          '50%': { boxShadow: '0 0 0 18px rgba(250,199,117,0)' },
        },
        floatY: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
        riseUp: { from: { transform: 'translateY(14px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
      },
      animation: {
        spinBox: 'spinBox 1.15s cubic-bezier(.4,0,.2,1)',
        popIn: 'popIn .4s',
        fadeIn: 'fadeIn .2s ease',
        pulseBig: 'pulseBig 1.8s ease-in-out infinite',
        floatY: 'floatY 3.4s ease-in-out infinite',
        riseUp: 'riseUp .4s ease',
      },
    },
  },
  plugins: [],
};
