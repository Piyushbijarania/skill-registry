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
          DEFAULT: '#111115',
          subtle: '#18181b',
          border: '#27272a',
        },
        brand: {
          50: '#f0f9ff',
          400: '#38bdf8', // Sky Blue
          500: '#0ea5e9', // Electric Cyan
          600: '#0284c7',
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
