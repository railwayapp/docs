import { useSearchIndex } from "@/hooks/useSearchIndex";
import { Search } from "@/types";
import React, { useCallback, useEffect, useState } from "react";
import tw from "twin.macro";
import NoResults from "./NoResults";
import SearchResults from "./Results";

const SearchModal: React.FC<{
  closeModal: () => void;
}> = ({ closeModal }) => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<Search.MeilisearchResponse | null>(
    null,
  );

  const index = useSearchIndex(
    process.env.NEXT_PUBLIC_MEILISEARCH_HOST ?? "",
    process.env.NEXT_PUBLIC_MEILISEARCH_READ_API_KEY ?? "",
    process.env.NEXT_PUBLIC_MEILISEARCH_INDEX_NAME ?? "",
  );

  const fetchResponse = useCallback(async () => {
    if (query === "") {
      return;
    }
    try {
      const response = await index.search<Search.MeilisearchResponseItem>(
        query,
        {
          limit: 10,
          attributesToHighlight: ["*"],
          highlightPreTag: "<span>",
          highlightPostTag: "</span>",
        },
      );
      setResponse(response.hits);
    } catch (e) {
      console.error(`Search for query "${query}" failed (${e})`);
    }
  }, [query]);

  useEffect(() => {
    if (query === "") {
      return;
    }
    fetchResponse();
  }, [query]);

  return (
    <div
      css={[tw`px-2 mt-12 mb-12`, `sm:px-4`, `md:px-0 md:mt-28 md:mb-28`]}
      onPointerDown={() => {
        closeModal();
      }}
    >
      <div
        onPointerDown={e => e.stopPropagation()}
        css={[tw`bg-background border rounded-lg w-full md:w-1/2 mx-auto`]}
      >
        <input
          placeholder="Search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          autoFocus
          css={[
            tw`px-4 py-4 w-full bg-transparent focus:outline-none`,
            tw`border-b-2 border-gray-200 border-dotted`,
          ]}
        />
        <div className="results">
          {response &&
            (response.length === 0 ? (
              <NoResults />
            ) : (
              <SearchResults response={response} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
