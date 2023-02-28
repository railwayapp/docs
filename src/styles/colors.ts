export type ColorMode = "light" | "dark";
export const defaultColorMode: ColorMode = "dark";

const lightColors = {
  foreground: "#181622",
  background: "#ffffff",
  gray: {
    100: "#f4f4f6",
    200: "#D6D8DC",
    300: "#B1B6BE",
    400: "#8D94A0",
    500: "#6B7280",
    600: "#565C67",
    700: "#41454E",
    800: "#2C2F35",
    900: "#1D1B22",
  },
  pink: {
    100: "#F8ECFF",
    200: "#EAC3FF",
    300: "#DC9BFF",
    400: "#CE72FF",
    500: "#C049FF",
    600: "#AE16FF",
    700: "#9400E2",
    800: "#7200AF",
    900: "#51007C",
  },
  yellow: {
    100: "#FFFCE5",
    200: "#FFF7B2",
    300: "#FFF27F",
    400: "#FFED4C",
    500: "#FFE819",
    600: "#DBC500",
    700: "#9E8E00",
    800: "#605700",
    900: "#232000",
  },
  red: {
    100: "#F2C5C8",
    200: "#E89CA1",
    300: "#DF7279",
    400: "#D54952",
    500: "#BF2C35",
    600: "#962229",
    700: "#6C191E",
    800: "#430F12",
    900: "#190607",
  },
  green: {
    100: "#DDF2E6",
    200: "#B8E4CA",
    300: "#92D7AF",
    400: "#6DC993",
    500: "#48BB78",
    600: "#389860",
    700: "#2B7249",
    800: "#1D4D31",
    900: "#0F2819",
  },
  blue: {
    100: "#F0F4FF",
    200: "#CCDAFF",
    300: "#A8C1FF",
    400: "#85A7FF",
    500: "#618DFF",
    600: "#2E68FF",
    700: "#0046FA",
    800: "#0037C7",
    900: "#002994",
  },
} as Record<string, Record<number, string>>;

const invertMap = {
  "100": 900,
  "200": 800,
  "300": 700,
  "400": 600,
  "500": 500,
  "600": 400,
  "700": 300,
  "800": 200,
  "900": 100,
} as Record<string, number>;

let darkColors = {} as typeof lightColors;
for (const [name, colors] of Object.entries(lightColors)) {
  darkColors[name] = {};
  for (const [lightScale, value] of Object.entries(colors)) {
    darkColors[name][invertMap[lightScale]] = value;
  }
}

darkColors = {
  ...darkColors,
  foreground: "#fafbfc",
  background: "#131415",
};

export const colorThemes: Record<ColorMode, any> = {
  light: lightColors,
  dark: darkColors,
};
