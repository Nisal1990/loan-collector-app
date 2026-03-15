/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1E2A4A", // Deep navy
        },
        accent: {
          DEFAULT: "#1D9E75", // Green
        },
        warning: {
          DEFAULT: "#F59E0B", // Amber
        },
        danger: {
          DEFAULT: "#EF4444", // Red
        },
        background: {
          DEFAULT: "#F5F6FA", // Light gray
        }
      }
    },
  },
  plugins: [],
}
