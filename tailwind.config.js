/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html"], // <-- adjust to your HTML files
  theme: {
    extend: {
      colors: {
        brandBlue: '#183862', // your custom blue
        brandGreen: '#9cc943',
        brandGray: '#f2f5f8',
      },
    },
  },
  plugins: [],
}
