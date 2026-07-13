import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#05a0c7",
        "primary-light": "#09d1c7",
        "primary-lighter": "#c9fef6",
        secondary: "#ff6567",
        "secondary-light": "#ffc486",
        grey: "#8996a7",
        "grey-light": "#f6f7f9",
        dark: "#23272e",
        info: "#cff7fe",
        // Tons sombres issus des maquettes (sections héro/CTA sombres).
        navy: "#122347",
        "navy-deep": "#0b1834",
        "navy-card": "#1a2c52",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
        outfit: ["Outfit", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        caveat: ["Caveat", "cursive"],
      },
      screens: {
        xs: "400px",
      },
      animation: {
        "text-slide": "text-slide 15s cubic-bezier(0.83, 0, 0.17, 1) infinite",
        "slide-vertical": "slide-vertical 15s ease-in-out infinite forwards",
        "marquee-vertical": "marquee-vertical var(--duration) linear infinite",
      },
      keyframes: {
        "text-slide": {
          "0%, 13%": { transform: "translateY(0)" },
          "17%, 30%": { transform: "translateY(-16.66%)" },
          "34%, 47%": { transform: "translateY(-33.33%)" },
          "51%, 64%": { transform: "translateY(-50%)" },
          "68%, 81%": { transform: "translateY(-66.66%)" },
          "85%, 98%": { transform: "translateY(-83.33%)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-vertical": {
          "0%, 20%": { transform: "translateY(0)" },
          "25%, 45%": { transform: "translateY(-100%)" },
          "50%, 70%": { transform: "translateY(-200%)" },
          "75%, 95%": { transform: "translateY(-300%)" },
          "100%": { transform: "translateY(-400%)" },
        },
        "marquee-vertical": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(calc(-100% - var(--gap)))" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
