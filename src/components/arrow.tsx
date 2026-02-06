import React from "react";
import { cn } from "@/lib/cn";

interface ArrowProps {
  isExpanded: boolean;
  className?: string;
}

export const Arrow: React.FC<ArrowProps> = ({ isExpanded, className }) => {
  return (
    <svg
      className={cn(
        "size-4 shrink-0 text-muted-base transition-transform duration-200 ease-out",
        isExpanded && "rotate-90",
        className,
      )}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
};
