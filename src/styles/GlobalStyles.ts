import { createGlobalStyle } from "styled-components";
import tw from "twin.macro";

export const GlobalStyles = createGlobalStyle`
  body {
    ${tw`antialiased`}
    ${tw`text-foreground bg-background leading-relaxed`}
    ${tw`font-sans`}
  }

  * {
    box-sizing: border-box;
  }
`;
