import { ComponentType } from "react";
import { Star } from "react-feather";

export const ICON_FROM_NAME: Record<string, ComponentType> = {
  star: Star,
};

export const iconFromName = (
  name: string | undefined | null,
): ComponentType | undefined => {
  return name ? ICON_FROM_NAME[name] : undefined;
};
