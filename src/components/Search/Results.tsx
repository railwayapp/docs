import { SearchResponse } from "meilisearch";
import { Link } from "@/components/Link";
import { Search } from "@/types";
import { Markup } from "interweave";
import React from "react";
import tw from "twin.macro";

interface ResultItem {
  hierarchies: string[];
  slug: string;
  text: string;
}

type Result = Record<string, ResultItem[]>;

const Results: React.FC<{
  response: SearchResponse<Search.Document>;
}> = ({ response }) => {
  const { hits } = response;
  const chapters = Array.from(new Set(hits.map(r => r.hierarchy_lvl0)));
  const results = chapters.reduce((acc, curr) => {
    acc[curr] = [
      ...hits
        .filter(r => r.hierarchy_lvl0 === curr)
        .map(hit => ({
          hierarchies: [
            // `hit.hierarchy_lvl0` is intentionally ignored here; we're
            // grouping the rendered output by it so it's redundant.
            // In practice, this means that we'll render:
            //   >> "Databases"
            //   >> "PostgreSQL"
            //   >> ...
            // instead of:
            //   >> "Databases"
            //   >> "Databases -> PostgreSQL"
            //   >> ...
            hit.hierarchy_lvl1,
            hit.hierarchy_lvl2,
            hit.hierarchy_lvl3,
            hit.hierarchy_lvl4,
          ].filter(h => h !== null),
          slug: hit.url,
          text: (hit._formatted && hit._formatted.content) ?? "",
        })),
    ];
    return acc;
  }, {} as Result);

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
