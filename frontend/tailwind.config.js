/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: '#FDFBF7',
          100: '#F5EBE1',
          200: '#EAD2AC',
          300: '#D4A373',
          400: '#B07D4F',
          500: '#8B5A2B',
          600: '#6F4227',
          700: '#543322',
          800: '#3D2317',
          900: '#2C1810',
          950: '#1B0E09',
        },
        cream: '#FFFDF9',
        gold: '#D4A373',
        espresso: '#1B0E09',
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      boxShadow: {
        'coffee-glow': '0 10px 30px -10px rgba(111, 66, 39, 0.3)',
        'gold-glow': '0 10px 30px -10px rgba(212, 163, 115, 0.4)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
