import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import tw from "twin.macro";
import { SEO } from "@/components/SEO";
import QueryInput from "@/components/Search/QueryInput";
import NoResults from "@/components/Search/NoResults";
import Results from "@/components/Search/Results";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch";
import { Search } from "@/types";

const SearchPage: React.FC = () => {
  const router = useRouter();
  const q = typeof router.query.q === "string" ? router.query.q : "";

  const searchParams = useMemo(
    () => ({
      limit: 20,
      attributesToHighlight: ["*"],
      highlightPreTag: "<span>",
      highlightPostTag: "</span>",
    }),
    [],
  );

  const { clearResponse, isSearching, query, setQuery, results } =
    useDebouncedSearch<Search.Document, Search.Result>(
      process.env.NEXT_PUBLIC_MEILISEARCH_HOST ?? "",
      process.env.NEXT_PUBLIC_MEILISEARCH_READ_API_KEY ?? "",
      process.env.NEXT_PUBLIC_MEILISEARCH_INDEX_NAME ?? "",
      searchParams,
      200,
    );

  useEffect(() => {
    if (q && q !== query) {
      setQuery(q);
    }
  }, [q]);

  useEffect(() => {
    const urlQ = typeof router.query.q === "string" ? router.query.q : "";
    if (query !== urlQ) {
      const next = { pathname: "/search", query: query ? { q: query } : {} };
      router.replace(next, undefined, { shallow: true, scroll: false });
    }
  }, [query, router]);

  return (
    <>
      <SEO
        title={q ? `Search: ${q} | Railway Docs` : "Search | Railway Docs"}
        description="Search Railway documentation"
        url="/search"
      />
      <div css={[tw`w-full`]}>
        <div css={[tw`bg-background border rounded-lg w-full`]}>
          <div className="search-input">
            <QueryInput
              clearResponse={clearResponse}
              query={query}
              setQuery={setQuery}
            />
          </div>
          <div className="search-results">
            {isSearching ? (
              <span tw="p-10 flex items-center justify-center">
                <LoadingIndicator />
              </span>
            ) : results ? (
              Object.keys(results).length === 0 ? (
                <NoResults />
              ) : (
                <Results closeModal={() => {}} results={results} />
              )
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchPage;
