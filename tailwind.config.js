/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          base: '#05070B',
          surface: '#0B111B',
          elevated: '#121B2A',
          border: '#1E2D44',
          borderHover: '#2A3F60',
        },
        emerald: {
          felt: '#04231A',
          base: '#0A4434',
          vibrant: '#10B981',
          neon: '#34D399',
          glow: 'rgba(16, 185, 129, 0.35)',
        },
        gold: {
          light: '#FEF08A',
          primary: '#FBBF24',
          deep: '#D97706',
          dark: '#78350F',
          glow: 'rgba(251, 191, 36, 0.4)',
        },
        neon: {
          cyan: '#06B6D4',
          crimson: '#EF4444',
          purple: '#A855F7',
          amber: '#F59E0B',
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #FEF08A 0%, #FBBF24 50%, #B45309 100%)',
        'emerald-gradient': 'linear-gradient(135deg, #0A4434 0%, #04231A 100%)',
        'dark-gradient': 'linear-gradient(180deg, #0B111B 0%, #05070B 100%)',
        'glow-radial': 'radial-gradient(circle, rgba(251, 191, 36, 0.15) 0%, transparent 70%)',
      },
      animation: {
        'glow-pulse': 'glowPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 15px rgba(251, 191, 36, 0.6))' },
          '50%': { opacity: '0.6', filter: 'drop-shadow(0 0 5px rgba(251, 191, 36, 0.2))' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
};
