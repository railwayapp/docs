import type { IconName } from "@/assets/icons/types";
import { cn } from "@/lib/cn";
import NextLink from "next/link";
import * as React from "react";
import { Icon } from "./icon";

export type CardTone = "yellow" | "blue" | "red" | "green" | "purple";

export interface CardProps {
  title: string;
  description?: string;
  href: string;
  icon?: IconName;
  tone?: CardTone;
  className?: string;
}

const toneStyles: Record<CardTone, string> = {
  yellow:
    "bg-gradient-to-br from-[#EFD580]/25 to-white hover:from-[#EFD580]/40 hover:to-white dark:from-[#675518]/25 dark:to-[#131415] dark:hover:from-[#675518]/40 dark:hover:to-[#131415]",
  blue: "bg-gradient-to-br from-[#8CAEF2]/25 to-white hover:from-[#8CAEF2]/40 hover:to-white dark:from-[#1D4596]/25 dark:to-[#131415] dark:hover:from-[#1D4596]/40 dark:hover:to-[#131415]",
  red: "bg-gradient-to-br from-[#F1C1C0]/25 to-white hover:from-[#F1C1C0]/40 hover:to-white dark:from-[#741D1B]/25 dark:to-[#131415] dark:hover:from-[#741D1B]/40 dark:hover:to-[#131415]",
  green:
    "bg-gradient-to-br from-[#95D0B4]/25 to-white hover:from-[#95D0B4]/40 hover:to-white dark:from-[#26543F]/25 dark:to-[#131415] dark:hover:from-[#26543F]/40 dark:hover:to-[#131415]",
  purple:
    "bg-gradient-to-br from-[#C9B0E8]/25 to-white hover:from-[#C9B0E8]/40 hover:to-white dark:from-[#3F2A6B]/25 dark:to-[#131415] dark:hover:from-[#3F2A6B]/40 dark:hover:to-[#131415]",
};

const toneIconColors: Record<CardTone, string> = {
  yellow: "text-[#B98900] dark:text-[#EFD580]",
  blue: "text-[#3B6BC4] dark:text-[#8CAEF2]",
  red: "text-[#C04C4A] dark:text-[#F1C1C0]",
  green: "text-[#3F8C68] dark:text-[#95D0B4]",
  purple: "text-[#8055C9] dark:text-[#C9B0E8]",
};

export const Card: React.FC<CardProps> = ({
  title,
  description,
  href,
  icon,
  tone = "purple",
  className,
}) => {
  const isExternal = /^https?:\/\//.test(href);
  const Wrapper: React.ElementType = isExternal ? "a" : NextLink;
  const externalProps = isExternal
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Wrapper
      href={href}
      data-slot="link"
      {...externalProps}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-lg border border-muted no-underline transition-colors duration-200 hover:border-muted-hover",
        description && "min-h-52",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-solid focus-visible:ring-offset-2 focus-visible:ring-offset-muted-app",
        toneStyles[tone],
        className,
      )}
    >
      <div
        data-slot="card-header"
        className={cn(
          "flex min-h-24 items-center gap-3 px-5 py-5",
          description && "border-b border-muted",
        )}
      >
        {icon && (
          <Icon
            name={icon}
            className={cn("size-6 shrink-0", toneIconColors[tone])}
          />
        )}
        <div
          data-slot="card-title"
          className="min-w-0 text-xl font-semibold leading-7 tracking-tight text-muted-high-contrast"
        >
          {title}
        </div>
      </div>
      {description && (
        <div
          data-slot="card-description"
          className="px-5 pb-5 pt-4 text-sm font-normal leading-6 text-muted-base"
        >
          {description}
        </div>
      )}
    </Wrapper>
  );
};

export interface CardGridProps {
  className?: string;
  columns?: 1 | 2 | 3;
  children: React.ReactNode;
}

const columnClasses: Record<NonNullable<CardGridProps["columns"]>, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
};

export const CardGrid: React.FC<CardGridProps> = ({
  className,
  columns = 2,
  children,
}) => {
  return (
    <div
      data-slot="card-grid"
      className={cn(
        "my-6 grid auto-rows-fr gap-4 [&_a]:no-underline",
        columnClasses[columns],
        className,
      )}
    >
      {children}
    </div>
  );
};
