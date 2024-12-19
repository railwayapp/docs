import { AppProps } from "next/app";
import { OverlayProvider } from "react-aria";
import { useFathom } from "../hooks/useFathom";
import { Page } from "../layouts/Page";
import "../styles/fonts.css";
import { ThemeProvider } from "../styles/theme";
import { useScrollToOpenCollapse } from "../hooks/useScrollToOpenCollapse";
import { useHashRedirect } from "@/hooks/useHashRedirect";

const MyApp = ({ Component, pageProps }: AppProps) => {
  useFathom(process.env.NEXT_PUBLIC_FATHOM_CODE ?? "", "docs.railway.com");

  useScrollToOpenCollapse();
  
  useHashRedirect();

  return (
    <ThemeProvider>
      <OverlayProvider>
        <Page>
          <Component {...pageProps} />
        </Page>
      </OverlayProvider>
    </ThemeProvider>
  );
};

export default MyApp;
