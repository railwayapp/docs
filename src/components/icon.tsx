import type { IconName } from "@/assets/icons/types";
import type { SVGProps } from "react";

const darkVariants: Partial<Record<IconName, IconName>> = {
  OpenCode: "OpenCodeDark",
};

export function Icon({
  name,
  className,
  ...props
}: SVGProps<SVGSVGElement> & {
  name: IconName;
}) {
  const darkVariant = darkVariants[name];

  return (
    <svg fill="none" className={className} aria-hidden="true" {...props}>
      <use
        href={`/icons/sprite.svg#${name}`}
        className={darkVariant ? "dark:hidden" : undefined}
      />
      {darkVariant && (
        <use
          href={`/icons/sprite.svg#${darkVariant}`}
          className="hidden dark:block"
        />
      )}
    </svg>
  );
}
