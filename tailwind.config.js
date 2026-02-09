/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ocean: {
          900: '#0a192f', // Deepest blue
          800: '#112240', // Deep blue
          700: '#233554', // Light navy
          600: '#324a6b', // Lighter navy
          light: '#64ffda', // Neon cyan/teal
        },
        neon: {
          cyan: '#64ffda',
          blue: '#57cbff',
          purple: '#bd93f9',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(100, 255, 218, 0.4)' },
          '50%': { opacity: '.5', boxShadow: '0 0 10px rgba(100, 255, 218, 0.2)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        }
      },
    },
  },
  plugins: [],
};
