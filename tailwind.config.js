/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FF131D",  // Red — buttons, active elements
          50: "#FFF1F2",       // Very light red tint
          100: "#FFE4E6",      // Light red tint
          200: "#FECDD3",      // Soft red
          800: "#9F1239",      // Deep red
          900: "#881337",      // Deepest red
        },
        dark: {
          DEFAULT: "#020E28",  // Navy — text headings, dark BGs
          50: "#E8EDF5",       // Light navy wash
          100: "#C9D3E5",      // Lighter navy
          700: "#081D4A",      // Mid dark navy
          800: "#05153A",      // Dark navy
          900: "#030B1E",      // Darkest navy
        },
        accent: {
          DEFAULT: "#10B981",  // Emerald green — success, money
        },
        warning: {
          DEFAULT: "#F59E0B",  // Amber
        },
        danger: {
          DEFAULT: "#EF4444",  // Red (danger/error, different shade from primary)
        },
        background: {
          DEFAULT: "#F8F8F8",  // Light gray background
        }
      }
    },
  },
  plugins: [],
}
