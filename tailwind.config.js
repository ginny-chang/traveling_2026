/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#F8F7F4',
        card: '#FFFFFF',
        primary: '#7B9E87',
        accent: '#E8A598',
        ink: '#2D2D2D',
        sub: '#9B9B9B',
        border: '#EEECE8',
        'primary-light': '#EBF2ED',
        'accent-light': '#FDF1EE',
      },
      fontFamily: {
        sans: ['"Noto Sans TC"', 'ui-sans-serif', 'system-ui'],
        heading: ['"DM Sans"', '"Noto Sans TC"', 'ui-sans-serif'],
      },
      borderRadius: {
        'card': '16px',
        'badge': '12px',
      },
      boxShadow: {
        'card': '0 2px 12px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 20px rgba(0,0,0,0.10)',
      },
    },
  },
  plugins: [],
}
