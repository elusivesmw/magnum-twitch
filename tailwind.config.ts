import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontSize: {
      'xs': '1.2rem',
      sm: '1.3rem',
      base: '1.4rem',
      lg: '1.6rem',
      xl: '1.8.rem',
    },
    extend: {
      colors: {
        'noplayer': 'var(--background-rgb)',
        'sidepanel': 'rgb(31,31,35)',
        'sidepanelhover': 'rgb(38,38,44)',
        'chatpanel': 'rgb(24,24,27)',
        'twborder': 'rgba(83, 83, 95, 0.48)',
        'twtext': 'var(--foreground-rgb)',
        'twfadedtext': '#adadb8'
      },
    },
  },
  plugins: [],
}
export default config
