/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: 'var(--surface)',
          dim: 'var(--surface-dim)',
          bright: 'var(--surface-bright)',
          container: {
            DEFAULT: 'var(--surface-container)',
            lowest: 'var(--surface-container-lowest)',
            low: 'var(--surface-container-low)',
            high: 'var(--surface-container-high)',
            highest: 'var(--surface-container-highest)',
          },
        },
        'on-surface': {
          DEFAULT: 'var(--on-surface)',
          variant: 'var(--on-surface-variant)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          container: 'var(--primary-container)',
        },
        'on-primary': {
          DEFAULT: 'var(--on-primary)',
          container: 'var(--on-primary-container)',
        },
        secondary: 'var(--secondary)',
        'outline-variant': 'var(--outline-variant)',
        outline: 'var(--outline)',
      },
      fontFamily: {
        myeongjo: ['Nanum Myeongjo', 'serif'],
        gothic: ['Nanum Barun Gothic', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.125rem',
        lg: '0.25rem',
        xl: '0.5rem',
        full: '0.75rem',
      },
    },
  },
  plugins: [],
};
