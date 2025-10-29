/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
      },
      textShadow: {
        DEFAULT: '0 2px 4px rgba(0,0,0,0.4)',
        lg: '0 4px 10px rgba(0,0,0,0.5)',
      },
      boxShadow: {
        'glow-teal': '0 4px 20px 0 rgba(13, 148, 136, 0.4)',
        'glow-white': '0 4px 20px 0 rgba(220, 220, 220, 0.4)',
      },
      // RESTORED: Ken Burns animation for the background
      animation: {
        'ken-burns': 'ken-burns 20s ease-out infinite',
      },
      keyframes: {
        'ken-burns': {
          '0%': { transform: 'scale(1) translate(0, 0)' },
          '50%': { transform: 'scale(1.1) translate(-2%, 2%)' },
          '100%': { transform: 'scale(1) translate(0, 0)' },
        }
      }
    },
  },
  plugins: [
    plugin(function({ matchUtilities, theme }) {
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') }
      )
    }),
  ],
}