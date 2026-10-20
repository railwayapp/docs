import { AppProps } from "next/app";
import Script from "next/script";
import { usePostHog } from "../hooks/use-posthog";
import { Page } from "../layouts/page";
import "../styles/globals.css";
import "../styles/fonts.css";
import { ThemeProvider } from "../styles/theme";
import { useScrollToOpenCollapse } from "../hooks/use-scroll-to-open-collapse";
import { useHashRedirect } from "@/hooks/use-hash-redirect";
import { DO11Y_SCRIPT_SRC, isDo11yEnabled } from "@/utils/do11y";

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
      {isDo11yEnabled() && (
        <Script src={DO11Y_SCRIPT_SRC} strategy="afterInteractive" />
      )}
    </ThemeProvider>
  );
};

export default MyApp;
