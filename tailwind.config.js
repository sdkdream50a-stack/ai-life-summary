/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./life-summary/**/*.html",
    "./age-calculator/**/*.html",
    "./blog/**/*.html",
    "./js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        secondary: '#ec4899',
        accent: '#f59e0b',
        'age-primary': '#10b981',
        'age-secondary': '#06b6d4'
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        quote: ['Merriweather', 'serif']
      }
    }
  },
  plugins: []
}
