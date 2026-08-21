/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#FAF7F2',
          200: '#F5EFEB',
          300: '#EFE6DE',
          400: '#E4D7CA',
          500: '#D5C4B4',
        },
        chocolate: {
          50: '#F7F3F0',
          100: '#ECE3DE',
          200: '#D8C6BD',
          300: '#B6998B',
          400: '#7E5B4B',
          500: '#523427',
          600: '#3E251A',
          700: '#2F1B12',
          800: '#24140D',
          900: '#1A0D08',
        },
        gold: {
          50: '#FAF6EE',
          100: '#F3EADB',
          200: '#E7D5B8',
          300: '#DABF95',
          400: '#C5A880',
          500: '#B38E5D',
          600: '#9C7546',
          700: '#7D5C32',
          800: '#634725',
          900: '#4D361B',
        },
        beige: {
          50: '#FAF8F5',
          100: '#F5EFEB',
          200: '#EAE1D5',
          300: '#DDD2C3',
          400: '#C8B9A5',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Playfair Display"', 'Cinzel', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(41, 24, 17, 0.05)',
        'card': '0 10px 30px -4px rgba(41, 24, 17, 0.08)',
        'luxury': '0 20px 40px -15px rgba(179, 142, 93, 0.15)',
        'gold-glow': '0 0 25px rgba(197, 168, 128, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 3s infinite ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
      },
    },
  },
  plugins: [],
};
