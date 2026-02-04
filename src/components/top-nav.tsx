import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { cn } from "@/lib/cn";
import { Icon } from "./icon";
import { Link } from "./link";
import { Logo } from "./logo";
import { Badge } from "./badge";
import { ThemeSwitcher } from "./theme-switcher";
import OpenModalButton from "./search/open-modal-button";
import { sidebarContent } from "../data/sidebar";
import { IPage, ISubSection, IExternalLink, ISidebarSection } from "../types";
import SidebarItem from "./sidebar-item";
import { Arrow } from "@/components/arrow";

const navLinks = [
  { title: "Guides", href: "/guides" },
  { title: "Changelog", href: "https://railway.com/changelog" },
  { title: "Central Station", href: "https://station.railway.com" },
];

// Desktop Top Navigation
export const TopNav: React.FC = () => {
  return (
    <header className="hidden md:grid grid-cols-[auto_1fr_auto] items-center gap-4 px-6 py-3 fixed top-0 left-0 right-0 z-40 bg-muted-app/95 backdrop-blur-sm border-b border-muted">
      {/* Left - Logo */}
      <Link
        href="/"
        className="flex items-center gap-2 shrink-0 rounded-md p-1 -m-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-solid focus-visible:ring-offset-2 focus-visible:ring-offset-muted-app"
      >
        <Logo className="w-6 h-6" />
        <Badge variant="secondary">Docs</Badge>
      </Link>

      {/* Center - Search */}
      <div className="flex justify-center px-4">
        <div className="w-full max-w-md">
          <OpenModalButton />
        </div>
      </div>

      {/* Right - Links */}
      <nav className="flex items-center gap-4 shrink-0">
        {navLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm text-muted-base hover:text-muted-high-contrast transition-colors rounded-md px-2 py-1 -mx-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-solid focus-visible:ring-offset-2 focus-visible:ring-offset-muted-app"
          >
            {link.title}
          </Link>
        ))}
        <Link
          href="https://railway.com"
          className="inline-flex items-center gap-1.5 h-9 px-2.5 rounded-lg text-sm font-medium text-white bg-primary-solid hover:bg-primary-solid-hover active:bg-primary-solid-active transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-solid focus-visible:ring-offset-2 focus-visible:ring-offset-muted-app"
        >
          Go to Railway
          <Icon name="ArrowUpRight" className="size-4" />
        </Link>
      </nav>
    </header>
  );
};

// Mobile Top Navigation with Hamburger Menu
export const MobileTopNav: React.FC = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  useEffect(() => {
    router.events.on("routeChangeStart", closeMenu);
    return () => router.events.off("routeChangeStart", closeMenu);
  }, [closeMenu, router.events]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className="flex md:hidden items-center justify-between gap-4 px-4 py-3 fixed top-0 left-0 right-0 z-40 bg-muted-app/95 backdrop-blur-sm border-b border-muted">
        {/* Left - Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0 rounded-md p-1 -m-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-solid focus-visible:ring-offset-2 focus-visible:ring-offset-muted-app"
        >
          <Logo className="w-7 h-7" />
          <span className="font-semibold text-muted-high-contrast">
            Railway
          </span>
          <Badge variant="secondary">Docs</Badge>
        </Link>

        {/* Center - Spacer */}
        <div className="flex-1" />

        {/* Right - Hamburger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1.5 rounded-md hover:bg-muted-element transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-solid focus-visible:ring-offset-2 focus-visible:ring-offset-muted-app"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <Icon name="Cross" className="w-5 h-5" />
            ) : (
              <Icon name="Menu" className="w-5 h-5" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-[57px] z-30 md:hidden bg-muted-app overflow-y-auto">
          <div className="px-4 py-4">
            {/* Search */}
            <div className="mb-4">
              <OpenModalButton />
            </div>

            {/* Top Nav Links */}
            <nav className="flex flex-col gap-1 mb-4">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 rounded-md text-sm font-medium text-muted-high-contrast hover:bg-muted-element transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-solid focus-visible:ring-offset-2 focus-visible:ring-offset-muted-app"
                >
                  {link.title}
                </Link>
              ))}
              <Link
                href="https://railway.com/book-demo"
                className="inline-flex items-center gap-1.5 h-9 px-2.5 rounded-lg text-sm font-medium border border-muted bg-muted-app text-muted-high-contrast hover:bg-muted-element hover:border-muted-hover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-solid focus-visible:ring-offset-2 focus-visible:ring-offset-muted-app"
              >
                Book a Demo
              </Link>
              <Link
                href="https://railway.com"
                className="inline-flex items-center gap-1.5 h-9 px-2.5 rounded-lg text-sm font-medium text-white bg-primary-solid hover:bg-primary-solid-hover active:bg-primary-solid-active transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-solid focus-visible:ring-offset-2 focus-visible:ring-offset-muted-app"
              >
                Go to Railway
                <Icon name="ArrowUpRight" className="size-4" />
              </Link>
            </nav>

            <hr className="border-muted mb-4" />

            {/* Sidebar Content */}
            <MobileSidebarContent />

            <hr className="border-muted my-4" />

            {/* Theme Switcher */}
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-sm text-muted-base sr-only">Theme</span>
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Mobile Sidebar Content (extracted from Sidebar.tsx logic)
const MobileSidebarContent: React.FC = () => {
  const {
    query: { slug },
    pathname,
  } = useRouter();

  const prefixedSlug = React.useMemo(
    () => (slug ? `/${(slug as string[] | undefined)?.join("/")}` : undefined),
    [slug],
  );

  const [expandedSubSections, setExpandedSubSections] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<string[]>(() => {
    return sidebarContent
      .filter(s => s.defaultExpanded && s.title)
      .map(s => s.title!);
  });

  const currentSlug = prefixedSlug ?? pathname;

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

  const isCurrentPage = (pageSlug: string) => currentSlug === pageSlug;

  const isCurrentSection = (section: ISidebarSection) => {
    return section.content.some(item => {
      if ("slug" in item && isCurrentPage(item.slug)) return true;
      if ("subTitle" in item) {
        const subTitleSlug =
          typeof item.subTitle === "string"
            ? item.subTitle
            : item.subTitle.slug;
        if (isCurrentPage(subTitleSlug)) return true;
        return item.pages.some(
          page => "slug" in page && isCurrentPage(page.slug),
        );
      }
      return false;
    });
  };

  const toggleSubSection = (subTitleSlug: string) => {
    setExpandedSubSections(prev =>
      prev.includes(subTitleSlug)
        ? prev.filter(s => s !== subTitleSlug)
        : [...prev, subTitleSlug],
    );
  };

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionTitle)
        ? prev.filter(t => t !== sectionTitle)
        : [...prev, sectionTitle],
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

    return (
      <SidebarItem
        key={itemSlug}
        item={item}
        isCurrentPage={isCurrentPage}
        isExpanded={expandedSubSections.includes(itemSlug)}
        onToggleSubSection={() => toggleSubSection(itemSlug)}
      />
    );
  };

  let isFirstSection = true;

  return (
    <>
      {sidebarContent.map((section, i) => {
        const isCollapsible = !!section.title;
        const showSeparator = isCollapsible && isFirstSection;
        if (isCollapsible) isFirstSection = false;

        return (
          <React.Fragment key={i}>
            {showSeparator && <hr className="border-muted mb-2" />}

            {!section.title && (
              <ul className="mb-2 space-y-0.5">
                {section.content.map(renderContentItem)}
              </ul>
            )}

            {section.title && (
              <>
                <button
                  onClick={() => toggleSection(section.title!)}
                  className={cn(
                    "group flex w-full items-center justify-between gap-2 py-1.5 px-3 -ml-3 rounded-md",
                    "text-sm font-medium text-muted-base",
                    "hover:bg-muted-element hover:text-muted-high-contrast transition-colors",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-solid focus-visible:ring-offset-2 focus-visible:ring-offset-muted-app",
                    isCurrentSection(section) && "text-muted-high-contrast",
                  )}
                >
                  <span>{section.title}</span>
                  <Arrow
                    isExpanded={expandedSections.includes(section.title)}
                    className="group-hover:text-muted-high-contrast"
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
                  <ul className="overflow-hidden mb-1 space-y-0.5 mt-1 ml-1 pl-3 border-l border-muted">
                    {section.content.map(renderContentItem)}
                  </ul>
                </div>
              </>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};
