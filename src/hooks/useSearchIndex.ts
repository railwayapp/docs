import { Index, MeiliSearch } from "meilisearch";
import { useMemo } from "react";

export const useSearchIndex = (
  host: string,
  apiKey: string,
  indexName: string,
): Index => {
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
    const index = meilisearch.index(indexName);
    return index;
  }, [apiKey, host, indexName]);
};
