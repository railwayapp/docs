import { scrollToID } from "@/utils/scroll";
import { cn } from "@/lib/cn";
import React from "react";
import { Icon } from "./icon";

interface AnchorProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  rel?: string;
}

function isExternalHref(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}

const linkStyles =
  "text-muted-high-contrast underline decoration-primary-base underline-offset-2 transition-colors hover:text-primary-base font-medium";

export const Anchor: React.FC<AnchorProps> = ({
  href,
  children,
  className = "",
  target,
  rel,
}) => {
  const isExternal = isExternalHref(href);
  const effectiveTarget = target ?? (isExternal ? "_blank" : "_self");
  const effectiveRel =
    rel ?? (effectiveTarget === "_blank" ? "noopener noreferrer" : undefined);

  if (isExternal) {
    return (
      <a
        href={href}
        className={cn(
          linkStyles,
          "inline-flex items-center gap-0.5",
          className,
        )}
        target={effectiveTarget}
        rel={effectiveRel}
        data-slot="link"
      >
        <span>{children}</span>
        <Icon
          name="LinkSquare"
          className="size-3.5 flex-shrink-0"
          aria-hidden="true"
        />
      </a>
    );
  }

  return (
    <a
      href={href}
      className={cn(linkStyles, className)}
      target={effectiveTarget}
      rel={effectiveRel}
      onClick={scrollToID(href)}
      data-slot="link"
    >
      {children}
    </a>
  );
};
