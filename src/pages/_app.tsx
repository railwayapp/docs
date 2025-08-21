import { AppProps } from "next/app";
import { OverlayProvider } from "react-aria";
import { useFathom } from "../hooks/useFathom";
import { usePostHog } from "../hooks/usePostHog";
import { Page } from "../layouts/Page";
import "../styles/fonts.css";
import { ThemeProvider } from "../styles/theme";
import { useScrollToOpenCollapse } from "../hooks/useScrollToOpenCollapse";
import { useHashRedirect } from "@/hooks/useHashRedirect";
import env from "@/config/env";

const MyApp = ({ Component, pageProps }: AppProps) => {
  useFathom(env.NEXT_PUBLIC_FATHOM_CODE, "docs.railway.com");

  // Initialize PostHog analytics
  usePostHog(env.NEXT_PUBLIC_POSTHOG_API_KEY, env.NEXT_PUBLIC_POSTHOG_HOST);

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
