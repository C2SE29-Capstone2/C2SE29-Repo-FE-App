/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}" , "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#5AD0E0',
        secondary: '#5FD3EF',
        light: {
          100: '#5FD3EF',
          200: '#0D52DE',
          300: '#73DAD4'
        },
        dark: {
          100: '#000000',
          200: '#333333',
          300: '#788186',
        },
        accent: '#87CEEB'
      }
    },
  },
  plugins: [],
}