/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Open Sans"', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        mono: ['monospace'],
      },
      colors: {
        background: '#ffffff',
        foreground: '#0f0f0f',
        primary: '#FF4A00',
      }
    },
  },
  plugins: [],
}
