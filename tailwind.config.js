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
        tajawal: ['var(--font-tajawal)', 'Tajawal', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
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
        surface: {
          DEFAULT: '#EEF3F9',
          card: '#FFFFFF',
          border: '#E2E8F0',
        },
        accent: {
          DEFAULT: '#3D8BFF',
          hover: '#5AA0FF',
          dark: '#2B6FCC',
          emerald: '#2ECC71',
          rose: '#E74C6F',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#A8B4D6',
        },
        'text-dark': {
          heading: '#0F1A3E',
          body: '#3D4F6F',
          muted: '#5C6B8A',
        },
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
