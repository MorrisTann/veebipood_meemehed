module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,css}",
    "./src/index.css"
  ],
  theme: {
    extend: {
      colors: {
        'base': '#f7fafc',
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      textAlign: {
        justify: 'justify',
      },
    },
  },
  plugins: [],
}
