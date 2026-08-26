/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#2D7FF9',
          50: '#EBF3FF',
          100: '#D6E7FF',
          200: '#A8CCFF',
          300: '#7AB1FF',
          400: '#4D96FF',
          500: '#2D7FF9',
          600: '#1F66D4',
          700: '#1A55AE',
        },
        success: '#5BC85B',
        warning: '#FF9A3C',
        danger: '#FF5A5A',
        emerald: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
        },
        rose: {
          50: '#FFF1F2',
          500: '#F43F5E',
          600: '#E11D48',
        },
        amber: {
          50: '#FFFBEB',
          500: '#F59E0B',
          700: '#B45309',
        },
        ink: {
          900: '#1A1A1A',
          700: '#404040',
          500: '#666666',
          400: '#999999',
          300: '#BFBFBF',
          200: '#E5E5E5',
          100: '#F0F2F5',
          50: '#F5F6F8',
        }
      },
      fontFamily: {
        sans: ['"PingFang SC"', '"Microsoft YaHei"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)',
        'app': '0 20px 60px rgba(0,0,0,0.12)',
      },
      borderRadius: {
        'card': '12px',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'scale(0.9)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        fadeOut: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.18s ease-out',
        'fade-out': 'fadeOut 0.2s ease-in',
      }
    },
  },
  plugins: [],
}
