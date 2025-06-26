import { useRouter } from "next/router";
import React, { PropsWithChildren, useMemo } from "react";
import "twin.macro";
import { Link } from "../components/Link";
import { PageNav } from "../components/PageNav";
import { SEO } from "../components/SEO";
import { sidebarContent } from "../data/sidebar";
import { FrontMatter, ISidebarContent, IPage } from "../types";
import { Props as PageProps } from "./Page";

export interface Props extends PageProps {
  frontMatter: FrontMatter;
}

const getOGImage = (title: string) =>
  `https://og.railway.com/api/image?fileType=png&layoutName=Docs&Theme=Dark&URL=&Page=${encodeURIComponent(
    title,
  )}`;

const domainUrl = "https://docs.railway.com";
const fallbackDescription = "Documentation for Railway";

export const flattenSidebarContent = (sidebarContent: ISidebarContent): IPage[] => {
  let flatPages: IPage[] = [];
  sidebarContent.forEach(section => {
    section.content.forEach(item => {
      if ('url' in item) {
        // Skip external links
        return;
      } else if ('subTitle' in item) {
        // this is the subTitle page
        if (typeof item.subTitle !== 'string') {
          flatPages.push(item.subTitle);
        }
        // also used for skipping external links
        item.pages.forEach(page => {
          if (!('url' in page)) {
            flatPages.push(page);
          }
        });
      } else {
        // This is a page
        flatPages.push(item);
      }
    });
  });
  return flatPages;
};

export const DocsLayout: React.FC<PropsWithChildren<Props>> = ({
  frontMatter,
  children,
  ...props
}) => {
  const {
    query: { slug },
  } = useRouter();

  const prefixedSlug = useMemo(
    () => `/${(slug as string[] | undefined)?.join("/")}`,
    [slug],
  );
  const gitHubFileLink = useMemo(
    () =>
      `https://github.com/railwayapp/docs/edit/main/src/docs${prefixedSlug}.md`,
    [prefixedSlug],
  );

  const { prevPage, nextPage } = useMemo(() => {
    const flatPages = flattenSidebarContent(sidebarContent);
    const pageIndex = flatPages.findIndex(p => p.slug === prefixedSlug);

    const prevPage = pageIndex > 0 ? flatPages[pageIndex - 1] : null;
    const nextPage = pageIndex < flatPages.length - 1 ? flatPages[pageIndex + 1] : null;

    return { prevPage, nextPage };
  }, [slug]);

  return (
    <>
      
      <SEO
        title={`${frontMatter.title} | Railway Docs`}
        twitterTitle={`${frontMatter.title}`}
        description={`${frontMatter.description || fallbackDescription}`}
        url={`${domainUrl}${frontMatter.url}`}
        image={getOGImage(frontMatter.title)}
      />
      <div tw="max-w-full flex flex-row min-h-screen">
        <div tw="flex-auto prose dark:prose-invert">
          <div className="docs-content">
            <h1>{frontMatter.title}</h1>
            {children}
          </div>

          <hr tw="my-16" />

          <div
            tw="flex items-center justify-between space-x-4 mb-8 md:mb-16"
            className="prev-next-buttons"
          >
            {prevPage != null ? (
              <Link href={prevPage.slug} tw="hover:text-pink-500">
                <div tw="max-w-full">
                  <div tw="text-gray-600 text-sm mb-1">Prev</div>{" "}
                  <div tw="font-medium text-lg">{prevPage.title}</div>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {nextPage != null && (
              <Link href={nextPage.slug} tw="hover:text-pink-500">
                <div tw="text-right">
                  <div tw="text-gray-600 text-sm mb-1">Next</div>{" "}
                  <div tw="font-medium text-lg">{nextPage.title}</div>
                </div>
              </Link>
            )}
          </div>

          <Link
            className="edit-github-link"
            tw="text-gray-500 text-sm underline hover:text-pink-500"
            href={gitHubFileLink}
          >
            Edit this file on GitHub
          </Link>
        </div>
        <PageNav title={frontMatter.title} />
      </div>
    </>
  );
};
