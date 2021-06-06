const colors = require("tailwindcss/colors");

const prefix = "colors";
const generateColorShades = name =>
  Array.from({ length: 9 })
    .map((_, i) => (i + 1) * 100)
    .reduce(
      (acc, k) => ({
        ...acc,
        [k]: `var(--${prefix}-${name}-${k})`,
      }),
      {},
    );

const customColors = {
  foreground: `var(--${prefix}-foreground)`,
  background: `var(--${prefix}-background)`,
  secondaryBg: `var(--${prefix}-secondaryBg)`,
  gray: generateColorShades("gray"),
  pink: generateColorShades("pink"),
  blue: generateColorShades("blue"),
  yellow: generateColorShades("yellow"),
  green: generateColorShades("green"),
  red: generateColorShades("red"),
};

const fontStack = [
  "Inter",
  "BlinkMacSystemFont",
  "Segoe UI",
  "Roboto",
  "Oxygen-Sans",
  "Ubuntu",
  "Cantarell",
  "Helvetica Neue",
  "sans-serif",
  "Apple Color Emoji",
  "Segoe UI Emoji",
  "Segoe UI Symbol",
].join(",");

module.exports = {
  purge: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // 'media' or 'class'
  theme: {
    fontFamily: {
      sans: fontStack,
      mono: "'Fira Mono', 'Courier New', Courier, monospace",
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: colors.black,
      white: colors.white,
      ...customColors,
    },
    extend: {
      minWidth: {
        sidebar: "250px",
        pageNav: "200px",
        "70vw": "70vw",
        "80vw": "80vw",
        "90vw": "90vw",
        "100vw": "100vw",
      },
      minHeight: {
        "70vh": "70vh",
        "80vh": "80vh",
        "90vh": "90vh",
      },
      typography: theme => ({
        DEFAULT: {
          css: {
            color: theme("colors.foreground"),

            a: {
              color: theme("colors.foreground"),
              textDecoration: "underline",

              "&:hover": {
                color: theme("colors.blue.500"),
              },
            },

            h1: {
              color: theme("colors.foreground"),
              fontWeight: theme("fontWeight.bold"),
            },
            h2: {
              color: theme("colors.foreground"),
              fontWeight: theme("fontWeight.bold"),
            },
            h3: {
              color: theme("colors.foreground"),
            },
            h4: {
              color: theme("colors.foreground"),
            },
            img: {
              borderRadius: "10px",
            },
            code: {
              background: "transparent",
              color: theme("colors.blue.500"),
              fontWeight: theme("fontWeight.normal"),
            },
            pre: {
              code: {
                "&::after": {
                  display: "none",
                },
              },
            },
          },
        },
      }),
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};
