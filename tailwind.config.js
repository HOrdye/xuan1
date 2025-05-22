/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#5b21b6', // 紫色
        'primary-dark': '#4c1d95',
        'mystic': '#7c3aed', // 神秘深紫色
        'secondary': '#ec4899', // 粉色
        'accent': '#f59e0b', // 金黄色
        'background': '#f8fafc',
        'surface': '#ffffff',
      },
      fontFamily: {
        sans: ['Noto Sans SC', 'sans-serif'],
        serif: ['Ma Shan Zheng', 'serif'],
      },
      boxShadow: {
        mystic: '0 4px 14px 0 rgba(123, 58, 237, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
} 