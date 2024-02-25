/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        downriver: {
          '50': '#e9f8ff',
          '100': '#ceefff',
          '200': '#a7e5ff',
          '300': '#6bd9ff',
          '400': '#26c0ff',
          '500': '#0097ff',
          '600': '#006dff',
          '700': '#0052ff',
          '800': '#0045e6',
          '900': '#0041b3',
          '950': '#002157',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
