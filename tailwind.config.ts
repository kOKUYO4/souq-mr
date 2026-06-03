import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        sand: {
          50: "#FAF6EF",
          100: "#F5EDD9",
          200: "#EBD9B0",
          300: "#DFBE82",
          400: "#C9A84C",
          500: "#B8922E",
          600: "#9A7822",
          700: "#7A5E1A",
          800: "#5A4513",
          900: "#3C2D0D",
        },
        night: {
          50: "#E8ECF4",
          100: "#C2CCE3",
          200: "#8FA0C7",
          300: "#5C74AB",
          400: "#364E8F",
          500: "#1B2A4A",
          600: "#162340",
          700: "#111B33",
          800: "#0C1426",
          900: "#070D1A",
        },
        islamic: {
          50: "#E8F4EE",
          100: "#C2DECE",
          200: "#8DC2A8",
          300: "#58A682",
          400: "#2D6A4F",
          500: "#235438",
          600: "#1A3F2A",
          700: "#122B1C",
          800: "#0A170E",
          900: "#050C07",
        },
        cream: "#FAF6EF",
      },
      fontFamily: {
        arabic: ["Noto Sans Arabic", "IBM Plex Arabic", "sans-serif"],
        display: ["Playfair Display", "Georgia", "serif"],
        body: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        "desert-gradient":
          "linear-gradient(135deg, #1B2A4A 0%, #2D3E6A 50%, #1B2A4A 100%)",
        "sand-gradient": "linear-gradient(180deg, #FAF6EF 0%, #F5EDD9 100%)",
        "gold-gradient":
          "linear-gradient(135deg, #C9A84C 0%, #E8C96A 50%, #B8922E 100%)",
      },
      boxShadow: {
        gold: "0 4px 24px rgba(201, 168, 76, 0.25)",
        "gold-lg": "0 8px 40px rgba(201, 168, 76, 0.35)",
        card: "0 2px 16px rgba(27, 42, 74, 0.10)",
        "card-hover": "0 8px 32px rgba(27, 42, 74, 0.18)",
        night: "0 4px 32px rgba(11, 20, 38, 0.40)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.4s ease-out forwards",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
