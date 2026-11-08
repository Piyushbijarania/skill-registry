import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#09090b', // Deep Obsidian canvas
        surface: {
          DEFAULT: '#121215',
          subtle: '#18181b',
          border: '#27272a',
        },
        brand: {
          50: '#eef2ff',
          500: '#6366f1', // Electric Indigo
          600: '#4f46e5',
        },
      },
      fontFamily: {
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;

