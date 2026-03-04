/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          light: "#e6efe2",
          DEFAULT: "#7eab76",
          dark: "#4b7347",
        },
        herbal: {
          50: "#f5f8f4",
          100: "#e6efe2",
          200: "#c8ddc0",
          300: "#a2c49a",
          400: "#7eab76",
          500: "#5f8f5a",
          600: "#4b7347",
          700: "#385737",
          800: "#2a3f28",
          900: "#1f2d1d",
        },
        beige: {
          50: "#fbf8f2",
          100: "#f4eddc",
          200: "#e8d9b8",
          300: "#d8c086",
          400: "#c7a55f",
          500: "#b38b43",
        },
        clay: {
          100: "#f3ece4",
          200: "#e5d8c8",
          300: "#d1bfa9",
          400: "#b59c7c",
        },
      },
      boxShadow: {
        soft: "0 10px 30px rgba(31, 45, 29, 0.12)",
        lift: "0 16px 40px rgba(31, 45, 29, 0.16)",
        glow: "0 0 20px rgba(126, 171, 118, 0.3)",
        "glow-lg": "0 0 30px rgba(126, 171, 118, 0.4)",
        inner: "inset 0 2px 4px rgba(0, 0, 0, 0.06)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      fontFamily: {
        sans: ["Trebuchet MS", "Gill Sans", "Calibri", "Verdana", "sans-serif"],
        serif: ["Palatino Linotype", "Book Antiqua", "Palatino", "Georgia", "serif"],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}

