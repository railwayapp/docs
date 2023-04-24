import { Index, MeiliSearch } from "meilisearch";
import { useMemo } from "react";

export const useSearchIndex = <T extends Record<string, any>>(
  host: string,
  apiKey: string,
  indexName: string,
): Index<T> => {
  if (host === "") {
    console.error(`useSearchIndex.host not provided`);
  }
  if (apiKey === "") {
    console.error(`useSearchIndex.apiKey not provided`);
  }
  if (indexName === "") {
    console.error(`useSearchIndex.indexName not provided`);
  }
  return useMemo(() => {
    const meilisearch = new MeiliSearch({
      host,
      apiKey,
    });
    return meilisearch.index<T>(indexName);
  }, [apiKey, host, indexName]);
};
