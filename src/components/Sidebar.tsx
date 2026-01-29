import { useRouter } from "next/router";
import React, { useMemo, useState, useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { sidebarContent } from "../data/sidebar";
import { Link } from "./Link";
import { IPage, ISubSection, IExternalLink, ISidebarSection } from "../types";
import SidebarItem from "./SidebarItem";
import { Arrow } from "@/components/Arrow";

export const Sidebar: React.FC = ({ ...props }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState({
    canScrollUp: false,
    canScrollDown: false,
  });

  useEffect(() => {
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

  return (
    <div
      className="sidebar hidden md:flex md:flex-col md:sticky md:top-[53px] md:h-[calc(100vh-53px)] md:overflow-hidden md:w-sidebar md:shrink-0 md:border-r md:border-muted bg-muted-app"
      {...props}
    >
      <div className="relative flex-1 min-h-0 overflow-hidden">
        {/* Top fade indicator */}
        <div
          className={cn(
            "from-muted-app pointer-events-none absolute inset-x-0 top-0 z-10 h-6 bg-gradient-to-b to-transparent transition-opacity duration-150",
            scrollState.canScrollUp ? "opacity-100" : "opacity-0",
          )}
          aria-hidden="true"
        />

        {/* Scrollable container */}
        <div
          ref={scrollContainerRef}
          className="h-full overflow-y-auto px-6 py-4"
        >
          <SidebarContent />
        </div>

        {/* Bottom fade indicator */}
        <div
          className={cn(
            "from-muted-app pointer-events-none absolute inset-x-0 bottom-0 z-10 h-6 bg-gradient-to-t to-transparent transition-opacity duration-150",
            scrollState.canScrollDown ? "opacity-100" : "opacity-0",
          )}
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

const SidebarContent: React.FC = () => {
  const {
    query: { slug },
    pathname,
  } = useRouter();

  const prefixedSlug = useMemo(
    () => (slug ? `/${(slug as string[] | undefined)?.join("/")}` : undefined),
    [slug],
  );

  const [expandedSubSections, setExpandedSubSections] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<string[]>(() => {
    // Initialize with sections marked defaultExpanded
    return sidebarContent
      .filter(s => s.defaultExpanded && s.title)
      .map(s => s.title!);
  });
  const activeLinkRef = React.useRef<HTMLAnchorElement | null>(null);

  const currentSlug = prefixedSlug ?? pathname;

  // Auto-expand section containing current page
  useEffect(() => {
    const containingSection = sidebarContent.find(
      section =>
        section.title &&
        section.content.some(item => {
          if ("slug" in item && item.slug === currentSlug) return true;
          if ("subTitle" in item) {
            const subTitleSlug =
              typeof item.subTitle === "string"
                ? item.subTitle
                : item.subTitle.slug;
            if (subTitleSlug === currentSlug) return true;
            return item.pages.some(p => "slug" in p && p.slug === currentSlug);
          }
          return false;
        }),
    );

    if (containingSection?.title) {
      setExpandedSections(prev =>
        prev.includes(containingSection.title!)
          ? prev
          : [...prev, containingSection.title!],
      );
    }
  }, [currentSlug]);

  useEffect(() => {
    const newExpandedSubSections = findContainingSubSectionSlugs(
      sidebarContent,
      currentSlug,
    );
    setExpandedSubSections(prevExpandedSubSections =>
      Array.from(
        new Set([...prevExpandedSubSections, ...newExpandedSubSections]),
      ),
    );
  }, [currentSlug]);

  useEffect(() => {
    if (activeLinkRef.current) {
      activeLinkRef.current.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [prefixedSlug]);

  const findContainingSubSectionSlugs = (
    sections: ISidebarSection[],
    currentPageSlug: string,
  ): string[] => {
    let slugs: string[] = [];
    for (const section of sections) {
      for (const item of section.content) {
        if ("subTitle" in item) {
          const subTitleSlug =
            typeof item.subTitle === "string"
              ? item.subTitle
              : item.subTitle.slug;
          const hasMatchingChild = item.pages.some(
            p => "slug" in p && p.slug === currentPageSlug,
          );
          if (hasMatchingChild || subTitleSlug === currentPageSlug) {
            slugs.push(subTitleSlug);
          }
        }
      }
    }
    return slugs;
  };

  const isCurrentPage = (pageSlug: string) =>
    (prefixedSlug ?? pathname) === pageSlug;

  const isCurrentSection = (section: ISidebarSection) => {
    const isDirectPageCurrent = section.content.some(
      item => "slug" in item && isCurrentPage(item.slug),
    );

    const isSubTitlePageCurrent = section.content.some(item => {
      if ("subTitle" in item) {
        const subTitleSlug =
          typeof item.subTitle === "string"
            ? item.subTitle
            : item.subTitle.slug;
        return isCurrentPage(subTitleSlug);
      }
      return false;
    });

    const isSubSectionPageCurrent = section.content.some(
      item =>
        "subTitle" in item &&
        item.pages.some(page => "slug" in page && isCurrentPage(page.slug)),
    );

    return (
      isDirectPageCurrent || isSubTitlePageCurrent || isSubSectionPageCurrent
    );
  };

  const toggleSubSection = (subTitleSlug: string) => {
    setExpandedSubSections(prevState =>
      prevState.includes(subTitleSlug)
        ? prevState.filter(slug => slug !== subTitleSlug)
        : [...prevState, subTitleSlug],
    );
  };

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections(prevState =>
      prevState.includes(sectionTitle)
        ? prevState.filter(title => title !== sectionTitle)
        : [...prevState, sectionTitle],
    );
  };

  const renderContentItem = (item: IPage | ISubSection | IExternalLink) => {
    let itemSlug = "";

    if ("slug" in item) {
      itemSlug = item.slug;
    } else if ("subTitle" in item) {
      itemSlug =
        typeof item.subTitle === "string" ? item.subTitle : item.subTitle.slug;
    } else if ("url" in item) {
      itemSlug = item.url;
    }

    const isActive = isCurrentPage(itemSlug);
    return (
      <SidebarItem
        key={itemSlug}
        item={item}
        isCurrentPage={isCurrentPage}
        isExpanded={expandedSubSections.includes(itemSlug)}
        onToggleSubSection={() => toggleSubSection(itemSlug)}
        activeLinkRef={isActive ? activeLinkRef : undefined}
      />
    );
  };

  return (
    <>
      {sidebarContent.map((section, i) => {
        return (
          <React.Fragment key={i}>
            {/* Named sections */}
            {section.title && (
              <>
                {/* Section with no content and has a slug - render as plain link */}
                {section.slug && section.content.length === 0 ? (
                  <Link
                    href={section.slug}
                    className={cn(
                      "group flex w-full items-center gap-2 py-1.5 px-3 -ml-3 rounded-md min-w-0",
                      "text-sm font-medium text-muted-base",
                      "hover:text-muted-high-contrast transition-colors",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-solid focus-visible:ring-offset-2 focus-visible:ring-offset-muted-app",
                      isCurrentPage(section.slug) &&
                        "bg-primary-element text-muted-high-contrast",
                    )}
                    title={section.title}
                  >
                    <span className="truncate">{section.title}</span>
                  </Link>
                ) : (
                  /* Section with content - collapsible accordion */
                  <>
                    <button
                      onClick={() => toggleSection(section.title!)}
                      className={cn(
                        "group flex w-full items-center justify-between gap-2 py-1.5 px-3 -ml-3 rounded-md cursor-pointer min-w-0",
                        "text-sm font-medium text-muted-base",
                        "hover:text-muted-high-contrast transition-colors",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-solid focus-visible:ring-offset-2 focus-visible:ring-offset-muted-app",
                        isCurrentSection(section) && "text-muted-high-contrast",
                        section.slug &&
                          isCurrentPage(section.slug) &&
                          "bg-primary-element text-muted-high-contrast",
                      )}
                      aria-expanded={expandedSections.includes(section.title)}
                      aria-label={
                        expandedSections.includes(section.title)
                          ? `Collapse ${section.title} section`
                          : `Expand ${section.title} section`
                      }
                    >
                      {section.slug ? (
                        <Link
                          href={section.slug}
                          className={cn(
                            "flex-1 text-left truncate min-w-0",
                            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-solid focus-visible:ring-inset rounded",
                            isCurrentPage(section.slug) &&
                              "text-muted-high-contrast font-semibold",
                          )}
                          onClick={e => {
                            e.stopPropagation();
                            // Also expand the section when navigating
                            if (!expandedSections.includes(section.title!)) {
                              setExpandedSections(prev => [
                                ...prev,
                                section.title!,
                              ]);
                            }
                          }}
                          title={section.title}
                        >
                          {section.title}
                        </Link>
                      ) : (
                        <span
                          className="flex-1 text-left truncate min-w-0"
                          title={section.title}
                        >
                          {section.title}
                        </span>
                      )}
                      <Arrow
                        isExpanded={expandedSections.includes(section.title)}
                        className="shrink-0 group-hover:text-muted-high-contrast"
                      />
                    </button>

                    <div
                      className={cn(
                        "grid transition-[grid-template-rows] duration-200 ease-out",
                        expandedSections.includes(section.title)
                          ? "grid-rows-[1fr]"
                          : "grid-rows-[0fr]",
                      )}
                    >
                      <ul
                        className={cn(
                          "overflow-hidden ml-3 pl-3 space-y-0.5 min-w-0",
                          expandedSections.includes(section.title)
                            ? "pt-1 pb-2 border-l border-muted"
                            : "",
                        )}
                      >
                        {section.content.map(renderContentItem)}
                      </ul>
                    </div>
                  </>
                )}
              </>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};

export const MobileSidebar: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  return (
    <div
      className={cn(isOpen ? "block" : "hidden", "w-full md:hidden px-4 pb-6")}
    >
      <SidebarContent />
    </div>
  );
};
