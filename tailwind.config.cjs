const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        animateBg: {
          '0%': { backgroundPosition: ' 0 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: ' 0 50%' },
        },
      },
      animation: {
        bg: 'animateBg 7s ease infinite',
      },
    },
    fontFamily: {
      heading: ['Monument', 'ui-sans-serif', 'system-ui'],
    },
  },
  plugins: [],
};
