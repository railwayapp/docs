import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { PropsWithChildren, useMemo } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/breadcrumb";
import { Footer } from "../components/footer";
import { InlineTOC } from "../components/inline-toc";
import { Link } from "../components/link";
import { PageActions } from "../components/page-actions";
import { SEO } from "../components/seo";
import { TOC, TOCProvider, type TOCItemType } from "../components/toc";
import { sidebarContent } from "../data/sidebar";
import { FrontMatter, ISidebarContent, IPage } from "../types";
import { Props as PageProps } from "./page";
import { reconstructMarkdownWithFrontmatter } from "../utils/markdown";
import { extractHeadersFromMarkdown, buildBreadcrumbs } from "../utils/seo";

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
      `https://github.com/railwayapp/docs/edit/main/content/docs${prefixedSlug}.md`,
    [prefixedSlug],
  );

  const fullMarkdown = useMemo(() => {
    if (rawMarkdown) {
      return reconstructMarkdownWithFrontmatter(frontMatter, rawMarkdown);
    }
    return "";
  }, [rawMarkdown, frontMatter]);

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

  // Convert headers to TOC items format
  const tocItems: TOCItemType[] = useMemo(() => {
    return headers
      .filter(h => h.level >= 2 && h.level <= 4)
      .map(h => ({
        title: h.title,
        url: `#${h.id}`,
        depth: h.level,
      }));
  }, [headers]);

  // Build breadcrumbs from sidebar structure
  const breadcrumbs = useMemo(() => {
    return buildBreadcrumbs(frontMatter.url, sidebarContent);
  }, [frontMatter.url]);

  // Get last modified date from git history
  const lastModified = frontMatter.lastModified ?? new Date().toISOString();

  const formattedLastModified = useMemo(() => {
    const date = new Date(lastModified);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, [lastModified]);

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
      <TOCProvider items={tocItems}>
        <div className="flex flex-col min-h-[calc(100vh-53px)]">
          {/* Two-column layout */}
          <div className="max-w-full flex flex-row flex-1">
            <div className="flex-auto min-w-0 prose dark:prose-invert">
              <div className="docs-content max-w-full">
                <Breadcrumb className="mb-8 not-prose">
                  <BreadcrumbList>
                    {breadcrumbs.map((crumb, index) => (
                      <React.Fragment key={crumb.url || index}>
                        <BreadcrumbItem>
                          {index < breadcrumbs.length - 1 ? (
                            crumb.url ? (
                              <NextLink
                                href={crumb.url}
                                className="no-underline! hover:text-muted-high-contrast"
                              >
                                {crumb.name}
                              </NextLink>
                            ) : (
                              <span className="text-muted-base">
                                {crumb.name}
                              </span>
                            )
                          ) : (
                            <BreadcrumbPage>{crumb.name}</BreadcrumbPage>
                          )}
                        </BreadcrumbItem>
                        {index < breadcrumbs.length - 1 && (
                          <BreadcrumbSeparator />
                        )}
                      </React.Fragment>
                    ))}
                  </BreadcrumbList>
                </Breadcrumb>
                <h1 className="mb-6">{frontMatter.title}</h1>
                <InlineTOC className="mb-8 lg:hidden" defaultExpanded={false} />
                {children}
              </div>

              <div className="mt-24">
                <hr className="border-muted" />

                <nav className="prev-next-buttons not-prose grid grid-cols-2 gap-4 mt-8">
                  {prevPage != null ? (
                    <Link
                      href={prevPage.slug}
                      className="group flex flex-col gap-2 rounded-lg border border-muted bg-muted-app p-4 transition-all duration-150 hover:bg-muted-element-active no-underline!"
                    >
                      <span className="flex items-center gap-1.5 text-muted-base text-xs font-medium">
                        <svg
                          className="size-3.5 transition-transform group-hover:-translate-x-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                        Previous
                      </span>
                      <span className="font-medium text-muted-high-contrast line-clamp-1">
                        {prevPage.title}
                      </span>
                    </Link>
                  ) : (
                    <div />
                  )}

                  {nextPage != null ? (
                    <Link
                      href={nextPage.slug}
                      className="group flex flex-col gap-2 rounded-lg border border-muted bg-muted-app p-4 text-right transition-all duration-150 hover:bg-muted-element-active no-underline!"
                    >
                      <span className="flex items-center justify-end gap-1.5 text-muted-base text-xs font-medium">
                        Next
                        <svg
                          className="size-3.5 transition-transform group-hover:translate-x-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </span>
                      <span className="font-medium text-muted-high-contrast line-clamp-1">
                        {nextPage.title}
                      </span>
                    </Link>
                  ) : (
                    <div />
                  )}
                </nav>
              </div>
            </div>
            <div className="flex-col max-w-sm pt-4 pl-16 xl:pl-24 pr-0 pb-6 min-w-pageNav hidden lg:flex shrink-0">
              <aside className="sticky top-[69px] flex flex-col gap-8">
                {tocItems.length > 0 && <TOC items={tocItems} />}
                <div
                  className={
                    tocItems.length > 0 ? "border-t border-muted pt-6" : ""
                  }
                >
                  <PageActions
                    content={fullMarkdown}
                    title={frontMatter.title}
                  />
                </div>
              </aside>
            </div>
          </div>

          {/* Footer - separate from two-column layout */}
          <div className="mt-24">
            <Footer
              gitHubEditLink={gitHubFileLink}
              lastModified={formattedLastModified}
            />
          </div>
        </div>
      </TOCProvider>
    </>
  );
};
