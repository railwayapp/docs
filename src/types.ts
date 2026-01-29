import type { IconName } from "@/assets/icons/types";

export interface FrontMatter {
  title: string;
  description?: string;
  url: string;
}

export type ISidebarContent = ISidebarSection[];

export interface IPage {
  title: string;
  slug: string;
  description?: string;
  category?: string;
  icon?: IconName;
}

export interface IExternalLink {
  title: string;
  url: string;
  icon?: IconName;
  hideExternalIcon?: boolean;
}

export interface ISidebarSection {
  title?: string;
  slug?: string;
  content: (IPage | ISubSection | IExternalLink)[];
  defaultExpanded?: boolean;
}

export interface ISubSection {
  subTitle: string | IPage;
  pages: (IPage | IExternalLink)[];
}

export namespace Search {
  interface ResultItem {
    hierarchies: string[];
    slug: string;
    text: string;
  }
  export type Result = Record<string, ResultItem[]>;
  export interface Document {
    hierarchy_lvl0: string;
    hierarchy_lvl1: string;
    hierarchy_lvl2: string;
    hierarchy_lvl3: string;
    hierarchy_lvl4: string;
    url: string;
    content: string;
  }
}
