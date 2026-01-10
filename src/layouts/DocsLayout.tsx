import { useRouter } from "next/router";
import React, { PropsWithChildren, useMemo } from "react";
import { CheckCircle, Copy, Edit } from "react-feather";
import "twin.macro";
import { Icon } from "../components/Icon";
import { Link } from "../components/Link";
import { useCopy } from "../hooks/useCopy";
import { PageNav } from "../components/PageNav";
import { SEO } from "../components/SEO";
import { sidebarContent } from "../data/sidebar";
import { FrontMatter, ISidebarContent, IPage } from "../types";
import { Props as PageProps } from "./Page";
import { reconstructMarkdownWithFrontmatter } from "../utils/markdown";
import {
  extractHeadersFromMarkdown,
  buildBreadcrumbs,
  getLastModifiedDate,
} from "../utils/seo";

export interface Props extends PageProps {
  frontMatter: FrontMatter;
  rawMarkdown?: string;
}

const getOGImage = (title: string) =>
  `https://og.railway.com/api/image?fileType=png&layoutName=Docs&Theme=Dark&URL=&Page=${encodeURIComponent(
    title,
  )}`;

const domainUrl = "https://docs.railway.com";
const fallbackDescription = "Documentation for Railway";

export const flattenSidebarContent = (
  sidebarContent: ISidebarContent,
): IPage[] => {
  let flatPages: IPage[] = [];
  sidebarContent.forEach(section => {
    section.content.forEach(item => {
      if ("url" in item) {
        // Skip external links
        return;
      } else if ("subTitle" in item) {
        // this is the subTitle page
        if (typeof item.subTitle !== "string") {
          flatPages.push(item.subTitle);
        }
        // also used for skipping external links
        item.pages.forEach(page => {
          if (!("url" in page)) {
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
  rawMarkdown,
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

  const [copied, copyText] = useCopy();

  const handleCopyMarkdown = () => {
    if (rawMarkdown) {
      const fullMarkdown = reconstructMarkdownWithFrontmatter(
        frontMatter,
        rawMarkdown,
      );
      copyText(fullMarkdown);
    }
  };

  const { prevPage, nextPage } = useMemo(() => {
    const flatPages = flattenSidebarContent(sidebarContent);
    const pageIndex = flatPages.findIndex(p => p.slug === prefixedSlug);

    const prevPage = pageIndex > 0 ? flatPages[pageIndex - 1] : null;
    const nextPage =
      pageIndex < flatPages.length - 1 ? flatPages[pageIndex + 1] : null;

    return { prevPage, nextPage };
  }, [slug]);

  // Extract headers from markdown for SEO
  const headers = useMemo(() => {
    if (!rawMarkdown) return [];
    return extractHeadersFromMarkdown(rawMarkdown);
  }, [rawMarkdown]);

  // Build breadcrumbs from sidebar structure
  const breadcrumbs = useMemo(() => {
    return buildBreadcrumbs(frontMatter.url, sidebarContent);
  }, [frontMatter.url]);

  // Get last modified date (could be enhanced to get from git)
  const lastModified = useMemo(() => {
    return getLastModifiedDate();
  }, []);

  return (
    <>
      <SEO
        title={`${frontMatter.title} | Railway Docs`}
        twitterTitle={`${frontMatter.title}`}
        description={`${frontMatter.description || fallbackDescription}`}
        url={`${domainUrl}${frontMatter.url}`}
        image={getOGImage(frontMatter.title)}
        headers={headers}
        breadcrumbs={breadcrumbs}
        lastModified={lastModified}
      />
      <div tw="max-w-full flex flex-row min-h-screen">
        <div tw="flex-auto prose dark:prose-invert">
          <div className="docs-content">
            <h1>{frontMatter.title}</h1>
            <div tw="flex items-center gap-3 -mt-4 mb-6 text-sm text-gray-500">
              <button
                tw="flex items-center gap-1.5 hover:text-pink-500 transition-colors"
                onClick={handleCopyMarkdown}
                type="button"
              >
                <Icon icon={copied ? CheckCircle : Copy} size="sm" />
                <span aria-live="polite">{copied ? "Copied!" : "Copy as Markdown"}</span>
              </button>
            </div>
            {children}
          </div>

          <Link
            tw="mt-16 flex items-center space-x-2 text-gray-600 text-sm no-underline hover:text-pink-500 w-fit"
            href={gitHubFileLink}
          >
            <Edit tw="w-4 h-4" />
            <span>Edit this file on GitHub</span>
          </Link>

          <hr tw="my-4" />

          <div
            tw="flex items-center justify-between space-x-4 mb-8 md:mb-16"
            className="prev-next-buttons"
          >
            {prevPage != null ? (
              <Link href={prevPage.slug} tw="hover:text-pink-500 no-underline">
                <div tw="max-w-full">
                  <div tw="text-gray-600 text-sm mb-1">Prev</div>{" "}
                  <div tw="font-medium text-lg">{prevPage.title}</div>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {nextPage != null && (
              <Link href={nextPage.slug} tw="hover:text-pink-500 no-underline">
                <div tw="text-right">
                  <div tw="text-gray-600 text-sm mb-1">Next</div>{" "}
                  <div tw="font-medium text-lg">{nextPage.title}</div>
                </div>
              </Link>
            )}
          </div>

        </div>
        <PageNav title={frontMatter.title} />
      </div>
    </>
  );
};
