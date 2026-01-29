/**
 * Frame Component
 *
 * Add visual emphasis with styled frames around images and other components.
 * Use frames to display images, diagrams, or other visual content with
 * consistent styling and optional captions. Frames center content and provide
 * visual separation from surrounding text.
 *
 * @example Basic Usage
 * ```tsx
 * <Frame>
 *   <img src="/path/image.jpg" alt="Descriptive alt text" />
 * </Frame>
 * ```
 *
 * @example Frame with Caption
 * ```tsx
 * <Frame caption="Yosemite National Park is visited by over 3.5 million people every year.">
 *   <img src="/path/image.jpg" alt="Descriptive alt text" />
 * </Frame>
 * ```
 *
 * @features
 * - Click to zoom into fullscreen lightbox view
 * - Smooth spring animations for zoom transitions
 * - Press Escape or click backdrop to close
 * - Optional caption text below the image (supports markdown links)
 * - Maintains aspect ratio during zoom
 * - Accessible with keyboard navigation
 */
import { cn } from "@/lib/cn";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { createPortal } from "react-dom";
import { Icon } from "./Icon";

/**
 * Parses a string for markdown-style links [text](url) and converts them to anchor elements.
 * If the input is already a React node, returns it as-is.
 */
function parseLinks(content: React.ReactNode): React.ReactNode {
  if (typeof content !== "string") {
    return content;
  }

  // Match markdown-style links: [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(content)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(content.slice(lastIndex, match.index));
    }

    // Add the link element
    const linkText = match[1];
    const linkUrl = match[2];
    parts.push(
      <a
        key={match.index}
        href={linkUrl}
        className="underline underline-offset-2 hover:opacity-70 transition-opacity"
        target={linkUrl.startsWith("http") ? "_blank" : undefined}
        rel={linkUrl.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {linkText}
      </a>
    );

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after the last link
  if (lastIndex < content.length) {
    parts.push(content.slice(lastIndex));
  }

  // If no links were found, return the original string
  return parts.length === 0 ? content : parts;
}

export interface FrameProps extends React.ComponentProps<"figure"> {
  /**
   * Text or content that appears as part of the frame, centered below the content.
   * Supports markdown-style links: `[text](url)` or full React nodes for complex formatting.
   */
  caption?: React.ReactNode;
}

function Frame({ caption, className, children, ...props }: FrameProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const frameRef = React.useRef<HTMLElement>(null);

  // Handle mounting for portal
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle escape key to close lightbox
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <figure
        ref={frameRef}
        data-slot="frame"
        className={cn(
          "bg-muted-app-subtle border-muted my-6 overflow-hidden rounded-lg border p-2",
          className
        )}
        {...props}
      >
        {/* Image Container */}
        <div
          data-slot="frame-content"
          role="button"
          tabIndex={0}
          aria-label="Click to zoom image"
          onClick={handleOpen}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleOpen();
            }
          }}
          className={cn(
            "relative overflow-hidden rounded-md cursor-zoom-in",
            "focus-visible:ring-primary-solid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
            "[&_img]:block [&_img]:w-full [&_img]:h-auto [&_img]:object-contain"
          )}
        >
          {children}
        </div>

        {/* Caption - inside the card */}
        {caption && (
          <figcaption
            data-slot="frame-caption"
            className="mx-auto mt-3 text-center text-sm"
          >
            {parseLinks(caption)}
          </figcaption>
        )}
      </figure>

      {/* Lightbox Portal */}
      {isMounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <FrameLightbox onClose={handleClose}>{children}</FrameLightbox>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}

interface FrameLightboxProps {
  children: React.ReactNode;
  onClose: () => void;
}

function FrameLightbox({ children, onClose }: FrameLightboxProps) {
  const contentRef = React.useRef<HTMLDivElement>(null);

  // Focus trap - focus the content when opened
  React.useEffect(() => {
    contentRef.current?.focus();
  }, []);

  return (
    <motion.div
      data-slot="frame-lightbox"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Backdrop */}
      <motion.div
        data-slot="frame-lightbox-backdrop"
        className="absolute inset-0 bg-black/90 supports-backdrop-filter:backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      />

      {/* Close button - appears after content with stagger */}
      <motion.button
        data-slot="frame-lightbox-close"
        type="button"
        onClick={onClose}
        className="text-muted-solid-hover hover:text-muted-high-contrast absolute top-4 right-4 z-10 flex size-10 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{
          type: "spring",
          bounce: 0.1,
          duration: 0.2,
          delay: 0.05,
        }}
        aria-label="Close lightbox"
      >
        <Icon name="Cross" className="size-6" />
      </motion.button>

      {/* Content - main spring animation */}
      <motion.div
        ref={contentRef}
        data-slot="frame-lightbox-content"
        role="dialog"
        aria-modal="true"
        aria-label="Image lightbox"
        tabIndex={-1}
        onClick={onClose}
        className="relative z-10 flex max-h-[95vh] max-w-[95vw] cursor-zoom-out items-center justify-center outline-none"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{
          type: "spring",
          bounce: 0.15,
          duration: 0.35,
        }}
      >
        <div className="[&>img]:max-h-[95vh] [&>img]:max-w-[95vw] [&>img]:min-w-[60vw] [&>img]:rounded-lg [&>img]:object-contain [&>img]:shadow-2xl">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

export { Frame };
