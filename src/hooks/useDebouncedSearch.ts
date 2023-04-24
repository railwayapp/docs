import { trackGoal } from "fathom-client";
import { MeiliSearch, SearchParams, SearchResponse } from "meilisearch";
import { useCallback, useEffect, useMemo, useState } from "react";

const FATHOM_SEARCH_PERFORMED_EVT_ID = "IMSTAYP4"

export const useDebouncedSearch = <T extends Record<string, any>>(
  host: string,
  apiKey: string,
  indexName: string,
  params: SearchParams,
  debounceMs: number = 500,
) => {
  if (host === "") {
    console.error(`useDebouncedSearch.host is missing`);
  }
  if (apiKey === "") {
    console.error(`useDebouncedSearch.apiKey is missing`);
  }
  if (indexName === "") {
    console.error(`useDebouncedSearch.indexName is missing`);
  }

  // Controlled input for rendering
  const [rawInput, setRawInput] = useState("");
  // Actual query from input that gets sent in search requests
  const [query, setQuery] = useState("");

  const [response, setResponse] = useState<SearchResponse<T> | null>(null);

  // Get index
  const index = useMemo(() => {
    const meilisearch = new MeiliSearch({
      host,
      apiKey,
    });
    return meilisearch.index<T>(indexName);
  }, [host, apiKey, indexName]);

  // Get search response
  const search = useCallback(async () => {
    if (query === "") {
      return;
    }
    try {
      const response = await index.search<T>(query, params);
      setResponse(response);
      trackGoal(FATHOM_SEARCH_PERFORMED_EVT_ID, 0)
    } catch (e) {
      console.error(`Search for query "${query}" failed (${e})`);
    }
  }, [query]);

  // Perform search
  useEffect(() => {
    if (query === "") {
      return;
    }
    search();
  }, [query, search]);

  // Debounce query input
  useEffect(() => {
    const debouncedFn = setTimeout(() => setQuery(rawInput), debounceMs);
    return () => clearTimeout(debouncedFn);
  }, [rawInput, debounceMs]);

  return {
    query: rawInput,
    clearResponse: () => {
      setQuery("");
      setRawInput("");
      setResponse(null);
    },
    setQuery: setRawInput,
    response,
  };
};
