import { AppProps } from "next/app";
import { ThemeProvider } from "../styles/theme";

import "../styles/fonts.css";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
};

export default MyApp;
