import { Link } from "@/components/Link";
import { Search } from "@/types";
import { Markup } from "interweave";
import React from "react";
import tw from "twin.macro";

interface Props {
  results: Search.Result;
}

const Results: React.FC<Props> = ({ results }) => {
  // @FIXME: Indexer is grabbing #__next from anchor hrefs. This should be
  // fixed upstream, but no harm in just hacking it in place for now.
  const cleanSlug = (slug: string) => slug.replace("#__next", "");

  return (
    <div css={tw`p-2 m-2`}>
      {Array.from(Object.entries(results)).map(([chapter, hits]) => {
        return (
          <div
            key={chapter}
            css={[
              tw`flex flex-col`,
              tw`rounded-lg p-3 mb-4`,
              tw`border border-2 rounded-lg border-dashed`,
            ]}
          >
            <h4 css={[tw`font-bold text-lg mb-2`]}>{chapter}</h4>
            <ul>
              {hits.map(h => {
                return (
                  <li key={cleanSlug(h.slug)} css={tw`flex flex-col mb-2`}>
                    <Link
                      href={cleanSlug(h.slug)}
                      css={[tw`flex flex-col font-medium hover:text-pink-700`]}
                    >
                      {h.hierarchies.join(" -> ")}
                      <span
                        css={[
                          tw`leading-[1.4] text-gray-500 dark:text-gray-600`,
                          tw`[&>.rendered span]:bg-yellow-200`,
                          tw`[&>.rendered span]:p-1`,
                          tw`[&>.rendered span]:text-black`,
                          tw`[&>.rendered span]:dark:text-white`,
                        ]}
                      >
                        {h.text !== "" && (
                          <Markup className="rendered" content={h.text} />
                        )}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default Results;
