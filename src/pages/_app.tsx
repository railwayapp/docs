import { AppProps } from "next/app";
import { usePostHog } from "../hooks/usePostHog";
import { Page } from "../layouts/Page";
import "../styles/globals.css";
import "../styles/fonts.css";
import { ThemeProvider } from "../styles/theme";
import { useScrollToOpenCollapse } from "../hooks/useScrollToOpenCollapse";
import { useHashRedirect } from "@/hooks/useHashRedirect";

const MyApp = ({ Component, pageProps }: AppProps) => {
  // Initialize PostHog analytics
  usePostHog(
    process.env.NEXT_PUBLIC_POSTHOG_API_KEY ?? "",
    process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://app.posthog.com",
  );

  useScrollToOpenCollapse();

  useHashRedirect();

  return (
    <ThemeProvider>
      <Page>
        <Component {...pageProps} />
      </Page>
    </ThemeProvider>
  );
};

export default MyApp;
