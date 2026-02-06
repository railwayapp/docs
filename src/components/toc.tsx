import { cn } from "@/lib/cn";
import {
  type MotionValue,
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import * as React from "react";

// ============================================================================
// Types
// ============================================================================

export interface TOCItemType {
  /** The title/text of the heading */
  title: string;
  /** The URL/anchor (e.g., "#section-1") */
  url: string;
  /** The depth/level of the heading (2 = h2, 3 = h3, etc.) */
  depth: number;
}

// ============================================================================
// Constants
// ============================================================================

const CORNER_RADIUS = 4;
const ITEM_OFFSET_BASE = 16;
const ITEM_OFFSET_L3 = 28;
const ITEM_OFFSET_L4 = 40;
const ANIMATION_DURATION = 150;

const ANIMATION_CONFIG = {
  duration: ANIMATION_DURATION / 1000,
  ease: [0, 0, 0.58, 1] as [number, number, number, number],
};

// ============================================================================
// Context for TOC items and active state
// ============================================================================

interface TOCContextType {
  items: TOCItemType[];
  activeAnchor: string | null;
  setActiveAnchor: (anchor: string | null) => void;
}

const TOCContext = React.createContext<TOCContextType | null>(null);

// ============================================================================
// Exported hooks
// ============================================================================

/**
 * Hook to get all TOC items from context
 */
export function useTOCItems(): TOCItemType[] {
  const context = React.useContext(TOCContext);
  return context?.items ?? [];
}

/**
 * Hook to get the currently active anchor
 */
export function useActiveAnchor(): string | null {
  const context = React.useContext(TOCContext);
  return context?.activeAnchor ?? null;
}

// ============================================================================
// Exported TOCProvider for external use (e.g., InlineTOC)
// ============================================================================

export interface TOCProviderProps {
  children: React.ReactNode;
  items: TOCItemType[];
}

/**
 * Provider component that can wrap components that need access to TOC context
 * Use this when you need to share TOC state between components like InlineTOC
 */
export function TOCProvider({ children, items }: TOCProviderProps) {
  const [activeAnchor, setActiveAnchor] = React.useState<string | null>(null);

  // Store heading elements ref
  const headingElementsRef = React.useRef<HTMLElement[]>([]);

  // Initialize heading elements after hydration
  React.useEffect(() => {
    // Small delay to ensure DOM is fully hydrated
    const timeoutId = setTimeout(() => {
      headingElementsRef.current = items
        .map(item => {
          const id = item.url.startsWith("#") ? item.url.slice(1) : item.url;
          return document.getElementById(id);
        })
        .filter(Boolean) as HTMLElement[];

      // Set initial active heading
      if (headingElementsRef.current.length > 0) {
        setActiveAnchor(headingElementsRef.current[0].id);
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [items]);

  // Use Motion's useScroll for scroll tracking
  const { scrollY } = useScroll();

  // Threshold: heading is "active" when its top is at or above this value
  const ACTIVATION_THRESHOLD = 100;

  // Track scroll and update active heading
  useMotionValueEvent(scrollY, "change", latest => {
    const headingElements = headingElementsRef.current;
    if (headingElements.length === 0) return;

    // Find the last heading that has scrolled past the activation threshold
    let activeId: string | null = null;

    for (const heading of headingElements) {
      const rect = heading.getBoundingClientRect();
      if (rect.top <= ACTIVATION_THRESHOLD) {
        activeId = heading.id;
      } else {
        break;
      }
    }

    // If no heading has scrolled past threshold, default to first heading
    if (activeId === null) {
      activeId = headingElements[0].id;
    }

    // Update state
    setActiveAnchor(activeId);
  });

  const value = React.useMemo(
    () => ({ items, activeAnchor, setActiveAnchor }),
    [items, activeAnchor],
  );

  return <TOCContext.Provider value={value}>{children}</TOCContext.Provider>;
}

// ============================================================================
// SVG Path Utilities
// ============================================================================

interface PathSegment {
  offset: number;
  top: number;
  bottom: number;
}

interface TocSvgData {
  path: string;
  width: number;
  height: number;
  endX: number;
  endY: number;
  segments: PathSegment[];
}

function getLineOffset(depth: number): number {
  if (depth <= 2) return 3; // offset to prevent circle clipping
  if (depth === 3) return 10;
  return 20; // h4 and deeper
}

function getItemOffset(depth: number): number {
  if (depth <= 2) return ITEM_OFFSET_BASE;
  if (depth === 3) return ITEM_OFFSET_L3;
  return ITEM_OFFSET_L4;
}

function buildSvgPath(segments: PathSegment[]): string {
  const d: string[] = [];

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const prevSeg = segments[i - 1];
    const nextSeg = segments[i + 1];

    if (i === 0) {
      d.push(`M${seg.offset} ${seg.top}`);
    } else if (prevSeg && seg.offset !== prevSeg.offset) {
      d.push(
        `Q${seg.offset} ${seg.top},${seg.offset} ${seg.top + CORNER_RADIUS}`,
      );
    } else {
      d.push(`L${seg.offset} ${seg.top}`);
    }

    if (nextSeg && seg.offset !== nextSeg.offset) {
      const cornerBottom = seg.bottom;
      d.push(`L${seg.offset} ${cornerBottom - CORNER_RADIUS}`);
      const nextTop = nextSeg.top;
      const dx = nextSeg.offset - seg.offset;
      const dy = nextTop - cornerBottom;
      const diagLength = Math.sqrt(dx * dx + dy * dy);
      const ratio = Math.min(CORNER_RADIUS / diagLength, 0.5);
      const midX = seg.offset + dx * ratio;
      const midY = cornerBottom + dy * ratio;
      d.push(`Q${seg.offset} ${cornerBottom},${midX} ${midY}`);
      const endRatio = 1 - Math.min(CORNER_RADIUS / diagLength, 0.5);
      const endX = seg.offset + dx * endRatio;
      const endY = cornerBottom + dy * endRatio;
      d.push(`L${endX} ${endY}`);
    } else {
      d.push(`L${seg.offset} ${seg.bottom}`);
    }
  }

  return d.join(" ");
}

/**
 * Get the X position of the circle along the path for a given Y position
 */
function getCircleX(segments: PathSegment[], y: number): number {
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const nextSeg = segments[i + 1];

    // If Y is within this segment's vertical range
    if (y >= seg.top && y <= seg.bottom) {
      return seg.offset;
    }

    // If Y is in the transition between segments (curved part)
    if (nextSeg && y > seg.bottom && y < nextSeg.top) {
      const t = (y - seg.bottom) / (nextSeg.top - seg.bottom);
      return seg.offset + t * (nextSeg.offset - seg.offset);
    }
  }

  // Default to last segment's offset
  return segments[segments.length - 1]?.offset ?? 1;
}

// ============================================================================
// Hook to compute SVG data with segments
// ============================================================================

function useTocSvg(
  containerRef: React.RefObject<HTMLElement | null>,
  items: TOCItemType[],
): TocSvgData | null {
  const [svg, setSvg] = React.useState<TocSvgData | null>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function compute() {
      if (!container || container.clientHeight === 0) return;

      let w = 0;
      let h = 0;
      const segments: PathSegment[] = [];

      for (let i = 0; i < items.length; i++) {
        const element = container.querySelector<HTMLElement>(
          `a[href="${items[i].url}"]`,
        );
        if (!element) continue;

        const styles = getComputedStyle(element);
        const offset = getLineOffset(items[i].depth) + 1;
        const top = element.offsetTop + parseFloat(styles.paddingTop);
        const paddingBottom = parseFloat(styles.paddingBottom);

        // For the last item, end at the center of the content
        const isLastItem = i === items.length - 1;
        const paddingTop = parseFloat(styles.paddingTop);
        const contentHeight = element.clientHeight - paddingTop - paddingBottom;
        const bottom = isLastItem
          ? element.offsetTop + paddingTop + contentHeight / 2
          : element.offsetTop + element.clientHeight - paddingBottom;

        w = Math.max(offset, w);
        h = Math.max(h, bottom);
        segments.push({ offset, top, bottom });
      }

      const path = buildSvgPath(segments);
      const lastSeg = segments[segments.length - 1];

      setSvg({
        path,
        width: w + 1,
        height: h,
        endX: lastSeg?.offset ?? 1,
        endY: lastSeg?.bottom ?? h,
        segments,
      });
    }

    const observer = new ResizeObserver(compute);
    compute();
    observer.observe(container);

    return () => observer.disconnect();
  }, [containerRef, items]);

  return svg;
}

// ============================================================================
// Thumb Position Calculation (returns top, height, and bottomY for circle)
// ============================================================================

function calcThumbPosition(
  container: HTMLElement,
  activeAnchor: string | null,
  items: TOCItemType[],
): [top: number, height: number, bottomY: number, activeIndex: number] {
  if (!activeAnchor || container.clientHeight === 0) {
    return [0, 0, 0, -1];
  }

  const activeIndex = items.findIndex(t => t.url === `#${activeAnchor}`);
  if (activeIndex === -1) return [0, 0, 0, -1];

  // Get the first element for the top position
  const firstElement = container.querySelector<HTMLElement>(
    `a[href="${items[0].url}"]`,
  );
  if (!firstElement) return [0, 0, 0, activeIndex];

  const firstStyles = getComputedStyle(firstElement);
  const lineStart = firstElement.offsetTop + parseFloat(firstStyles.paddingTop);

  // Get the active element for the bottom position
  const activeElement = container.querySelector<HTMLElement>(
    `a[href="#${activeAnchor}"]`,
  );
  if (!activeElement) return [lineStart, 0, lineStart, activeIndex];

  const activeStyles = getComputedStyle(activeElement);
  const paddingTop = parseFloat(activeStyles.paddingTop);
  const paddingBottom = parseFloat(activeStyles.paddingBottom);
  const contentHeight = activeElement.clientHeight - paddingTop - paddingBottom;
  const activeCenter = activeElement.offsetTop + paddingTop + contentHeight / 2;

  return [lineStart, activeCenter - lineStart, activeCenter, activeIndex];
}

// ============================================================================
// Motion-based Thumb Position Updater
// ============================================================================

interface ThumbPositionUpdaterProps {
  containerRef: React.RefObject<HTMLElement | null>;
  thumbHeight: MotionValue<number>;
  thumbTop: MotionValue<number>;
  circleY: MotionValue<number>;
  circleOpacity: MotionValue<number>;
  items: TOCItemType[];
  activeAnchor: string | null;
  segments: PathSegment[];
}

function ThumbPositionUpdater({
  containerRef,
  thumbHeight,
  thumbTop,
  circleY,
  circleOpacity,
  items,
  activeAnchor,
  segments,
}: ThumbPositionUpdaterProps) {
  const isInitialized = React.useRef(false);
  const prevActiveAnchor = React.useRef<string | null>(null);

  const updatePosition = React.useCallback(
    (skipAnimation = false) => {
      if (!containerRef.current) return;

      const [top, height, bottomY] = calcThumbPosition(
        containerRef.current,
        activeAnchor,
        items,
      );

      thumbTop.set(top);

      if (!isInitialized.current || skipAnimation) {
        if (height > 0 && segments.length > 0) {
          thumbHeight.set(height);
          circleY.set(bottomY);
          circleOpacity.set(1);
          isInitialized.current = true;
        }
        return;
      }

      animate(thumbHeight, height, ANIMATION_CONFIG);
      animate(circleY, bottomY, ANIMATION_CONFIG);
    },
    [
      containerRef,
      activeAnchor,
      items,
      segments,
      thumbTop,
      thumbHeight,
      circleY,
      circleOpacity,
    ],
  );

  // Update on resize
  React.useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const observer = new ResizeObserver(() => updatePosition(true));
    observer.observe(container);

    return () => observer.disconnect();
  }, [containerRef, updatePosition]);

  // Update when active anchor changes
  React.useEffect(() => {
    if (prevActiveAnchor.current !== activeAnchor) {
      updatePosition(false);
      prevActiveAnchor.current = activeAnchor;
    }
  }, [activeAnchor, updatePosition]);

  // Initial update
  React.useEffect(() => {
    updatePosition(true);
  }, [updatePosition]);

  return null;
}

// ============================================================================
// Motion Thumb Component
// ============================================================================

interface TocThumbProps {
  className?: string;
  height: MotionValue<number>;
  top: MotionValue<number>;
}

function TocThumb({ className, height, top }: TocThumbProps) {
  return (
    <motion.div
      role="none"
      className={cn("bg-primary-solid", className)}
      style={{ height, y: top }}
    />
  );
}

// ============================================================================
// Circle Indicator Component
// ============================================================================

interface TocCircleProps {
  circleX: MotionValue<number>;
  circleY: MotionValue<number>;
  opacity: MotionValue<number>;
}

function TocCircle({ circleX, circleY, opacity }: TocCircleProps) {
  return (
    <motion.div
      role="none"
      aria-hidden="true"
      className="bg-primary-solid pointer-events-none absolute size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{ left: circleX, top: circleY, opacity }}
    />
  );
}

// ============================================================================
// TOC Item Link Component (exported for custom use)
// ============================================================================

interface TOCItemProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
}

export const TOCItem = React.forwardRef<HTMLAnchorElement, TOCItemProps>(
  function TOCItem({ href, className, children, ...props }, ref) {
    const context = React.useContext(TOCContext);
    const isActive = context?.activeAnchor === href.slice(1);

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Use getElementById to avoid CSS selector issues with IDs starting with numbers
      const id = href.startsWith("#") ? href.slice(1) : href;
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", href);
      }
      props.onClick?.(e);
    };

    return (
      <a
        ref={ref}
        href={href}
        data-active={isActive}
        onClick={handleClick}
        className={className}
        {...props}
      >
        {children}
      </a>
    );
  },
);

// ============================================================================
// Internal TOC Item for the visual TOC
// ============================================================================

interface TOCItemLinkProps {
  item: TOCItemType;
  isActive: boolean;
}

function TOCItemLink({ item, isActive }: TOCItemLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Use getElementById to avoid CSS selector issues with IDs starting with numbers
    const id = item.url.startsWith("#") ? item.url.slice(1) : item.url;
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", item.url);
    }
  };

  return (
    <a
      href={item.url}
      onClick={handleClick}
      style={{
        paddingInlineStart: getItemOffset(item.depth),
      }}
      className={cn(
        "relative block py-1.5 text-sm transition-colors duration-150 ease-out",
        "text-muted-base hover:text-muted-high-contrast",
        "first:pt-0 last:pb-0",
        "truncate",
        isActive && "text-muted-high-contrast",
      )}
      title={item.title}
    >
      {item.title}
    </a>
  );
}

// ============================================================================
// Main TOC Component
// ============================================================================

export interface TOCProps {
  /** Array of heading items to display */
  items: TOCItemType[];
  /** Additional class name for the container */
  className?: string;
}

export function TOC({ items, className }: TOCProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Check if we have a parent TOCProvider context
  const parentContext = React.useContext(TOCContext);
  const hasParentProvider = parentContext !== null;

  // Only create local state if no parent provider exists
  const [localActiveAnchor, setLocalActiveAnchor] = React.useState<
    string | null
  >(null);

  // Use parent context if available, otherwise use local state
  const activeAnchor = hasParentProvider
    ? parentContext.activeAnchor
    : localActiveAnchor;
  const setActiveAnchor = hasParentProvider
    ? parentContext.setActiveAnchor
    : setLocalActiveAnchor;

  // Motion values for animations
  const thumbHeight = useMotionValue(0);
  const thumbTop = useMotionValue(0);
  const circleY = useMotionValue(0);
  const circleOpacity = useMotionValue(0);

  // Store segments ref for circle X calculation
  const segmentsRef = React.useRef<PathSegment[]>([]);

  // Store heading elements ref (only used when no parent provider)
  const headingElementsRef = React.useRef<HTMLElement[]>([]);

  // Initialize heading elements after hydration (only if no parent provider)
  React.useEffect(() => {
    if (hasParentProvider) return;

    const timeoutId = setTimeout(() => {
      headingElementsRef.current = items
        .map(item => {
          const id = item.url.startsWith("#") ? item.url.slice(1) : item.url;
          return document.getElementById(id);
        })
        .filter(Boolean) as HTMLElement[];

      if (headingElementsRef.current.length > 0) {
        setActiveAnchor(headingElementsRef.current[0].id);
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [items, hasParentProvider, setActiveAnchor]);

  // Use Motion's useScroll for tracking (only if no parent provider)
  const { scrollY } = useScroll();
  const ACTIVATION_THRESHOLD = 100;

  useMotionValueEvent(scrollY, "change", latest => {
    if (hasParentProvider) return;

    const headingElements = headingElementsRef.current;
    if (headingElements.length === 0) return;

    let activeId: string | null = null;
    for (const heading of headingElements) {
      const rect = heading.getBoundingClientRect();
      if (rect.top <= ACTIVATION_THRESHOLD) {
        activeId = heading.id;
      } else {
        break;
      }
    }

    if (activeId === null) {
      activeId = headingElements[0].id;
    }

    setActiveAnchor(activeId);
  });

  // Auto-scroll active item into view within the TOC
  React.useEffect(() => {
    if (!activeAnchor || !scrollContainerRef.current) return;

    const activeElement = scrollContainerRef.current.querySelector<HTMLElement>(
      `a[href="#${activeAnchor}"]`,
    );

    activeElement?.scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    });
  }, [activeAnchor]);

  // Track scroll position for fade indicators
  const [scrollState, setScrollState] = React.useState({
    canScrollUp: false,
    canScrollDown: false,
  });

  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const updateScrollState = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      setScrollState({
        canScrollUp: scrollTop > 0,
        canScrollDown: scrollTop + clientHeight < scrollHeight - 1,
      });
    };

    updateScrollState();
    container.addEventListener("scroll", updateScrollState);

    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener("scroll", updateScrollState);
      resizeObserver.disconnect();
    };
  }, []);

  const svg = useTocSvg(containerRef, items);

  // Update segments ref when svg changes
  React.useEffect(() => {
    segmentsRef.current = svg?.segments ?? [];
  }, [svg]);

  // Calculate circle X position based on Y
  const circleX = useTransform(circleY, y =>
    getCircleX(segmentsRef.current, y),
  );

  // Provide context for child components (only used when no parent provider)
  const contextValue = React.useMemo(
    () => ({
      items,
      activeAnchor,
      setActiveAnchor,
    }),
    [items, activeAnchor, setActiveAnchor],
  );

  if (items.length === 0) {
    return null;
  }

  const tocContent = (
    <div className={cn("w-full", className)} data-slot="toc">
      <h3 className="text-muted-base mb-4 text-sm font-medium">On this page</h3>
      <ThumbPositionUpdater
        containerRef={containerRef}
        thumbHeight={thumbHeight}
        thumbTop={thumbTop}
        circleY={circleY}
        circleOpacity={circleOpacity}
        items={items}
        activeAnchor={activeAnchor}
        segments={svg?.segments ?? []}
      />
      <nav
        aria-label="Table of contents"
        className="relative min-h-0 overflow-hidden ps-0.5"
      >
        {/* Top fade indicator */}
        <div
          className={cn(
            "from-muted-app pointer-events-none absolute inset-x-0 top-0 z-10 h-6 bg-gradient-to-b to-transparent transition-opacity duration-150",
            scrollState.canScrollUp ? "opacity-100" : "opacity-0",
          )}
          aria-hidden="true"
        />

        {/* Scrollable container for TOC content */}
        <div
          ref={scrollContainerRef}
          className="relative max-h-[640px] overflow-y-auto"
        >
          {/* Background SVG path */}
          {svg && (
            <svg
              className="absolute start-0 top-0 rtl:-scale-x-100"
              width={svg.width + 3}
              height={svg.height + 3}
              aria-hidden="true"
            >
              <path
                d={svg.path}
                className="stroke-muted"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          )}

          {/* Animated fill thumb (masked to SVG path) */}
          {svg && (
            <div
              className="absolute start-0 top-0 rtl:-scale-x-100"
              style={{
                width: svg.width,
                height: svg.height,
                maskImage: `url("data:image/svg+xml,${encodeURIComponent(
                  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svg.width} ${svg.height}"><path d="${svg.path}" stroke="black" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" fill="none" /></svg>`,
                )}")`,
              }}
              aria-hidden="true"
            >
              <TocThumb height={thumbHeight} top={thumbTop} />
            </div>
          )}

          {/* TOC items */}
          <div ref={containerRef} className="flex flex-col pb-1">
            {items.map(item => (
              <TOCItemLink
                key={item.url}
                item={item}
                isActive={activeAnchor === item.url.slice(1)}
              />
            ))}
          </div>

          {/* End circle (static, at end of path) */}
          {svg && (
            <div
              className="bg-muted pointer-events-none absolute size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ left: svg.endX, top: svg.endY }}
              aria-hidden="true"
            />
          )}

          {/* Animated circle indicator */}
          <TocCircle
            circleX={circleX}
            circleY={circleY}
            opacity={circleOpacity}
          />
        </div>

        {/* Bottom fade indicator */}
        <div
          className={cn(
            "from-muted-app pointer-events-none absolute inset-x-0 bottom-0 z-10 h-6 bg-gradient-to-t to-transparent transition-opacity duration-150",
            scrollState.canScrollDown ? "opacity-100" : "opacity-0",
          )}
          aria-hidden="true"
        />
      </nav>
    </div>
  );

  // Only wrap in provider if no parent provider exists
  return hasParentProvider ? (
    tocContent
  ) : (
    <TOCContext.Provider value={contextValue}>{tocContent}</TOCContext.Provider>
  );
}
