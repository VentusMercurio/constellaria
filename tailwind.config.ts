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
        'brand-magenta': '#E6007A',
        'brand-red': '#FF003D',
      },
      backgroundImage: {
        'mystic-gradient': 'linear-gradient(to right, #E6007A, #FF003D)',
        'button-gradient': 'linear-gradient(to right, #E6007A, #FF003D)',
        'button-gradient-hover': 'linear-gradient(to right, #FF003D, #E6007A)',
      },
      // >>> NEW CODE STARTS HERE <<<
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
      // >>> NEW CODE ENDS HERE <<<
    },
  },
  plugins: [],
}
export default config