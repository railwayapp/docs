// SidebarItem.tsx
import React from "react";
import { cn } from "@/lib/cn";
import { Link } from "./link";
import { IPage, ISubSection, IExternalLink } from "../types";
import { Arrow } from "@/components/arrow";
import { Icon } from "./icon";

interface SidebarItemProps {
  item: IPage | ISubSection | IExternalLink;
  isCurrentPage: (pageSlug: string) => boolean;
  isExpanded: boolean;
  onToggleSubSection: () => void;
  activeLinkRef?: React.MutableRefObject<HTMLAnchorElement | null>;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  isCurrentPage,
  isExpanded,
  onToggleSubSection,
  activeLinkRef,
}) => {
  const externalLinkSvg = (
    <svg
      className="size-3 text-muted-base transition-colors"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
      />
    </svg>
  );

  const renderExternalLink = (
    item: IExternalLink,
    isSubSectionItem = false,
  ) => {
    return (
      <li key={item.url} className="min-w-0">
        <Link
          href={item.url}
          className={cn(
            "group flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-muted-base transition-colors hover:text-muted-high-contrast focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-solid min-w-0",
            isSubSectionItem
              ? "focus-visible:ring-inset"
              : "-ml-3 focus-visible:ring-offset-2 focus-visible:ring-offset-muted-app",
          )}
          title={item.title}
        >
          {item.icon && (
            <Icon
              name={item.icon}
              className="size-4 shrink-0 text-muted-base group-hover:text-muted-high-contrast transition-colors"
            />
          )}
          <span className="flex-1 truncate">{item.title}</span>
          {!item.hideExternalIcon && (
            <span className="group-hover:[&>svg]:text-muted-high-contrast">
              {externalLinkSvg}
            </span>
          )}
        </Link>
      </li>
    );
  };

  const renderPageLink = (item: IPage, isSubSectionItem = false) => {
    const isActive = isCurrentPage(item.slug);
    const displayContent = item.commandName ? (
      <kbd className="rounded border border-muted bg-muted-element px-1.5 py-0.5 font-mono text-sm">
        {item.commandName}
      </kbd>
    ) : (
      item.title
    );
    return (
      <li key={item.slug} className="min-w-0">
        <Link
          href={item.slug}
          className={cn(
            "block rounded-md px-3 py-1.5 text-sm text-muted-base transition-colors hover:text-muted-high-contrast focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-solid truncate",
            isActive &&
              "bg-primary-element-active text-muted-high-contrast font-medium",
            isSubSectionItem
              ? "focus-visible:ring-inset"
              : "-ml-3 focus-visible:ring-offset-2 focus-visible:ring-offset-muted-app",
          )}
          ref={isActive ? activeLinkRef : undefined}
          title={item.commandName ?? item.title}
        >
          {displayContent}
        </Link>
      </li>
    );
  };

  const renderSubSection = (item: ISubSection) => {
    const renderSubtitle = (subTitle: string | IPage) => {
      const hasLanding = typeof subTitle !== "string";
      const isSubTitleActive =
        hasLanding && isCurrentPage((subTitle as IPage).slug);
      const hasActiveChild = item.pages.some(
        page => "slug" in page && isCurrentPage(page.slug),
      );
      const isParentHighlighted = isSubTitleActive || hasActiveChild;

      return (
        <button
          onClick={e => {
            e.stopPropagation();
            onToggleSubSection();
          }}
          className={cn(
            "group flex w-full items-center justify-between gap-2 rounded-md px-3 py-1.5 -ml-3 text-left text-sm transition-colors hover:text-muted-high-contrast focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-solid focus-visible:ring-offset-2 focus-visible:ring-offset-muted-app cursor-pointer min-w-0",
            isSubTitleActive
              ? "bg-primary-element-active text-muted-high-contrast font-medium"
              : isParentHighlighted
              ? "text-muted-high-contrast font-medium"
              : "text-muted-base",
          )}
        >
          {hasLanding ? (
            <Link
              href={(subTitle as IPage).slug}
              className="flex-1 truncate min-w-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-solid focus-visible:ring-inset rounded"
              ref={isSubTitleActive ? activeLinkRef : undefined}
              onClick={e => {
                e.stopPropagation();
                if (isSubTitleActive) {
                  // Already on this page, toggle collapse/expand
                  e.preventDefault();
                  onToggleSubSection();
                } else if (!isExpanded) {
                  // Navigating to a new page, expand the subsection
                  onToggleSubSection();
                }
              }}
              title={(subTitle as IPage).title}
            >
              {(subTitle as IPage).title}
            </Link>
          ) : (
            <span className="flex-1 truncate min-w-0" title={subTitle}>
              {subTitle}
            </span>
          )}
          <Arrow
            isExpanded={isExpanded}
            className={cn(
              "shrink-0 group-hover:text-muted-high-contrast",
              isParentHighlighted && "text-muted-high-contrast",
            )}
          />
        </button>
      );
    };

    return (
      <li
        key={
          typeof item.subTitle === "string"
            ? item.subTitle
            : item.subTitle.title
        }
        className="min-w-0"
      >
        {renderSubtitle(item.subTitle)}
        <div
          className={cn(
            "grid transition-[grid-template-rows] duration-200 ease-out",
            isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
        >
          <ul
            className={cn(
              "overflow-hidden ml-3 pl-3 space-y-0.5 min-w-0",
              isExpanded ? "pt-1 pb-2 border-l border-muted" : "",
            )}
          >
            {item.pages.map(page => {
              if ("url" in page) {
                return renderExternalLink(page, true);
              } else {
                return renderPageLink(page, true);
              }
            })}
          </ul>
        </div>
      </li>
    );
  };

  if ("url" in item) {
    return renderExternalLink(item);
  } else if ("subTitle" in item) {
    return renderSubSection(item);
  } else {
    return renderPageLink(item);
  }
};

export default SidebarItem;
