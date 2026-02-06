import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/cn";
import * as React from "react";
import { Icon } from "./icon";

export interface PageActionsProps {
  /** The content to copy/share as markdown */
  content: string;
  /** The page title */
  title: string;
  /** The page slug, e.g. "/quick-start" or "/guides/some-guide" */
  slug: string;
  /** Additional class name */
  className?: string;
}

export function PageActions({
  content,
  title,
  slug,
  className,
}: PageActionsProps) {
  const { copied, copy } = useCopyToClipboard();

  const rawUrl = `https://docs.railway.com${slug}.md`;

  const markdownContent = React.useMemo(() => {
    return `# ${title}\n\n${content}`;
  }, [title, content]);

  const handleCopyAsMarkdown = () => {
    copy(markdownContent);
  };

  const openInAI = (urlTemplate: string) => {
    const prompt = `Read this documentation page:\n\n${rawUrl}`;
    const encoded = encodeURIComponent(prompt);
    window.open(urlTemplate.replace("{text}", encoded), "_blank");
  };

  const actionClass = cn(
    "group flex items-center gap-2.5 rounded-md -ml-2 pl-2 pr-2 py-1.5 text-sm transition-colors",
    "text-muted-base hover:text-muted-high-contrast hover:bg-muted-element",
  );

  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <h3 className="text-muted-base mb-2 text-xs font-medium">
        Ask AI about this page
      </h3>

      {/* Copy page */}
      <button onClick={handleCopyAsMarkdown} className={actionClass}>
        {copied ? (
          <>
            <Icon name="Check" className="size-4 shrink-0 text-success-base" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Icon name="Copy" className="size-4 shrink-0" />
            <span>Copy page</span>
          </>
        )}
      </button>

      {/* Open in ChatGPT */}
      <button
        onClick={() =>
          openInAI("https://chatgpt.com/?hints=search&prompt={text}")
        }
        className={actionClass}
      >
        <Icon name="Chatgpt" className="size-4 shrink-0" />
        <span className="flex items-center gap-1">
          Open in ChatGPT
          <Icon
            name="ArrowUpRight"
            className="size-3 opacity-50 transition-opacity group-hover:opacity-100"
          />
        </span>
      </button>

      {/* Open in Claude */}
      <button
        onClick={() => openInAI("https://claude.ai/new?q={text}")}
        className={actionClass}
      >
        <Icon name="Claude" className="size-4 shrink-0" />
        <span className="flex items-center gap-1">
          Open in Claude
          <Icon
            name="ArrowUpRight"
            className="size-3 opacity-50 transition-opacity group-hover:opacity-100"
          />
        </span>
      </button>

      {/* Open in Cursor */}
      <button
        onClick={() => openInAI("https://cursor.com/link/prompt?text={text}")}
        className={actionClass}
      >
        <Icon name="CursorAi" className="size-4 shrink-0" />
        <span className="flex items-center gap-1">
          Open in Cursor
          <Icon
            name="ArrowUpRight"
            className="size-3 opacity-50 transition-opacity group-hover:opacity-100"
          />
        </span>
      </button>
    </div>
  );
}
