import * as React from "react";
import { DefaultSeo, NextSeo, NextSeoProps, DefaultSeoProps } from "next-seo";
import Head from "next/head";
import { Header } from "@/utils/seo";

export interface Props extends NextSeoProps {
  title?: string;
  twitterTitle?: string;
  description?: string;
  image?: string;
  url?: string;
  headers?: Header[];
  breadcrumbs?: Array<{ name: string; url: string }>;
  lastModified?: string;
  author?: string;
  publishedTime?: string;
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

export const SEO: React.FC<Props> = ({
  image,
  headers = [],
  breadcrumbs = [],
  lastModified,
  author = "Railway",
  publishedTime,
  ...props
}) => {
  const title = props.title ?? config.title;
  const twitterTitle = props.twitterTitle;
  const description = props.description;
  const url = props.url || config.openGraph?.url;

  // Check if any headers are questions (for FAQPage schema)
  const hasQuestions = headers.some(h => h.title.trim().endsWith("?"));
  const questionHeaders = headers.filter(h => h.title.trim().endsWith("?"));

  // Build structured data schemas
  const schemas: Record<string, any>[] = [];

  // Organization schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Railway",
    url: "https://railway.com",
    logo: "https://docs.railway.com/railway.svg",
    sameAs: [
      "https://twitter.com/Railway",
      "https://github.com/railwayapp",
    ],
  };
  schemas.push(organizationSchema);

  // BreadcrumbList schema
  if (breadcrumbs.length > 0) {
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: crumb.url || undefined,
      })),
    };
    schemas.push(breadcrumbSchema);
  }

  // Table of Contents schema (using ItemList)
  if (headers.length > 0) {
    const tocSchema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Table of Contents",
      itemListElement: headers.map((header, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: header.title,
        url: url ? `${url}#${header.id}` : undefined,
      })),
    };
    schemas.push(tocSchema);
  }

  // Article schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    url: url,
    author: {
      "@type": "Organization",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: "Railway",
      logo: {
        "@type": "ImageObject",
        url: "https://docs.railway.com/railway.svg",
      },
    },
    ...(publishedTime && { datePublished: publishedTime }),
    ...(lastModified && { dateModified: lastModified }),
    ...(image && {
      image: {
        "@type": "ImageObject",
        url: image,
      },
    }),
  };
  schemas.push(articleSchema);

  // FAQPage schema (if questions exist)
  if (hasQuestions && questionHeaders.length > 0) {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: questionHeaders.map(header => ({
        "@type": "Question",
        name: header.title,
        acceptedAnswer: {
          "@type": "Answer",
          text: `See the answer in the documentation at ${url}#${header.id}`,
        },
      })),
    };
    schemas.push(faqSchema);
  }

  // Build enhanced meta tags from section hierarchy
  const sectionMetaTags: React.ReactNode[] = [];
  if (breadcrumbs.length > 1) {
    // Add section information
    const sectionName = breadcrumbs[breadcrumbs.length - 2]?.name;
    if (sectionName) {
      sectionMetaTags.push(
        <meta key="article:section" property="article:section" content={sectionName} />,
      );
    }
  }

  // Add tags based on breadcrumb hierarchy
  if (breadcrumbs.length > 2) {
    const tags = breadcrumbs
      .slice(1, -1)
      .map(crumb => crumb.name)
      .filter(Boolean);
    tags.forEach((tag, index) => {
      sectionMetaTags.push(
        <meta
          key={`article:tag-${index}`}
          property="article:tag"
          content={tag}
        />,
      );
    });
  }

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
                type: "article",
                ...(publishedTime && { publishedTime }),
                ...(lastModified && { modifiedTime: lastModified }),
              },
            })}
      />

      <Head>
        <title>{title}</title>
        <meta name="twitter:title" content={twitterTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        <meta name="twitter:image:alt" content={twitterTitle} />
        
        {/* Enhanced meta tags from section hierarchy */}
        {sectionMetaTags}
        
        {/* Last modification date */}
        {lastModified && (
          <meta name="last-modified" content={lastModified} />
        )}

        {/* Structured data schemas */}
        {schemas.map((schema, index) => (
          <script
            key={`schema-${index}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </Head>
    </>
  );
};
