/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",           // dacă ai index.html în root
    "./src/**/*.{js,ts,jsx,tsx}" // tot ce e în src, inclusiv componente
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
