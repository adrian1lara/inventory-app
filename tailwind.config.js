/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/*.ejs'],
  theme: {
    extend: {
      colors: {
        primary: 'black',
        secondary: 'white',
      },
    },
  },
  plugins: [

    require('@tailwindcss/forms'),

    {
      tailwindcss: {},
      autoprefixer: {},
    },
  ],
};
