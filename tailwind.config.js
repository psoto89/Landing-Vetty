/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./thank-you.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#215c9e",
        "accent": "#f5683d",
        "secondary": "#dcb0cb",
        "background-light": "#feeae1",
        "navy": "#215c9e"
      },
      fontFamily: {
        "display": ["Manrope", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}
