import { AppProps } from "next/app";
import { ThemeProvider } from "../styles/theme";
import { OverlayProvider } from "react-aria";
import "../styles/fonts.css";
import { useFathom } from "../hooks/useFathom";

const MyApp = ({ Component, pageProps }: AppProps) => {
  useFathom(process.env.NEXT_PUBLIC_FATHOM_CODE ?? "", "docs.railway.app");

  return (
    <ThemeProvider>
      <OverlayProvider>
        <Component {...pageProps} />
      </OverlayProvider>
    </ThemeProvider>
  );
};

export default MyApp;
