/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#005C55',
          container: '#0F766E',
          dark: '#00443E',
          light: '#0D9488',
          fixed: '#9CF2E8',
        },
        'on-primary': {
          DEFAULT: '#FFFFFF',
          container: '#A3FAEF',
        },
        secondary: {
          DEFAULT: '#006A61',
          container: '#86F2E4',
          fixed: '#89F5E7',
        },
        surface: {
          DEFAULT: '#F8F9FF',
          bright: '#F8F9FF',
          dim: '#CBDBF5',
          container: '#E5EEFF',
          'container-lowest': '#FFFFFF',
          'container-low': '#EFF4FF',
          'container-high': '#DCE9FF',
          'container-highest': '#D3E4FE',
        },
        'on-surface': {
          DEFAULT: '#0B1C30',
          variant: '#3E4947',
        },
        outline: {
          DEFAULT: '#6E7977',
          variant: '#BDC9C6',
        },
        marketplace: {
          shopee: '#EE4D2D',
          'shopee-hover': '#D7381B',
          tokopedia: '#03AC0E',
          'tokopedia-hover': '#028C0B',
          tiktok: '#111827',
        },
      },
      fontFamily: {
        headline: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'elevation-1': '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)',
        'elevation-2': '0 10px 15px -3px rgba(15, 118, 110, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04)',
        'elevation-3': '0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.06)',
      },
      borderRadius: {
        'card': '0.75rem', // 12px
        'panel': '1rem',   // 16px
      }
    },
  },
  plugins: [],
};
