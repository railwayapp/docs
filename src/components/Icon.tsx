import type { IconName } from "@/assets/icons/types";
import type { SVGProps } from "react";

export function Icon({
  name,
  className,
  ...props
}: SVGProps<SVGSVGElement> & {
  name: IconName;
}) {
  return (
    <svg fill="none" className={className} aria-hidden="true" {...props}>
      <use href={`/icons/sprite.svg#${name}`} />
    </svg>
  );
}
