import { AppProps } from "next/app";
import { OverlayProvider } from "react-aria";
import { useFathom } from "../hooks/useFathom";
import { Page } from "../layouts/Page";
import "../styles/fonts.css";
import { ThemeProvider } from "../styles/theme";
import { useReportWebVitals } from 'next/web-vitals'

const MyApp = ({ Component, pageProps }: AppProps) => {
  useFathom(process.env.NEXT_PUBLIC_FATHOM_CODE ?? "", "docs.railway.app");

  useReportWebVitals((metric) => {
    let pageSlug = pageProps.page?.url || '/';
    console.log(pageProps.page?.url)
    switch (metric.name) {
      case 'FCP': {
        console.log(metric);
        let fcpVal = metric.value;
        try {
          console.log(metric)// send to prometheus
        } catch (error) {
          console.error('Send to prometheus error', error)
        }
      }
      case 'LCP': {
        console.log(metric);
      }
      // ...
    }
  });

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
