import { createGlobalStyle } from "styled-components";
import tw from "twin.macro";

export const GlobalStyles = createGlobalStyle`
  body {
    ${tw`antialiased`}
    ${tw`text-foreground bg-background leading-relaxed`}
    ${tw`font-sans`}
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
