/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        vesta: {
          cream: '#FAF8F5',
          warm: '#F3EDE7',
          charcoal: '#2C2C2C',
          bronze: '#B8945A',
          'bronze-light': '#D4B87A',
          sage: '#8B9D83',
          'sage-light': '#C5D1BF',
          muted: '#9A9590',
          border: '#E5DFD8',
        }
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
