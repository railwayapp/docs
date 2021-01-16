import { createGlobalStyle } from "styled-components";
import tw from "twin.macro";

export const GlobalStyles = createGlobalStyle`
  body {
    ${tw`antialiased`}
    ${tw`text-foreground bg-background leading-relaxed`}
    ${tw`font-sans`}
  }

  html {
    ::selection {
      ${tw`bg-pink-200 dark:bg-pink-900`}
    }

    ::-moz-selection {
      ${tw`bg-pink-200 dark:bg-pink-900`}
    }
  }


  .sidebar ::-webkit-scrollbar {
    display: none;
  }

  .sidebar * {
    scrollbar-width: none;
  }

  * {
    box-sizing: border-box;
  }
`;
