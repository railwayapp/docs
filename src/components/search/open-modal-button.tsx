import { searchStore } from "@/store";
import React from "react";
import { Icon } from "../icon";

interface OpenModalButtonProps {
  iconOnly?: boolean;
}

const OpenModalButton: React.FC<OpenModalButtonProps> = ({ iconOnly }) => {
  if (iconOnly) {
    return (
      <button
        onClick={() => searchStore.set(true)}
        className="p-1.5 rounded-md text-muted-base hover:bg-muted-element hover:text-muted-high-contrast transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-solid"
        aria-label="Search"
      >
        <Icon className="size-5" name="Search" />
      </button>
    );
  }

  return (
    <button
      onClick={() => searchStore.set(true)}
      className="group flex w-full items-center justify-between gap-3 rounded-lg border border-muted bg-muted-app px-3 py-2 text-left text-sm text-muted-base shadow-xs transition-all duration-150 hover:border-muted-hover hover:bg-muted-element hover:text-muted-high-contrast focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-solid focus-visible:ring-offset-2 focus-visible:ring-offset-muted-app"
    >
      <div className="flex items-center gap-2">
        <Icon className="size-4" name="Search" />
        <span>Search docs...</span>
      </div>
      <kbd className="pointer-events-none hidden select-none items-center gap-1 rounded border border-muted bg-muted-element px-1.5 py-0.5 font-mono text-xs text-muted-base md:inline-flex">
        <span className="text-xs">⌘</span>K
      </kbd>
    </button>
  );
};

export default OpenModalButton;
