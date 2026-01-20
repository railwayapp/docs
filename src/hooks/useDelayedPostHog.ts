import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

export const POSTHOG_SESSION_ID_KEY = "railway_posthog_session_id";

export const useDelayedPostHog = (apiKey: string, hostUrl: string) => {
  const router = useRouter();
  const posthogRef = useRef<typeof import("posthog-js").default | null>(null);
  const isInitializedRef = useRef(false);
  const pendingPageviewsRef = useRef<string[]>([]);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !apiKey) {
      return;
    }

    const initPostHog = async () => {
      if (isInitializedRef.current) return;
      isInitializedRef.current = true;

      try {
        const posthog = (await import("posthog-js")).default;
        posthogRef.current = posthog;

        const existingSessionId = localStorage.getItem(POSTHOG_SESSION_ID_KEY);

        posthog.init(apiKey, {
          api_host: hostUrl,
          loaded: ph => {
            if (
              existingSessionId &&
              ph.get_distinct_id() !== existingSessionId
            ) {
              ph.identify(existingSessionId);
            } else if (!existingSessionId) {
              localStorage.setItem(
                POSTHOG_SESSION_ID_KEY,
                ph.get_distinct_id(),
              );
            }
          },
          capture_pageview: false,
        });

        // Track the initial pageview
        posthog.capture("$pageview");

        // Track any pending pageviews that happened before initialization
        pendingPageviewsRef.current.forEach(() => {
          posthog.capture("$pageview");
        });
        pendingPageviewsRef.current = [];
      } catch (error) {
        console.error("Error initializing PostHog:", error);
      }
    };

    // Delay initialization by 3 seconds or on user interaction
    const timeoutId = setTimeout(initPostHog, 3000);

    const handleInteraction = () => {
      clearTimeout(timeoutId);
      initPostHog();
    };

    window.addEventListener("scroll", handleInteraction, { once: true, passive: true });
    window.addEventListener("click", handleInteraction, { once: true });
    window.addEventListener("keypress", handleInteraction, { once: true });

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("scroll", handleInteraction);
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("keypress", handleInteraction);
    };
  }, [apiKey, hostUrl]);

  // Handle route changes
  useEffect(() => {
    const onRouteChangeComplete = () => {
      if (posthogRef.current) {
        posthogRef.current.capture("$pageview");
      } else {
        // Queue pageview if PostHog isn't initialized yet
        pendingPageviewsRef.current.push(router.asPath);
      }
    };

    router.events.on("routeChangeComplete", onRouteChangeComplete);

    return () => {
      router.events.off("routeChangeComplete", onRouteChangeComplete);
      if (posthogRef.current) {
        posthogRef.current.capture("$pageleave");
      }
    };
  }, [router.events, router.asPath]);
};
