/** @type {import('tailwindcss').Config */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      poppins: ['Poppins', 'sans-serif'],
      'space-grotesk': ['Space Grotesk', 'sans-serif']
    },
    extend: {}
  },
  plugins: []
};