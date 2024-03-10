/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./assets/**/*.{js,jsx,ts,tsx}",
    "./templates/**/*.html.twig",
  ],
  theme: {
    extend: {
      screens: {
        'qhd': '1864px'
      },
      spacing: {
        '6.5': '1.625rem',
        '8.5': '2.25rem'
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

