import * as React from "react";
import { DefaultSeo, NextSeo, NextSeoProps, DefaultSeoProps } from "next-seo";
import Head from "next/head";

export interface Props extends NextSeoProps {
  title?: string;
  twitterTitle?: string;
  description?: string;
  image?: string;
  url?: string;
}

const title = "Railway Docs";
const description = "Documentation for Railway";

export const url = "https://docs.railway.com";
const image = url + "/og.png";

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
  const twitterTitle = props.twitterTitle;
  const description = props.description;
  const url = props.url || config.openGraph?.url;

  return (
    <>
      <DefaultSeo {...config} />

      <NextSeo
        {...props}
        canonical={url}
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
        <meta name="twitter:title" content={twitterTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        <meta name="twitter:image:alt" content={twitterTitle} />
      </Head>
    </>
  );
};
