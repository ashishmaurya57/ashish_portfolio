/** @type {import('tailwindcss').Config} */
// Styling is driven by styled-components + the tokens in src/utils/Themes.js.
// This config mirrors those tokens so any utility class used stays on-palette.
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: "#05070D",
        surface: "#0B111C",
        card: "#0F1724",
        line: "#1D2839",
        accent: {
          DEFAULT: "#4D8DFF",
          soft: "#7BAAFF",
          cyan: "#22D3EE",
        },
        content: {
          primary: "#E9EEF7",
          secondary: "#9AA9BF",
          muted: "#64748B",
        },
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        sans: ["DM Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        xl: "18px",
        "2xl": "26px",
      },
    },
  },
  plugins: [],
};
