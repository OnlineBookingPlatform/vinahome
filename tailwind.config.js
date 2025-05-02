import plugin from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {
      container: {
        center: true,
        padding: "50px",
      },
      screens: {
        "2xl": "1440px",
      },
      colors: {
        foreground: {
          DEFAULT: "hsl(180,4%,5%)",
        },
        primary: {
          DEFAULT: "hsla(200, 100%, 51%, 1)",
        },
        muted: {
          DEFAULT: "hsla(213, 2%, 57%, 1)",
        },
        timeline: {
          DEFAULT: "hsla(216, 2%, 57%, 1)",
        },
        grey: {
          600: "hsla(215, 18%, 34%, 1)",
        },
        warning: {
          DEFAULT: "hsla(12, 100%, 51%, 1)",
        },
      },
      borderColor: {
        DEFAULT: "hsla(213, 29%, 92%, 1)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    plugin(function ({ addBase, addComponents, addUtilities, theme }) {
      addBase({
        h1: {
          fontSize: "68px",
          fontWeight: 700,
        },
        h2: {
          fontSize: "52px",
          fontWeight: 700,
        },
        h3: {
          fontSize: "44px",
          fontWeight: 700,
        },
        h4: {
          fontSize: "36px",
          fontWeight: 700,
        },
        h5: {
          fontSize: "24px",
          fontWeight: 700,
        },
        h6: {
          fontSize: "20px",
          fontWeight: 700,
        },
        label: {
          fontSize: theme("fontSize.sm"),
          fontWeight: theme("fontWeight.semibold"),
          display: "block",
        },
      });
      addUtilities({
        ".button-gradient": {
          background:
            "linear-gradient(90deg, #205AFF -9.84%, #01B0FF 24.16%, #147BFF 72.58%, #02AFFF 105.17%);",
        },
      });
    }),
  ],
};
