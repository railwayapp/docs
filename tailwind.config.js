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
  "-apple-system",
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
      typography: theme => ({
        DEFAULT: {
          css: {
            color: theme("colors.text"),

            a: {
              color: theme("colors.text"),
              textDecoration: "none",

              "&:hover": {
                color: theme("colors.primary"),
              },
            },

            p: {
              a: {
                textDecoration: "underline",
              },
            },

            h1: {
              color: theme("colors.pink.50"),
            },
            h2: {
              color: theme("colors.text"),
            },
            h3: {
              color: theme("colors.text"),
            },
            h4: {
              color: theme("colors.text"),
            },
            img: {
              borderRadius: "10px",
            },
            code: {
              background: theme("colors.gray.800"),
              color: theme("colors.gray.200"),
              padding: "2px",
              borderRadius: "2px",
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
