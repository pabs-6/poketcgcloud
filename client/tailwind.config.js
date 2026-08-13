/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        poke: {
          red: '#EE1515',
          'red-dark': '#CC0000',
          black: '#1A1A1A',
          white: '#FAFAFA',
          gray: {
            100: '#F5F5F5',
            200: '#E5E5E5',
            500: '#737373',
            800: '#262626',
          },
        },
      },
      transitionDuration: {
        DEFAULT: '200ms',
      },
    },
  },
  plugins: [],
};
