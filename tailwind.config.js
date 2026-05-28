/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: '#FFFFFF',
        ink: '#0A0A0A',
        sub: '#6B7280',
        muted: '#9CA3AF',
        border: '#E5E7EB',
        'border-strong': '#0A0A0A',
        surface: '#F9FAFB',
        'surface-2': '#F3F4F6',
      },
      fontFamily: {
        sans: ['"Public Sans"', '"DM Sans"', '"Noto Sans TC"', 'ui-sans-serif', 'system-ui'],
        heading: ['"DM Sans"', '"Public Sans"', 'ui-sans-serif'],
        mono: ['"Courier New"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        card: '12px',
        badge: '6px',
        pill: '999px',
        window: '45%',
      },
      fontSize: {
        '2xs': ['10px', { lineHeight: '14px' }],
      },
      letterSpacing: {
        widest: '0.2em',
      },
    },
  },
  plugins: [],
}
