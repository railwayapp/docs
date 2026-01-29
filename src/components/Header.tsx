import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import React from "react";
import { Icon } from "./Icon";

// Helper to extract text content from React children recursively
function getTextContent(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(getTextContent).join("");
  if (React.isValidElement(children) && children.props.children) {
    return getTextContent(children.props.children as React.ReactNode);
  }
  return "";
}

// Generate slug from heading text (same algorithm as starter repo)
function getHeadingId(children: React.ReactNode): string {
  const text = getTextContent(children);
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

// Autolinked heading component with copy-to-clipboard
interface AutolinkedHeadingProps {
  as: "h2" | "h3" | "h4";
  id?: string;
  children: React.ReactNode;
}

function AutolinkedHeading({
  as: Tag,
  id,
  children,
  ...props
}: AutolinkedHeadingProps & React.ComponentProps<"h2">) {
  const { copied, copy } = useCopyToClipboard();
  
  // Use provided id or generate from content
  const headingId = id || getHeadingId(children);
  
  // Extract actual content - if children is an array from MDX, get the text content
  const displayContent = Array.isArray(children) ? children[1] ?? children : children;

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = `${window.location.origin}${window.location.pathname}#${headingId}`;
    copy(url);
    window.history.pushState(null, "", `#${headingId}`);
  };

  return (
    <Tag id={headingId} className="group/heading" {...props}>
      <a
        href={`#${headingId}`}
        onClick={handleCopyLink}
        className="transition-colors hover:text-primary-base"
      >
        {displayContent}
      </a>
      <span
        className="ml-2 inline-flex size-5 items-center justify-center align-middle text-muted-base opacity-0 transition-opacity group-hover/heading:opacity-100"
        aria-hidden="true"
      >
        {copied ? (
          <Icon name="Check" className="size-4 text-success-base" />
        ) : (
          <Icon name="Link" className="size-4" />
        )}
      </span>
    </Tag>
  );
}

export const H2: React.FC<{ id?: string; children: React.ReactNode }> = ({
  id,
  children,
}) => {
  return (
    <AutolinkedHeading as="h2" id={id}>
      {children}
    </AutolinkedHeading>
  );
};

export const H3: React.FC<{ id?: string; children: React.ReactNode }> = ({
  id,
  children,
}) => {
  return (
    <AutolinkedHeading as="h3" id={id}>
      {children}
    </AutolinkedHeading>
  );
};

export const H4: React.FC<{ id?: string; children: React.ReactNode }> = ({
  id,
  children,
}) => {
  return (
    <AutolinkedHeading as="h4" id={id}>
      {children}
    </AutolinkedHeading>
  );
};
