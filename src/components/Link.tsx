import NLink from "next/link";
import React, { PropsWithChildren, useMemo, forwardRef } from "react";

export interface Props {
  href: string;
  external?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

const isExternalLink = (href: string) =>
  href == null || href.startsWith("http://") || href.startsWith("https://");

const useIsExternalLink = (href: string) =>
  useMemo(() => isExternalLink(href), [href]);

export const Link = forwardRef<HTMLAnchorElement, PropsWithChildren<Props>>(
  ({ href, external, children, ...props }, ref) => {
    const isExternal = (useIsExternalLink(href) || external) ?? false;

    if (isExternal) {
      return (
        <a href={href} target="_blank" rel="noopener" ref={ref} {...props}>
          {children}
        </a>
      );
    }

    return (
      <NLink href={href} ref={ref} {...props}>
        {children}
      </NLink>
    );
  },
);

Link.displayName = "Link";
