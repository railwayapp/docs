import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { cn } from "@/lib/cn";
import * as React from "react";
import { Icon } from "./Icon";
import { Link } from "./Link";

export interface PageActionsProps {
  /** The content to copy/share as markdown */
  content: string;
  /** The page title */
  title: string;
  /** Additional class name */
  className?: string;
}

export function PageActions({ content, title, className }: PageActionsProps) {
  const { copied, copy } = useCopyToClipboard();

  const markdownContent = React.useMemo(() => {
    return `# ${title}\n\n${content}`;
  }, [title, content]);

  const handleCopyAsMarkdown = () => {
    copy(markdownContent);
  };

  const handleOpenInClaude = () => {
    const encoded = encodeURIComponent(markdownContent);
    window.open(`https://claude.ai/new?q=${encoded}`, "_blank");
  };

  const handleOpenInChatGPT = () => {
    const encoded = encodeURIComponent(markdownContent);
    window.open(
      `https://chatgpt.com/?hints=search&prompt=${encoded}`,
      "_blank",
    );
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
      <button onClick={handleOpenInChatGPT} className={actionClass}>
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
      <button onClick={handleOpenInClaude} className={actionClass}>
        <Icon name="Claude" className="size-4 shrink-0" />
        <span className="flex items-center gap-1">
          Open in Claude
          <Icon
            name="ArrowUpRight"
            className="size-3 opacity-50 transition-opacity group-hover:opacity-100"
          />
        </span>
      </button>

      {/* Connect to Cursor */}
      <Link href="/reference/mcp" className={cn(actionClass, "no-underline")}>
        <Icon name="CursorAi" className="size-4 shrink-0" />
        <span className="flex items-center gap-1">
          Connect to Cursor
          <Icon
            name="ArrowUpRight"
            className="size-3 opacity-50 transition-opacity group-hover:opacity-100"
          />
        </span>
      </Link>

      {/* Connect to VS Code */}
      <Link href="/reference/mcp" className={cn(actionClass, "no-underline")}>
        <Icon name="Vscode" className="size-4 shrink-0" />
        <span className="flex items-center gap-1">
          Connect to VS Code
          <Icon
            name="ArrowUpRight"
            className="size-3 opacity-50 transition-opacity group-hover:opacity-100"
          />
        </span>
      </Link>
    </div>
  );
}
