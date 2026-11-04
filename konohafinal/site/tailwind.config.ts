import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#07040d',
        ink: '#0d0818',
        plum: '#1a0f2e',
        violet: { DEFAULT: '#8b3dff', deep: '#5b16d6' },
        neon: '#c77dff',
        lilac: '#e0b3ff',
        cyan: '#5ef2ff',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      boxShadow: {
        neon: '0 0 0 1px rgba(199,125,255,.45), 0 0 28px rgba(139,61,255,.45)',
      },
    },
  },
  plugins: [],
};
export default config;
