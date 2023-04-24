import { Index, SearchParams, SearchResponse } from "meilisearch";
import { useCallback, useEffect, useState } from "react";

export const useDebouncedSearch = <R extends Record<string, any>>(
  index: Index,
  params: SearchParams,
  debounceMs: number = 500,
) => {
  // Controlled input for rendering
  const [rawInput, setRawInput] = useState("");
  // Actual query from input that gets sent in search requests
  const [query, setQuery] = useState("");

  const [response, setResponse] = useState<SearchResponse<R> | null>(null);

  useEffect(() => {
    const debouncedFn = setTimeout(() => setQuery(rawInput), debounceMs);
    return () => clearTimeout(debouncedFn);
  }, [rawInput, debounceMs]);

  const search = useCallback(async () => {
    if (query === "") {
      return;
    }
    try {
      const response = await index.search<R>(query, params);
      setResponse(response);
    } catch (e) {
      console.error(`Search for query "${query}" failed (${e})`);
    }
  }, [query]);

  useEffect(() => {
    if (query === "") {
      return;
    }
    search();
  }, [query, search]);

  return {
    query: rawInput,
    setQuery: setRawInput,
    response,
  };
};
