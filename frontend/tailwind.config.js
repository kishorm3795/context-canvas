/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: {
          void: '#08090D',
          surface: '#0D1017',
          card: '#141823',
          border: 'rgba(255, 255, 255, 0.08)',
          hover: 'rgba(255, 255, 255, 0.15)',
        },
        telemetry: {
          cyan: '#00F0FF',
          emerald: '#00FF9D',
          amber: '#FFB800',
          crimson: '#FF3366',
          purple: '#A855F7',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
