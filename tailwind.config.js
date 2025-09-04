/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'car-black': '#0a0a0a',
        'car-gray': '#1a1a1a',
        'car-light-gray': '#2a2a2a',
        'car-accent': '#f5f5f5',
        border: ' #e5e7eb',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
