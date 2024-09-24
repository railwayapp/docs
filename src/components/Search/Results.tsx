import { Link } from "@/components/Link";
import { Search } from "@/types";
import { Markup } from "interweave";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import tinykeys from "tinykeys";
import tw from "twin.macro";

interface Props {
  closeModal: () => void;
  results: Search.Result;
}

type SelectedResult = { idx: number; slug: string };

const withoutBaseUri = (slug: string) => {
  const url = new URL(slug);
  const { hash, pathname } = url;
  return `${pathname}${hash}`;
};

// @FIXME: Indexer is grabbing #__next from anchor hrefs. This should be
// fixed upstream, but no harm in just hacking it in place for now.
const cleanSlug = (slug: string) => withoutBaseUri(slug.replace("#__next", ""));

const Results: React.FC<Props> = ({ closeModal, results }) => {
  const router = useRouter();

  // A result is selected when navigated to using arrow keys, or on mouse
  // hover.
  const [selectedResult, setSelectedResult] = useState<SelectedResult | null>(
    null,
  );

  const resultsFlat: SelectedResult[] = Object.values(results)
    .flat()
    .map((r, idx) => ({ idx, slug: cleanSlug(r.slug) }));

  const onArrowKeyDown = useCallback(() => {
    if (selectedResult && selectedResult.idx + 1 >= resultsFlat.length) {
      // End of results; nothing to go down from.
      return;
    }

    setSelectedResult(prev => {
      // On key down, go to the next item.
      const next = prev ? resultsFlat[prev.idx + 1] : resultsFlat[0];
      return { ...next };
    });
  }, [resultsFlat, selectedResult, setSelectedResult]);

  const onArrowKeyUp = useCallback(() => {
    setSelectedResult(prev => {
      if (prev === null || prev.idx === 0) {
        // Start of results. Going up from here is the search input, so it's
        // a no-op.
        return null;
      }
      // On key up, go to the previous item.
      const next = prev ? resultsFlat[prev.idx - 1] : resultsFlat[0];
      return { ...next };
    });
  }, [resultsFlat, setSelectedResult]);

  const onEnter = useCallback(() => {
    if (selectedResult === null) {
      return;
    }
    closeModal();
    router.push(selectedResult.slug);
  }, [closeModal, router, selectedResult]);

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      ArrowDown: () => onArrowKeyDown(),
      ArrowUp: () => onArrowKeyUp(),
      Enter: () => onEnter(),
    });
    return () => unsubscribe();
  }, [onArrowKeyDown, onArrowKeyUp, onEnter]);

  return (
    <div css={tw`border-t pt-4`}>
      {Object.entries(results).map(([chapter, hits]) => {
        return (
          <div
            key={chapter}
            css={[tw`flex flex-col`, tw`rounded-lg pb-4 px-4`]}
          >
            <h4 css={[tw`font-medium text-[16px] mb-3 text-gray-500`]}>
              {/* // some chapters are null, display the first hierarchy as a fallback instead of the literal word "null" */}
              {chapter == "null" ? hits[0]?.hierarchies[0] : chapter}
            </h4>
            <ul>
              {hits.map(h => {
                const slug = cleanSlug(h.slug);
                const isSelected = selectedResult?.slug === slug;
                return (
                  <li
                    key={slug}
                    css={tw`flex flex-col mb-2`}
                    onMouseEnter={() => {
                      if (isSelected) {
                        return;
                      }
                      const result = resultsFlat.find(r => r.slug === slug);
                      if (!result) {
                        return;
                      }
                      setSelectedResult(result);
                    }}
                  >
                    <Link
                      href={slug}
                      onClick={closeModal}
                      css={[
                        tw`flex flex-col font-medium px-4 py-3 rounded rounded-lg bg-gray-100 transition ease-out`,
                        isSelected && tw`bg-gray-200`,
                      ]}
                    >
                      <div
                        css={[
                          tw`flex flex-col justify-center h-8`,
                          tw`font-semibold text-[16px] truncate text-ellipsis`,
                        ]}
                      >
                        {h.hierarchies.join(" -> ")}
                      </div>
                      {h.text !== "" && (
                        <span
                          css={[
                            tw`leading-[1.6] text-gray-500 dark:text-gray-600 font-light mt-1`,
                            tw`[&>.rendered span]:bg-yellow-200`,
                            tw`[&>.rendered span]:text-black`,
                            tw`[&>.rendered span]:dark:text-white`,
                            isSelected && tw`text-gray-800 dark:text-gray-700`,
                          ]}
                        >
                          <Markup className="rendered" content={h.text} />
                        </span>
                      )}
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
