import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";
import { ServerStyleSheet } from "styled-components";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Font Preloads */}
          <link rel="preload" href="/fonts/Inter-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
          <link rel="preload" href="/fonts/IBMPlexSerif-Medium-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />

          {/* Preconnect to external domains */}
          <link rel="preconnect" href="https://res.cloudinary.com" />
          <link rel="preconnect" href="https://devicons.railway.com" />
          <link rel="dns-prefetch" href="https://res.cloudinary.com" />
          <link rel="dns-prefetch" href="https://devicons.railway.com" />

          {/* Defer Tally script */}
          <script async defer src="https://tally.so/widgets/embed.js"></script>
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
