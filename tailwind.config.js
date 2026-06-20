/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        tajawal: ['Tajawal', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        primary: {
          DEFAULT: '#0B1430',
          dark: '#070E22',
        },
        card: {
          DEFAULT: '#16234A',
          border: '#2A3A6B',
        },
        accent: {
          DEFAULT: '#3D8BFF',
          hover: '#5AA0FF',
          emerald: '#2ECC71',
          rose: '#E74C6F',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#A8B4D6',
        },
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
