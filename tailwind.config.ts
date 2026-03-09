import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0f4f8',
          100: '#d9e4f0',
          400: '#4a90e2',
          500: '#3b7dd6',
          600: '#2563c6',
          700: '#1e4ba8',
        },
        dark: '#1a1a2e',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)',
        'gradient-hero': 'linear-gradient(135deg, #5b9ff5 0%, #2d5fa3 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(31, 38, 135, 0.37)',
        'glass-lg': '0 8px 32px rgba(31, 38, 135, 0.5)',
      },
    },
  },
  plugins: [],
};

export default config;
