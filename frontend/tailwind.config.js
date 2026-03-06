/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#0d9488',
          hover: '#0f766e',
          light: '#ccfbf1',
          muted: '#99f6e4',
        },
        secondary: {
          DEFAULT: '#0891b2',
          hover: '#0e7490',
          light: '#cffafe',
        },
        background: '#f0fdfa',
        surface: '#ffffff',
        muted: '#64748b',
      },
      boxShadow: {
        soft: '0 2px 8px -2px rgba(13, 148, 136, 0.08), 0 4px 16px -4px rgba(0, 0, 0, 0.06)',
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 6px 16px -4px rgba(0, 0, 0, 0.04)',
        cardHover: '0 4px 12px -2px rgba(13, 148, 136, 0.1), 0 8px 24px -4px rgba(0, 0, 0, 0.06)',
        sidebar: '4px 0 24px -4px rgba(0, 0, 0, 0.04)',
        navbar: '0 1px 0 0 rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
      spacing: {
        sidebar: '260px',
        '18': '4.5rem',
        '22': '5.5rem',
      },
    },
  },
  plugins: [],
};
