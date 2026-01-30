import React from "react";
import { Link } from "./link";
import { ThemeSwitcher } from "./theme-switcher";
import { Icon } from "./icon";

interface FooterProps {
  gitHubEditLink?: string;
}

export const Footer: React.FC<FooterProps> = ({ gitHubEditLink }) => {
  return (
    <footer className="not-prose mt-32 border-t border-muted/70 pt-8 pb-16">
      <div className="flex items-center justify-between">
        {gitHubEditLink ? (
          <Link
            href={gitHubEditLink}
            className="inline-flex items-center gap-2 text-sm text-muted-base hover:text-muted-high-contrast transition-colors"
          >
            <Icon name="Github" className="size-4" />
            <span>Edit this page on GitHub</span>
            <Icon name="LinkSquare" className="size-4" />
          </Link>
        ) : (
          <div />
        )}
        <ThemeSwitcher />
      </div>
    </footer>
  );
};
