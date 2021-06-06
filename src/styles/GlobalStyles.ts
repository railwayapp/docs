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
      ${tw`bg-blue-200 dark:bg-blue-900`}
    }

    ::-moz-selection {
      ${tw`bg-blue-200 dark:bg-blue-900`}
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
