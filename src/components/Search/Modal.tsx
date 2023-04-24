import { useDebouncedSearch } from "@/hooks/useDebouncedSearch";
import { Search as SearchIcon } from "react-feather";
import { Search } from "@/types";
import React from "react";
import tw from "twin.macro";
import NoResults from "./NoResults";
import SearchResults from "./Results";
import QueryInput from "./QueryInput";

const SearchModal: React.FC<{
  closeModal: () => void;
}> = ({ closeModal }) => {
  const { clearResponse, query, setQuery, response } =
    useDebouncedSearch<Search.Document>(
      process.env.NEXT_PUBLIC_MEILISEARCH_HOST ?? "",
      process.env.NEXT_PUBLIC_MEILISEARCH_READ_API_KEY ?? "",
      process.env.NEXT_PUBLIC_MEILISEARCH_INDEX_NAME ?? "",
      {
        limit: 10,
        attributesToHighlight: ["*"],
        highlightPreTag: "<span>",
        highlightPostTag: "</span>",
      },
    );

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
        <div className="search-input">
          <QueryInput
            clearResponse={clearResponse}
            query={query}
            setQuery={setQuery}
          />
        </div>
        <div className="search-results">
          {response &&
            (response.hits.length === 0 ? (
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
