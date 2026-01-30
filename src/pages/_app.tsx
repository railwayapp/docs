import { AppProps } from "next/app";
import { usePostHog } from "../hooks/use-posthog";
import { Page } from "../layouts/page";
import "../styles/globals.css";
import "../styles/fonts.css";
import { ThemeProvider } from "../styles/theme";
import { useScrollToOpenCollapse } from "../hooks/use-scroll-to-open-collapse";
import { useHashRedirect } from "@/hooks/use-hash-redirect";

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
