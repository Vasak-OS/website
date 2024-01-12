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
        vsk1: '#0BC98C',
        vsk2: '#007CC3',
      }
    },
    fontFamily: {
      vsk: ['"VSKRegular"', 'sans-serif'],
    },
  }
}

