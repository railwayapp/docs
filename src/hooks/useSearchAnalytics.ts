import posthog from "posthog-js";
import { useCallback, useRef, useMemo } from "react";
import { POSTHOG_SESSION_ID_KEY } from "./usePostHog";

/**
 * Search Analytics Events
 *
 * This hook tracks the following search metrics:
 * - Total searches: Total number of searches made
 * - Total users: Number of unique users who performed searches
 * - No result rate: Percentage of searches with no results
 * - Click-through rate: Ratio of result clicks to result impressions
 * - Average click position: Average position of clicked results
 * - Search requests: Total search request count
 * - Searches without results: Common queries with no results
 * - Most searched queries: Most common search terms
 */

// Event names for PostHog
export const SEARCH_EVENTS = {
  SEARCH_PERFORMED: "docs_search_performed",
  SEARCH_RESULT_CLICKED: "docs_search_result_clicked",
  SEARCH_NO_RESULTS: "docs_search_no_results",
  SEARCH_RESULT_IMPRESSION: "docs_search_result_impression",
  SEARCH_MODAL_OPENED: "docs_search_modal_opened",
  SEARCH_MODAL_CLOSED: "docs_search_modal_closed",
} as const;

export interface SearchResultClickData {
  query: string;
  resultUrl: string;
  resultTitle: string;
  position: number;
  totalResults: number;
}

export interface SearchPerformedData {
  query: string;
  resultCount: number;
  searchDurationMs: number;
}

export interface SearchImpressionData {
  query: string;
  resultUrls: string[];
  totalResults: number;
}

/**
 * Get a stable user identifier for analytics
 */
function getUserId(): string | null {
  if (typeof window === "undefined") return null;

  try {
    const sessionId = localStorage.getItem(POSTHOG_SESSION_ID_KEY);
    if (sessionId) return sessionId;

    // Fall back to PostHog distinct ID if available
    if (posthog.get_distinct_id) {
      return posthog.get_distinct_id();
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Hook for tracking search analytics in PostHog
 */
export function useSearchAnalytics() {
  // Track when search was started for duration calculation
  const searchStartTimeRef = useRef<number | null>(null);

  // Generate a unique search session ID for correlating events
  const searchSessionId = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `search_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }, []);

  /**
   * Track when the search modal is opened
   */
  const trackSearchModalOpened = useCallback(() => {
    if (typeof window === "undefined") return;

    posthog.capture(SEARCH_EVENTS.SEARCH_MODAL_OPENED, {
      userId: getUserId(),
      timestamp: new Date().toISOString(),
      searchSessionId,
    });

    // Start timing the search session
    searchStartTimeRef.current = Date.now();
  }, [searchSessionId]);

  /**
   * Track when the search modal is closed
   */
  const trackSearchModalClosed = useCallback(
    (query: string, hadResults: boolean) => {
      if (typeof window === "undefined") return;

      const sessionDuration = searchStartTimeRef.current
        ? Date.now() - searchStartTimeRef.current
        : null;

      posthog.capture(SEARCH_EVENTS.SEARCH_MODAL_CLOSED, {
        userId: getUserId(),
        query: query || "",
        hadResults,
        sessionDurationMs: sessionDuration,
        searchSessionId,
        timestamp: new Date().toISOString(),
      });

      searchStartTimeRef.current = null;
    },
    [searchSessionId]
  );

  /**
   * Track a search query execution
   * This is the main event for tracking search usage
   */
  const trackSearchPerformed = useCallback(
    (data: SearchPerformedData) => {
      if (typeof window === "undefined") return;

      const { query, resultCount, searchDurationMs } = data;

      // Track the main search event
      posthog.capture(SEARCH_EVENTS.SEARCH_PERFORMED, {
        userId: getUserId(),
        query,
        resultCount,
        searchDurationMs,
        hasResults: resultCount > 0,
        searchSessionId,
        timestamp: new Date().toISOString(),
        // Additional computed properties for PostHog analysis
        queryLength: query.length,
        queryWordCount: query.trim().split(/\s+/).length,
      });

      // Track no-result searches separately for easy analysis
      if (resultCount === 0) {
        posthog.capture(SEARCH_EVENTS.SEARCH_NO_RESULTS, {
          userId: getUserId(),
          query,
          searchSessionId,
          timestamp: new Date().toISOString(),
        });
      }
    },
    [searchSessionId]
  );

  /**
   * Track when search results are shown to user (impressions)
   * This is used to calculate click-through rate
   */
  const trackSearchResultImpression = useCallback(
    (data: SearchImpressionData) => {
      if (typeof window === "undefined") return;

      const { query, resultUrls, totalResults } = data;

      posthog.capture(SEARCH_EVENTS.SEARCH_RESULT_IMPRESSION, {
        userId: getUserId(),
        query,
        resultUrls,
        totalResults,
        impressionCount: resultUrls.length,
        searchSessionId,
        timestamp: new Date().toISOString(),
      });
    },
    [searchSessionId]
  );

  /**
   * Track when a user clicks on a search result
   * This is used for click-through rate and average click position
   */
  const trackSearchResultClick = useCallback(
    (data: SearchResultClickData) => {
      if (typeof window === "undefined") return;

      const { query, resultUrl, resultTitle, position, totalResults } = data;

      posthog.capture(SEARCH_EVENTS.SEARCH_RESULT_CLICKED, {
        userId: getUserId(),
        query,
        resultUrl,
        resultTitle,
        position, // 0-indexed position of the clicked result
        totalResults,
        searchSessionId,
        timestamp: new Date().toISOString(),
        // Computed metrics for PostHog
        clickPosition: position + 1, // 1-indexed for human readability
        isTopResult: position === 0,
        isTopThree: position < 3,
      });
    },
    [searchSessionId]
  );

  return {
    trackSearchModalOpened,
    trackSearchModalClosed,
    trackSearchPerformed,
    trackSearchResultImpression,
    trackSearchResultClick,
  };
}

/**
 * Helper function to calculate search metrics from PostHog data
 * These calculations can be done in PostHog dashboards using HogQL
 *
 * Example HogQL queries for dashboards:
 *
 * Total Searches:
 *   SELECT count(*) FROM events WHERE event = 'docs_search_performed'
 *
 * Total Users:
 *   SELECT count(DISTINCT distinct_id) FROM events WHERE event = 'docs_search_performed'
 *
 * No Result Rate:
 *   SELECT
 *     countIf(properties.resultCount = 0) * 100.0 / count(*) as no_result_rate
 *   FROM events
 *   WHERE event = 'docs_search_performed'
 *
 * Click-Through Rate:
 *   WITH
 *     clicks AS (SELECT count(*) as click_count FROM events WHERE event = 'docs_search_result_clicked'),
 *     impressions AS (SELECT sum(properties.impressionCount) as impression_count FROM events WHERE event = 'docs_search_result_impression')
 *   SELECT clicks.click_count * 100.0 / impressions.impression_count as ctr
 *   FROM clicks, impressions
 *
 * Average Click Position:
 *   SELECT avg(properties.clickPosition) FROM events WHERE event = 'docs_search_result_clicked'
 *
 * Most Searched Queries:
 *   SELECT properties.query, count(*) as search_count
 *   FROM events
 *   WHERE event = 'docs_search_performed'
 *   GROUP BY properties.query
 *   ORDER BY search_count DESC
 *   LIMIT 20
 *
 * Searches Without Results:
 *   SELECT properties.query, count(*) as search_count
 *   FROM events
 *   WHERE event = 'docs_search_no_results'
 *   GROUP BY properties.query
 *   ORDER BY search_count DESC
 *   LIMIT 20
 */
export const POSTHOG_DASHBOARD_QUERIES = {
  totalSearches: `SELECT count(*) FROM events WHERE event = 'docs_search_performed'`,
  totalUsers: `SELECT count(DISTINCT distinct_id) FROM events WHERE event = 'docs_search_performed'`,
  noResultRate: `SELECT countIf(properties.resultCount = 0) * 100.0 / count(*) as no_result_rate FROM events WHERE event = 'docs_search_performed'`,
  avgClickPosition: `SELECT avg(properties.clickPosition) FROM events WHERE event = 'docs_search_result_clicked'`,
  mostSearchedQueries: `SELECT properties.query, count(*) as search_count FROM events WHERE event = 'docs_search_performed' GROUP BY properties.query ORDER BY search_count DESC LIMIT 20`,
  searchesWithoutResults: `SELECT properties.query, count(*) as search_count FROM events WHERE event = 'docs_search_no_results' GROUP BY properties.query ORDER BY search_count DESC LIMIT 20`,
};
