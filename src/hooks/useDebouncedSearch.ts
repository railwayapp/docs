import { Search } from "@/types";
import { trackGoal } from "fathom-client";
import { MeiliSearch, SearchParams, SearchResponse } from "meilisearch";
import { useCallback, useEffect, useMemo, useState } from "react";

const FATHOM_SEARCH_PERFORMED_EVT_ID = "IMSTAYP4";

type Transformer<Source, Result extends any> = (
  src: SearchResponse<Source>,
) => Result;

/**
 * Default transformer for the document structure created by
 * https://github.com/meilisearch/docs-scraper.
 */
const defaultTransformResponse: Transformer<
  Search.Document,
  Search.Result
> = response => {
  const { hits } = response;
  const chapters = Array.from(new Set(hits.map(r => r.hierarchy_lvl0)));
  return chapters.reduce((acc, curr) => {
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
  }, {} as Search.Result);
};

/**
 * This hook provides functionality for searching a MeiliSearch index. It
 * exposes a `query` string and `setQuery` method for controlling an
 * <input /> element in a debounced manner, a `results` object containing
 * the search results, and a `clearResults` method for clearing search
 * results.
 *
 * It can also take in a `transformResponse` method for transforming the
 * raw response from Meilisearch into a structure you define.
 */
export const useDebouncedSearch = <
  Response extends Record<string, any>,
  Result,
>(
  host: string,
  apiKey: string,
  indexName: string,
  params: SearchParams,
  debounceMs: number = 500,
  transformResponse: Transformer<
    Response,
    Result
  > = defaultTransformResponse as Transformer<any, any>,
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

  const [results, setResults] = useState<Result | null>(null);

  // Get index
  const index = useMemo(() => {
    const meilisearch = new MeiliSearch({
      host,
      apiKey,
    });
    return meilisearch.index<Response>(indexName);
  }, [host, apiKey, indexName]);

  // Get search response
  const search = useCallback(async () => {
    if (query === "") {
      return;
    }
    try {
      const response = await index.search<Response>(query, params);
      trackGoal(FATHOM_SEARCH_PERFORMED_EVT_ID, 0);
      setResults(transformResponse(response));
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
      setResults(null);
    },
    setQuery: setRawInput,
    results,
  };
};
