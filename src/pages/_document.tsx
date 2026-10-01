import Document, { Head, Html, Main, NextScript } from "next/document";
import {
  DO11Y_SCRIPT_SRC,
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
            <>
              {/* Inline config must come before the bundle, which reads
                  window.Do11yConfig as soon as it executes. */}
              <script
                dangerouslySetInnerHTML={{
                  __html: buildDo11yConfigScript(do11yConfig),
                }}
              />
              <script async src={DO11Y_SCRIPT_SRC} />
            </>
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
