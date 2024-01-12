/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './themes/vasakos/**/*.html',
    './themes/vasakos/**/*.js',
  ],
  theme: {
    fontFamily: {
      sans: ['Poppins', 'sans-serif'],
    },
    extend: {
      colors: {
        vsk1: '#0bc98c',
        vsk2: '#d9de48',
      }
    },
    fontFamily: {
      vsk: ['"VSKRegular"', 'sans-serif'],
    },
  }
}

