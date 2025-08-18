import { AppProps } from "next/app";
import { OverlayProvider } from "react-aria";
import { useFathom } from "../hooks/useFathom";
import { usePostHog } from "../hooks/usePostHog";
import { Page } from "../layouts/Page";
import "../styles/fonts.css";
import { ThemeProvider } from "../styles/theme";
import { useScrollToOpenCollapse } from "../hooks/useScrollToOpenCollapse";
import { useHashRedirect } from "@/hooks/useHashRedirect";
import { FATHOM_CODE, POSTHOG_API_KEY, POSTHOG_HOST } from "@/config";

const MyApp = ({ Component, pageProps }: AppProps) => {
  useFathom(FATHOM_CODE, "docs.railway.com");

  // Initialize PostHog analytics
  usePostHog(POSTHOG_API_KEY, POSTHOG_HOST);

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
