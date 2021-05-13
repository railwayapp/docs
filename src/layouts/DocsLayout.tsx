import { useRouter } from "next/router";
import React, { useMemo } from "react";
import "twin.macro";
import { Link } from "../components/Link";
import { PageNav } from "../components/PageNav";
import { sidebarContent } from "../data/sidebar";
import { FrontMatter } from "../types";
import { Page, Props as PageProps } from "./Page";

export interface Props extends PageProps {
  frontMatter: FrontMatter;
}

const getOGImage = (title: string) =>
  `https://og.railway.app/api/image?fileType=png&layoutName=Docs&Theme=Dark&URL=&Page=${encodeURIComponent(
    title,
  )}`;

export const DocsLayout: React.FC<Props> = ({
  frontMatter,
  children,
  ...props
}) => {
  const { pathname } = useRouter();
  const gitHubFileLink = useMemo(
    () =>
      `https://github.com/railwayapp/docs/edit/main/src/pages${pathname}.md`,
    [pathname],
  );

  const { prevPage, nextPage } = useMemo(() => {
    const sectionIndex = sidebarContent.findIndex(s =>
      s.pages.find(p => p.slug === pathname),
    )!;
    const pageIndex = sidebarContent[sectionIndex].pages.findIndex(
      p => p.slug === pathname,
    );

    const prevSection = sidebarContent[sectionIndex - 1];
    const currentSection = sidebarContent[sectionIndex];
    const nextSection = sidebarContent[sectionIndex + 1];

    const prevPage =
      pageIndex === 0
        ? prevSection != null
          ? prevSection.pages[prevSection.pages.length - 1]
          : null
        : currentSection.pages[pageIndex - 1];

    const nextPage =
      pageIndex === currentSection.pages.length - 1
        ? nextSection != null
          ? nextSection.pages[0]
          : null
        : currentSection.pages[pageIndex + 1];

    return { prevPage, nextPage };
  }, [pathname]);

  return (
    <Page
      {...props}
      seo={{
        title: `${frontMatter.title} - Railway Docs`,
        image: getOGImage(frontMatter.title),
      }}
    >
      <div tw="max-w-full">
        <div tw="max-w-prose flex-auto prose">
          <h1>{frontMatter.title}</h1>

          <div className="docs-content">{children}</div>
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
    </Page>
  );
};
