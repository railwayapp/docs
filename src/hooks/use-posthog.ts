import posthog from "posthog-js";
import { useRouter } from "next/router";
import { useEffect } from "react";

// Define constant for localStorage key
export const POSTHOG_SESSION_ID_KEY = "railway_posthog_session_id";

export const usePostHog = (apiKey: string, hostUrl: string) => {
  const router = useRouter();

  useEffect(() => {
    // Only initialize PostHog in production
    if (process.env.NODE_ENV === "production" && apiKey) {
      try {
        // Check for existing session ID in localStorage
        const existingSessionId = localStorage.getItem(POSTHOG_SESSION_ID_KEY);

        // Initialize PostHog
        posthog.init(apiKey, {
          api_host: hostUrl,
          loaded: ph => {
            // If we have an existing session ID and it differs from the current one, set it
            if (
              existingSessionId &&
              ph.get_distinct_id() !== existingSessionId
            ) {
              ph.identify(existingSessionId);
            } else if (!existingSessionId) {
              // Store the new session ID
              localStorage.setItem(
                POSTHOG_SESSION_ID_KEY,
                ph.get_distinct_id(),
              );
            }
          },
          capture_pageview: false,
        });

        // Track page views when route changes
        const onRouteChangeComplete = () => {
          posthog.capture("$pageview");
        };

        router.events.on("routeChangeComplete", onRouteChangeComplete);

        // Cleanup function
        return () => {
          router.events.off("routeChangeComplete", onRouteChangeComplete);
          // Optionally flush any queued events before unmounting
          posthog.capture("$pageleave");
        };
      } catch (error) {
        console.error("Error initializing PostHog:", error);
      }
    }

    // Return empty cleanup function if not initialized
    return () => {};
  }, [apiKey, hostUrl, router.events]);
};
