import { AppProps } from "next/app";
import { ThemeProvider } from "../styles/theme";
import { OverlayProvider } from "react-aria";
import "../styles/fonts.css";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProvider>
      <OverlayProvider>
        <Component {...pageProps} />
      </OverlayProvider>
    </ThemeProvider>
  );
};

export default MyApp;
