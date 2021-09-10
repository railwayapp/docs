import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";
import "twin.macro";
import { Link } from "../components/Link";
import { PageNav } from "../components/PageNav";
import { sidebarContent } from "../data/sidebar";
import { FrontMatter } from "../types";
import { Page, Props as PageProps } from "./Page";
import { SEO } from "../components/SEO";
import { ThumbsUp, ThumbsDown } from "react-feather";


export interface Props extends PageProps {
  frontMatter: FrontMatter;
}

const sendFeedback = async event => {
  event.preventDefault()

  try {
    const res = await fetch(
      'https://hooks.zapier.com/hooks/catch/7799789/b6br9kh',
      {
        body: JSON.stringify({
          feedback: event.target.feedback.value
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      }
    );
  } catch (e) {
    console.error(e)
  }

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
  const [helpful, setHelpful] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");

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
    <>
      <SEO title={`${frontMatter.title} | Railway Docs`} image={getOGImage(frontMatter.title)} />
      <div tw="max-w-full">

        <div tw="max-w-prose flex-auto prose">
          <h1>{frontMatter.title}</h1>

          <div className="docs-content">{children}</div>
        </div>
        {!showFeedback && <div tw="flex flex-row align-items[center] mt-32">
          <div tw="font-semibold text-lg mr-4">Was this page helpful?</div>
          <button type="submit" tw="mr-2 flex align-items[center] border border-blue-200 rounded-md px-4 py-2 hover:bg-blue-100">
            <ThumbsUp tw="mr-2 text-blue-700" />
            <div tw="font-semibold text-blue-900">Yes</div>
          </button>
          <button onClick={e => setShowFeedback(true)} tw="flex align-items[center] border border-red-200 rounded-md px-4 py-2 hover:background-color[#FBEAEA]">
            <ThumbsDown tw="mr-2 text-red-500" />
            <div onClick={e => setShowFeedback(true)} tw="font-semibold text-red-700">No</div>
          </button>
        </div>}
        {showFeedback && <form tw="mt-16" onSubmit={sendFeedback}>
          <input tw="border rounded-md w-full p-2 my-6" id="feedback" name="feedback" type="text" required placeholder="What was missing or innacurate?" />
          <button type="submit" tw="border border-gray-200 p-2 rounded-md font-semibold text-gray-400 bg-gray-100 mr-8">Submit Feedback</button>
          <button onClick={e => setShowFeedback(false)}>Cancel</button>
        </form>}



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
    </>
  );
};
