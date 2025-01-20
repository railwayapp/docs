import * as React from "react";
import { DefaultSeo, NextSeo, NextSeoProps } from "next-seo";
import Head from "next/head";
import { DefaultSeoProps } from "next-seo";

export interface Props extends NextSeoProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

const title = "Railway Docs";
export const url = "https://docs.railway.com";
const description = "Documentation for Railway";
const image = "https://docs.railway.com/og.png";

const config: DefaultSeoProps = {
  title,
  description,
  openGraph: {
    type: "website",
    url,
    site_name: title,
    images: [{ url: image }],
  },
  twitter: {
    site: "@Railway",
    handle: "@Railway",
    cardType: "summary_large_image",
  },
};

export const SEO: React.FC<Props> = ({ image, ...props }) => {
  const title = props.title ?? config.title;
  const description = props.description || config.description;
  const url = props.url || config.openGraph?.url;

  return (
    <>
      <DefaultSeo {...config} />

      <NextSeo
        {...props}
        {...(image == null
          ? {}
          : {
              openGraph: {
                url,
                description,
                site_name: title,
                images: [{ url: image }],
              },
            })}
      />

      <Head>
        <title>{title}</title>
        <meta property="og:image:alt" content={title} />
      </Head>
    </>
  );
};
