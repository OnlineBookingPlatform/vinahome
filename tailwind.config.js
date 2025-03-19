import plugin from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: "16px",
          md: "50px",
          "2xl": "150px",
        },
      },
      screens: {
        "2xl": "1440px",
      },
      colors: {
        foreground: {
          DEFAULT: "hsla(239, 100%, 10%, 1)",
        },
        primary: {
          DEFAULT: "hsla(200, 100%, 51%, 1)",
          200: "hsla(199, 100%, 94%, 1)",
          600: "hsl(204, 82%, 40%)",
        },
        stroke: {
          DEFAULT: "hsl(213, 29%, 92%)",
        },
        muted: {
          DEFAULT: "hsla(213, 2%, 57%, 1)",
        },
      },
    },
  },
  plugins: [
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

      addComponents({
        ".span-gradient": {
          background:
            "linear-gradient(90deg,  #01B0FF -20%, #147BFF 90%, #02AFFF 105.17%)",
        },
      });
    }),
  ],
};
