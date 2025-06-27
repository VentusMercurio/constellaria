// tailwind.config.ts

import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
        serif: ['var(--font-cormorant-garamond)'],
      },
colors: {
  'brand-white': '#FFFFFF',
  'brand-gold-light': '#FFECB3',  // pale gold highlight
  'brand-gold': '#FFD700',        // true gold
  'brand-gold-deep': '#B8860B',   // deeper antique gold
},      backgroundImage: {
        'mystic-gradient': 'linear-gradient(to right, #FFFFFF, #FFECB3, #FFECB3)',
        'button-gradient': 'linear-gradient(to right, #FF003D,rgb(118, 14, 203))',
        'button-gradient-hover': 'linear-gradient(to right, #FF003D, #E6007A)',

        // --- ENSURE THESE LINES ARE EXACTLY CORRECT ---
        // Double-check single vs double quotes, slashes, and filename
        'bg-splash': "url('/images/backgrounds/splash-bg.png')",
        'bg-antechamber': "url('/images/backgrounds/antechamber-bg.jpg')",
        'bg-natal-chart': "url('/images/backgrounds/natal-chart-bg.jpg')",
        'bg-dashboard': "url('/images/backgrounds/dashboard-bg.jpg')",
        'bg-tarot-draw': "url('/images/backgrounds/tarot-draw-bg.jpg')",
        // --- END CUSTOM BACKGROUNDS ---
      },
      keyframes: {
        shimmer: {
          '0%': { 'background-position': '-200% 0' },
          '100%': { 'background-position': '200% 0' },
        },
      },
      animation: {
        shimmer: 'shimmer 10s infinite linear',
      },
      backgroundSize: {
        '200%': '200% 100%',
      },
    },
  },
  plugins: [],
}
export default config