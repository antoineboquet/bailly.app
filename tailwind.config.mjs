import defaultTheme from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "selector",
  future: {
    hoverOnlyWhenSupported: true
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant("hover-hover", "@media (hover: hover)");
    })
  ],
  safelist: [
    {
      // Cf. .src/helpers.ts > getColorClasses().
      pattern:
        /(fill|text)-(blue|green|lime|orange|purple|red|rose|slate|teal)-(400|600)$/,
      variants: [
        "active",
        "dark",
        "focus",
        "hover",
        "dark:active",
        "dark:focus",
        "dark:hover"
      ]
    }
  ],
  theme: {
    fontFamily: {
      sans: ["Inter", ...defaultTheme.fontFamily.sans, "IFAOGrec"],
      serif: ["Brill", "IFAOGrec", ...defaultTheme.fontFamily.serif]
    },
    transitionProperty: {
      ...defaultTheme.transitionProperty,
      DEFAULT: (defaultTheme.transitionProperty.DEFAULT += ", visibility")
    },
    extend: {
      animation: {
        decline: "decline .25s ease-in",
        rise: "rise .25s ease-out",
        shake: "shake .5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both"
      },
      keyframes: {
        decline: {
          "0%": {
            transform: "translateY(0)",
            opacity: 1
          },
          "66%": {
            opacity: 0
          },
          "100%": {
            transform: "translateY(.5rem)"
          }
        },
        rise: {
          "0%": {
            transform: "translateY(.5rem)",
            opacity: 0
          },
          "33%": {
            opacity: 1
          },
          "100%": {
            transform: "translateY(0)"
          }
        },
        shake: {
          "10%, 90%": {
            transform: "translate3d(-2px, 0, 0)"
          },
          "20%, 80%": {
            transform: "translate3d(2px, 0, 0)"
          },
          "30%, 50%, 70%": {
            transform: "translate3d(-3px, 0, 0)"
          },
          "40%, 60%": {
            transform: "translate3d(3px, 0, 0)"
          }
        }
      },
      colors: {
        primary: {
          50: "#fef9ec",
          100: "#fbedca",
          200: "#f9e2a6",
          300: "#f4c355",
          400: "#f1ab2e",
          500: "#ea8b16",
          600: "#cf6710",
          700: "#ac4811",
          800: "#8c3914",
          900: "#732f14",
          950: "#421606"
        },
        secondary: {
          50: "#f8f7f4",
          100: "#efede5",
          200: "#ddd9cb",
          300: "#c8bfa9",
          400: "#b4a68b",
          500: "#a18e6e",
          600: "#947d62",
          700: "#7b6753",
          800: "#655447",
          900: "#53463b",
          950: "#2c241e"
        }
      }
    }
  }
};
