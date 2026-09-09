import type { IPage, ISidebarItem } from "@/types";

export function sidebarItemSlug(item: ISidebarItem): string {
  if ("slug" in item) return item.slug;
  if ("subTitle" in item)
    return typeof item.subTitle === "string"
      ? item.subTitle
      : item.subTitle.slug;
  return item.url;
}

export function sidebarItemContainsPage(
  item: ISidebarItem,
  slug: string,
): boolean {
  if ("url" in item) return false;
  if (sidebarItemSlug(item) === slug) return true;
  return (
    "subTitle" in item &&
    item.pages.some(child => sidebarItemContainsPage(child, slug))
  );
}

export function containingSubsectionSlugs(
  items: ISidebarItem[],
  slug: string,
): string[] {
  return items.flatMap(item =>
    "subTitle" in item && sidebarItemContainsPage(item, slug)
      ? [sidebarItemSlug(item), ...containingSubsectionSlugs(item.pages, slug)]
      : [],
  );
}

export function flattenSidebarItems(items: ISidebarItem[]): IPage[] {
  return items.flatMap(item => {
    if ("url" in item) return [];
    if ("subTitle" in item)
      return [
        ...(typeof item.subTitle === "string" ? [] : [item.subTitle]),
        ...flattenSidebarItems(item.pages),
      ];
    return [item];
  });
}
