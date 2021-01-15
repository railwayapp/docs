import Fuse from "fuse.js";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { ArrowRight, Search as SearchIcon } from "react-feather";
import tinykeys from "tinykeys";
import tw from "twin.macro";
import { useStore } from "../store";
import { IPage } from "../types";
import { Link } from "./Link";

export const Search: React.FC = () => {
  const { setIsSearchOpen } = useStore();

  return (
    <>
      <button
        onClick={() => setIsSearchOpen(true)}
        css={[
          tw`flex items-center justify-between space-x-4 w-full`,
          tw`rounded border border-gray-200 cursor-pointer`,
          tw`px-2 py-2 md:py-1 text-gray-300 text-left`,
          tw`focus:outline-none hover:border-pink-300`,
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

export const SearchModal: React.FC<{
  fuse: Fuse<IPage>;
  closeModal: () => void;
}> = ({ fuse, closeModal }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<IPage[]>([]);
  const [selected, setSelected] = useState(0);
  const router = useRouter();

  const onPressUp = useCallback(() => {
    setSelected(Math.max(0, selected - 1));
  }, [selected, results, setSelected]);

  const onPressDown = useCallback(() => {
    setSelected(Math.min(results.length - 1, selected + 1));
  }, [selected, results, setSelected]);

  const handleEnter = useCallback(() => {
    const item = results[selected];
    if (item != null) {
      router.push(item.slug);
      closeModal();
    }
  }, [selected, results]);

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      Enter: () => handleEnter(),

      ArrowUp: () => onPressUp(),
      "Control+k": () => onPressUp(),
      "Control+p": () => onPressUp(),

      ArrowDown: () => onPressDown(),
      "Control+j": () => onPressDown(),
      "Control+n": () => onPressDown(),
    });

    return () => unsubscribe();
  }, [handleEnter, onPressUp, onPressDown]);

  useEffect(() => {
    const results = fuse.search(query);
    const pages = results.map(r => r.item).slice(0, MAX_NUM_RESULTS);
    setResults(pages);
    setSelected(Math.max(0, Math.min(pages.length - 1, selected)));
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
              <li key={item.slug}>
                <Link
                  href={item.slug}
                  css={[
                    tw`block p-4`,
                    index === selected
                      ? tw`text-pink-900 bg-pink-100`
                      : tw`text-gray-500`,
                  ]}
                >
                  <div tw="flex items-center justify-between space-x-4">
                    <span>{item.title}</span>
                    <ArrowRight tw="w-4 h-4" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
