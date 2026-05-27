/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: '#F0F4FF',
        card: 'rgba(255,255,255,0.85)',
        primary: '#4F7EF7',
        'primary-dark': '#3B5FD4',
        accent: '#F472B6',
        ink: '#0F172A',
        sub: '#64748B',
        border: 'rgba(255,255,255,0.6)',
        'primary-light': '#EEF3FF',
        'accent-light': '#FDF2F8',
        glass: 'rgba(255,255,255,0.75)',
      },
      fontFamily: {
        sans: ['"Noto Sans KR"', '"Noto Sans TC"', 'ui-sans-serif', 'system-ui'],
        heading: ['"DM Sans"', '"Noto Sans KR"', 'ui-sans-serif'],
      },
      borderRadius: {
        card: '20px',
        badge: '10px',
        pill: '999px',
      },
      boxShadow: {
        card: '0 4px 24px rgba(79,126,247,0.08), 0 1px 4px rgba(0,0,0,0.04)',
        'card-hover': '0 8px 32px rgba(79,126,247,0.15)',
        glass: '0 8px 32px rgba(31,38,135,0.1)',
        nav: '0 8px 32px rgba(15,23,42,0.12), 0 2px 8px rgba(0,0,0,0.06)',
      },
      backdropBlur: {
        xs: '4px',
      },
    },
  },
  plugins: [],
}
