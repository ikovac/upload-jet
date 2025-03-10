/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./components/**/*.vue', './layouts/**/*.vue', './pages/**/*.vue'],
  theme: {
    extend: {}
  },
  plugins: [],
  build: {
    postcss: {
      postcssOptions: {
        plugins: {
          tailwindcss: {},
          autoprefixer: {}
        }
      }
    }
  }
};
