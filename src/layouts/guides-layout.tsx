import React, { PropsWithChildren, useMemo } from "react";
import { Footer } from "../components/footer";
import { InlineTOC } from "../components/inline-toc";
import { SEO } from "../components/seo";
import { TOC, TOCProvider, type TOCItemType } from "../components/toc";
import { extractHeadersFromMarkdown } from "../utils/seo";

export interface GuideAuthor {
  name: string;
  avatar?: string;
  link?: string;
}

export interface GuideFrontMatter {
  title: string;
  description: string;
  url: string;
  author?: GuideAuthor;
  tags?: string[];
  lastModified?: string;
}

export interface GuidesLayoutProps {
  frontMatter: GuideFrontMatter;
  rawMarkdown?: string;
}

const getOGImage = (title: string) =>
  `https://og.railway.com/api/image?fileType=png&layoutName=Docs&Theme=Dark&URL=&Page=${encodeURIComponent(
    title,
  )}`;

const domainUrl = "https://docs.railway.com";
const fallbackDescription = "Community guides and tutorials for Railway";

export const GuidesLayout: React.FC<PropsWithChildren<GuidesLayoutProps>> = ({
  frontMatter,
  rawMarkdown,
  children,
}) => {
  const gitHubFileLink = useMemo(
    () =>
      `https://github.com/railwayapp/docs/edit/main/content/guides${frontMatter.url.replace(
        "/guides",
        "",
      )}.md`,
    [frontMatter.url],
  );

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
        title={`${frontMatter.title} | Railway Guides`}
        twitterTitle={`${frontMatter.title}`}
        description={`${frontMatter.description || fallbackDescription}`}
        url={`${domainUrl}${frontMatter.url}`}
        image={getOGImage(frontMatter.title)}
        headers={headers}
        breadcrumbs={[
          { name: "Guides", url: "/guides" },
          { name: frontMatter.title },
        ]}
        lastModified={lastModified}
      />
      <TOCProvider items={tocItems}>
        <div className="flex flex-col min-h-[calc(100vh-53px)]">
          {/* Two-column layout */}
          <div className="max-w-full flex flex-row flex-1">
            <div className="flex-auto min-w-0 prose dark:prose-invert">
              <div className="docs-content max-w-full">
                <h1 className="mb-4">{frontMatter.title}</h1>

                {/* Author info */}
                {frontMatter.author && (
                  <div className="not-prose flex items-center gap-3 mb-8">
                    {frontMatter.author.avatar && (
                      <img
                        src={frontMatter.author.avatar}
                        alt={frontMatter.author.name}
                        className="size-10 rounded-full"
                      />
                    )}
                    <div>
                      {frontMatter.author.link ? (
                        <a
                          href={frontMatter.author.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-muted-high-contrast hover:text-primary-solid transition-colors"
                        >
                          {frontMatter.author.name}
                        </a>
                      ) : (
                        <span className="text-sm font-medium text-muted-high-contrast">
                          {frontMatter.author.name}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {frontMatter.tags && frontMatter.tags.length > 0 && (
                  <div className="not-prose flex flex-wrap gap-2 mb-8">
                    {frontMatter.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs font-medium rounded-md bg-muted-element text-muted-base"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <InlineTOC className="mb-8 lg:hidden" defaultExpanded={false} />
                {children}
              </div>

              <div className="mt-24">
                <hr className="border-muted" />
              </div>
            </div>
            <div className="flex-col max-w-sm pt-4 pl-16 xl:pl-24 pr-0 pb-6 min-w-pageNav hidden lg:flex shrink-0">
              <aside className="sticky top-[69px] flex flex-col gap-8">
                {tocItems.length > 0 && <TOC items={tocItems} />}
              </aside>
            </div>
          </div>

          {/* Footer */}
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
