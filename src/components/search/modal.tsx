import { useDebouncedSearch } from "@/hooks/use-debounced-search";
import { LoadingIndicator } from "@/components/loading-indicator";
import { Link } from "@/components/link";
import { Search } from "@/types";
import { Markup } from "interweave";
import { cn } from "@/lib/cn";
import React, { useEffect, useRef } from "react";
import { useSearchAnalytics } from "@/hooks/use-search-analytics";
import { useRouter } from "next/router";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
} from "@/components/command";
import { Icon } from "@/components/icon";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const cleanSlug = (slug: string) => {
  // Handle relative URLs (paths without protocol)
  if (!slug.startsWith("http://") && !slug.startsWith("https://")) {
    return slug.replace("#__next", "");
  }
  try {
    const url = new URL(slug);
    const { hash, pathname } = url;
    return `${pathname}${hash}`.replace("#__next", "");
  } catch {
    return slug.replace("#__next", "");
  }
};

const SearchModal: React.FC<Props> = ({ open, onOpenChange }) => {
  const router = useRouter();
  const [inputValue, setInputValue] = React.useState("");

  const searchParams = {
    limit: 10,
    attributesToHighlight: ["*"],
    highlightPreTag: "<span>",
    highlightPostTag: "</span>",
  };
  const {
    clearResponse,
    isSearching,
    query,
    setQuery,
    results,
    searchDuration,
  } = useDebouncedSearch<Search.Document, Search.Result>(
    process.env.NEXT_PUBLIC_MEILISEARCH_HOST ?? "",
    process.env.NEXT_PUBLIC_MEILISEARCH_READ_API_KEY ?? "",
    process.env.NEXT_PUBLIC_MEILISEARCH_INDEX_NAME ?? "",
    searchParams,
    200,
  );

  // Sync input value to search query
  const handleValueChange = (value: string) => {
    setInputValue(value);
    setQuery(value);
  };

  // Clear input when modal closes
  useEffect(() => {
    if (!open) {
      setInputValue("");
      clearResponse();
    }
  }, [open, clearResponse]);

  // Analytics hooks
  const {
    trackSearchModalOpened,
    trackSearchModalClosed,
    trackSearchPerformed,
    trackSearchResultImpression,
    trackSearchResultClick,
  } = useSearchAnalytics();

  // Track when modal opens and closes
  const hasTrackedOpen = useRef(false);
  const wasOpen = useRef(false);

  useEffect(() => {
    // Track modal opened
    if (open && !hasTrackedOpen.current) {
      trackSearchModalOpened();
      hasTrackedOpen.current = true;
    }

    // Track modal closed (handles all close scenarios: Escape, click outside, result selection)
    if (!open && wasOpen.current) {
      const hasResults = results ? Object.keys(results).length > 0 : false;
      trackSearchModalClosed(query, hasResults);
      hasTrackedOpen.current = false;
    }

    wasOpen.current = open;
  }, [open, trackSearchModalOpened, trackSearchModalClosed, query, results]);

  // Track search results when they change
  const lastTrackedQuery = useRef<string>("");
  useEffect(() => {
    if (results && query && query !== lastTrackedQuery.current) {
      const resultCount = Object.values(results).flat().length;

      // Track the search event
      trackSearchPerformed({
        query,
        resultCount,
        searchDurationMs: searchDuration ?? 0,
      });

      // Track impressions for displayed results
      if (resultCount > 0) {
        const resultUrls = Object.values(results)
          .flat()
          .map(r => r.slug);
        trackSearchResultImpression({
          query,
          resultUrls,
          totalResults: resultCount,
        });
      }

      lastTrackedQuery.current = query;
    }
  }, [
    results,
    query,
    searchDuration,
    trackSearchPerformed,
    trackSearchResultImpression,
  ]);

  // Handle closing modal (analytics tracked via useEffect on open state change)
  const handleClose = () => {
    onOpenChange(false);
  };

  // Handle result selection
  const handleSelect = (
    slug: string,
    resultTitle: string,
    position: number,
  ) => {
    const totalResults = results ? Object.values(results).flat().length : 0;
    trackSearchResultClick({
      query,
      resultUrl: slug,
      resultTitle,
      position,
      totalResults,
    });
    handleClose();
    router.push(slug);
  };

  // Track global index for position tracking
  let globalIndex = -1;

  return (
    <Command
      className="w-full max-w-2xl overflow-hidden rounded-xl border border-muted bg-muted-app shadow-2xl"
      shouldFilter={false}
    >
      <CommandInput
        placeholder="Search documentation..."
        value={inputValue}
        onValueChange={handleValueChange}
        autoFocus
      />
      <CommandList>
        {isSearching && (
          <CommandLoading>
            <div className="flex items-center justify-center py-12">
              <LoadingIndicator />
            </div>
          </CommandLoading>
        )}

        {!isSearching && results && Object.keys(results).length === 0 && (
          <CommandEmpty>
            <NoResultsContent />
          </CommandEmpty>
        )}

        {!isSearching && !results && inputValue === "" && (
          <div className="px-4 py-8 text-center text-sm text-muted-base">
            Start typing to search the docs...
          </div>
        )}

        {!isSearching &&
          results &&
          Object.entries(results).map(([chapter, hits]) => {
            return (
              <CommandGroup
                key={chapter}
                heading={chapter === "null" ? hits[0]?.hierarchies[0] : chapter}
              >
                {hits.map(h => {
                  globalIndex++;
                  const currentIndex = globalIndex;
                  const slug = cleanSlug(h.slug);
                  const resultTitle =
                    h.hierarchies[h.hierarchies.length - 1] ||
                    h.hierarchies.join(" > ");

                  return (
                    <CommandItem
                      key={slug}
                      value={`${slug}-${currentIndex}`}
                      onSelect={() =>
                        handleSelect(slug, resultTitle, currentIndex)
                      }
                    >
                      <div className="flex flex-col gap-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 text-sm font-medium truncate text-muted-high-contrast group-data-[selected=true]:text-primary-high-contrast">
                          <svg
                            className="size-4 shrink-0 text-muted-base group-data-[selected=true]:text-primary-base"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                            />
                          </svg>
                          <span className="truncate">{resultTitle}</span>
                        </div>
                        {h.hierarchies.length > 1 && (
                          <div className="ml-6 text-xs truncate text-muted-base group-data-[selected=true]:text-primary-base">
                            {h.hierarchies.slice(0, -1).join(" → ")}
                          </div>
                        )}
                        {h.text !== "" && (
                          <p className="ml-6 text-sm leading-relaxed line-clamp-2 text-muted-base group-data-[selected=true]:text-primary-high-contrast/80 [&_.rendered_span]:rounded [&_.rendered_span]:bg-warning-element [&_.rendered_span]:px-0.5 [&_.rendered_span]:text-warning-high-contrast">
                            <Markup className="rendered" content={h.text} />
                          </p>
                        )}
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            );
          })}
      </CommandList>

      {/* Footer with keyboard shortcuts */}
      <div className="flex items-center justify-between gap-4 border-t border-muted px-4 py-2.5 text-xs text-muted-base">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <kbd className="rounded border border-muted bg-muted-element px-1.5 py-0.5 font-mono">
              ↑
            </kbd>
            <kbd className="rounded border border-muted bg-muted-element px-1.5 py-0.5 font-mono">
              ↓
            </kbd>
            <span>Navigate</span>
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="rounded border border-muted bg-muted-element px-1.5 py-0.5 font-mono">
              ↵
            </kbd>
            <span>Open</span>
          </span>
        </div>
        <span className="flex items-center gap-1.5">
          <kbd className="rounded border border-muted bg-muted-element px-1.5 py-0.5 font-mono">
            esc
          </kbd>
          <span>Close</span>
        </span>
      </div>
    </Command>
  );
};

// Inline NoResults content to avoid needing a separate component
const NoResultsContent: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <svg
        className="size-12 text-muted-base"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
        />
      </svg>
      <h3 className="mt-4 text-base font-semibold text-muted-high-contrast">
        No results found
      </h3>
      <p className="mt-1 text-sm text-muted-base">
        We couldn't find what you're looking for. Try a different search term.
      </p>
      <div className="mt-6">
        <p className="mb-3 text-sm text-muted-base">Need help?</p>
        <Link
          href="https://station.railway.com/"
          className="inline-flex items-center gap-2 rounded-lg border border-muted bg-muted-app px-4 py-2.5 text-sm font-medium text-muted-high-contrast shadow-xs transition-all hover:border-muted-hover hover:bg-muted-element"
        >
          <Icon name="Railway" className="size-5" />
          Railway Central Station
        </Link>
      </div>
    </div>
  );
};

export default SearchModal;
