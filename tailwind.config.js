/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F05A28',
        'primary-dark': '#D9480F',
        success: '#2F5233',
        warning: '#FFC107',
        danger: '#D32F2F',
        gray: {
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#dee2e6',
          300: '#ced4da',
          400: '#adb5bd',
          500: '#6c757d',
          600: '#495057',
          700: '#343a40',
          800: '#212529',
          900: '#333333',
        }
      },
      fontFamily: {
        title: ['Montserrat', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': 'clamp(0.7rem, 1.5vw, 0.75rem)',
        'sm': 'clamp(0.8rem, 2vw, 0.875rem)',
        'base': 'clamp(0.9rem, 2.5vw, 1rem)',
        'lg': 'clamp(1rem, 3vw, 1.125rem)',
        'xl': 'clamp(1.125rem, 3.5vw, 1.25rem)',
        '2xl': 'clamp(1.25rem, 4vw, 1.5rem)',
        '3xl': 'clamp(1.5rem, 5vw, 1.875rem)',
      },
      spacing: {
        '1': 'clamp(0.25rem, 1vw, 0.375rem)',
        '2': 'clamp(0.5rem, 1.5vw, 0.5rem)',
        '3': 'clamp(0.75rem, 2vw, 0.875rem)',
        '4': 'clamp(1rem, 2.5vw, 1rem)',
        '5': 'clamp(1.25rem, 3vw, 1.25rem)',
        '6': 'clamp(1.5rem, 3.5vw, 1.5rem)',
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        'lg': '0.75rem',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0,0,0,0.05)',
        DEFAULT: '0 4px 12px rgba(0,0,0,0.1)',
        'lg': '0 10px 25px rgba(0,0,0,0.15)',
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        slideIn: {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}