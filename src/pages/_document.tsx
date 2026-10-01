import Document, { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";
import {
  DO11Y_CONFIG_SCRIPT_ID,
  buildDo11yConfigScript,
  getDo11yConfig,
} from "@/utils/do11y";

class MyDocument extends Document {
  render() {
    const do11yConfig = getDo11yConfig();

    return (
      <Html lang="en" suppressHydrationWarning>
        <Head>
          <script async src="https://tally.so/widgets/embed.js"></script>
          {do11yConfig && (
            <Script id={DO11Y_CONFIG_SCRIPT_ID} strategy="beforeInteractive">
              {buildDo11yConfigScript(do11yConfig)}
            </Script>
          )}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
