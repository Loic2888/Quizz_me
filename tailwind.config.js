/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-orange': '#FF9E0B',
        'dark-bg': '#121212',
        'dark-secondary': '#1E1E1E',
      },
    },
  },
  plugins: [],
}
