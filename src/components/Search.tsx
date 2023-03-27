import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { ArrowRight, Search as SearchIcon } from "react-feather";
import tinykeys from "tinykeys";
import tw from "twin.macro";
import Typesense from "typesense";
import { searchStore } from "../store";
import { IPage } from "../types";
import { Link } from "./Link";

export const Search: React.FC = () => {
  return (
    <>
      <button
        onClick={() => searchStore.set(true)}
        css={[
          tw`flex items-center justify-between space-x-4 w-full`,
          tw`rounded border border-gray-200 cursor-pointer`,
          tw`px-2 py-2 md:py-1 text-gray-300 text-left`,
          tw`focus:outline-none md:hover:border-pink-300`,
        ]}
      >
        <div tw="flex items-center space-x-2">
          <SearchIcon tw="w-4 h-4" />
          <span tw="text-sm">Search</span>
        </div>
        <div tw="text-gray-300 text-sm hidden md:block">⌘K</div>
      </button>
    </>
  );
};

const MAX_NUM_RESULTS = 5;
interface Result extends IPage {
  id: string;
  text: string;
}

export const SearchModal: React.FC<{
  closeModal: () => void;
}> = ({ closeModal }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<IPage[]>([]);
  const [selected, setSelected] = useState(0);
  const router = useRouter();

  const ts = new Typesense.Client({
    nodes: [
      {
        host: `${process.env.TYPESENSE_ENDPOINT}`,
        port: 443,
        protocol: "https",
      },
    ],
    apiKey: `${process.env.TYPESENSE_SEARCH_KEY}`,
    numRetries: 3,
    connectionTimeoutSeconds: 10,
    retryIntervalSeconds: 0.5,
    healthcheckIntervalSeconds: 2,
  });

  const fetchResults = useCallback(async () => {
    const results = await ts
      .collections("docs")
      .documents()
      .search({
        q: query,
        query_by: "title,text",
        text_match_type: "max_score",
        per_page: MAX_NUM_RESULTS,
      })
      .catch(() => ({ hits: [] }));
    const pages = results.hits?.map(hit => hit.document) as
      | Result[]
      | undefined;
    setResults(pages ?? []);
    setSelected(Math.max(0, Math.min(pages?.length ?? 0 - 1, selected)));
  }, [query]);

  const onPressUp = useCallback(() => {
    setSelected(Math.max(0, selected - 1));
  }, [selected, results, setSelected]);

  const onPressDown = useCallback(() => {
    setSelected(Math.min(results.length - 1, selected + 1));
  }, [selected, results, setSelected]);

  const handleEnter = useCallback(() => {
    const item = results[selected];
    if (item != null) {
      closeModal();
      router.push(item.slug);
    }
  }, [selected, results]);

  useEffect(() => {
    const preventDefault = (fn: () => void) => (e: KeyboardEvent) => {
      e.preventDefault();
      fn();
    };

    const unsubscribe = tinykeys(window, {
      Enter: () => handleEnter(),

      ArrowUp: () => onPressUp(),
      "Control+k": () => onPressUp(),
      "Control+p": preventDefault(() => onPressUp()),

      ArrowDown: () => onPressDown(),
      "Control+j": preventDefault(() => onPressDown()),
      "Control+n": preventDefault(() => onPressDown()),
    });

    return () => unsubscribe();
  }, [handleEnter, onPressUp, onPressDown]);

  useEffect(() => {
    fetchResults();
  }, [query]);

  return (
    <div
      css={[tw`px-2 sm:px-4 md:px-0 mt-12 md:mt-28`]}
      onPointerDown={() => {
        closeModal();
      }}
    >
      <div
        css={[
          tw`bg-background rounded w-full md:w-1/2 mx-auto overflow-hidden`,
          `max-width: 550px`,
        ]}
        onPointerDown={e => e.stopPropagation()}
      >
        <input
          placeholder="Search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          autoFocus
          tw="px-4 py-4 w-full bg-transparent focus:outline-none"
        />

        <div className="results">
          <ul>
            {results.map((item, index) => (
              <li key={item.slug} onMouseMove={() => setSelected(index)}>
                <Link
                  href={item.slug}
                  onClick={() => {
                    closeModal();
                  }}
                  css={[
                    tw`flex items-center justify-between px-3 h-16 relative`,
                    index === selected
                      ? tw`text-pink-900 bg-pink-100`
                      : tw`text-gray-500`,
                  ]}
                >
                  <div tw="flex flex-col">
                    {item.category != null && (
                      <span tw="w-auto mb-1 text-xs font-medium opacity-50 rounded-sm">
                        {item.category}
                      </span>
                    )}
                    <span>{item.title}</span>
                  </div>

                  <ArrowRight tw="w-4 h-4" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
