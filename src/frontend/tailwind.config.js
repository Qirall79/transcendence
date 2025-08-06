/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gaming: {
          background: '#0A0B14',
          card: '#141627',
          'card-hover': '#1A1D35',
          accent: '#8B8EF8',
          'accent-hover': '#9EA1FF',
          text: '#E2E4FF',
          'text-muted': '#8E91B5',
          border: '#2A2D4A',
          success: '#4ADE80',
          warning: '#FBBF24',
          error: '#FB7185',
        }
      },
      boxShadow: {
        'neon': '0 0 20px rgba(139, 142, 248, 0.15)',
        'neon-hover': '0 0 30px rgba(139, 142, 248, 0.25)',
        'neon-focus': '0 0 15px rgba(139, 142, 248, 0.35)',
      },
      keyframes: {
        'pulse-slow': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        },
        'glow': {
          '0%, 100%': { 
            'box-shadow': '0 0 20px rgba(139, 142, 248, 0.15)',
            'border-color': 'rgba(139, 142, 248, 0.5)'
          },
          '50%': { 
            'box-shadow': '0 0 30px rgba(139, 142, 248, 0.25)',
            'border-color': 'rgba(139, 142, 248, 0.8)'
          },
        }
      },
      animation: {
        'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}