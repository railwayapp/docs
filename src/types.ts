import { Hits, Index as MsIndex } from 'meilisearch'

export interface FrontMatter {
  title: string;
}

export type ISidebarContent = ISidebarSection[];

export interface IPage {
  title: string;
  slug: string;
  category?: string;
  tags?: string[];
}

export interface ISidebarSection {
  title?: string;
  pages: IPage[];
}

export namespace Search {
  export interface ResultItem {
    hierarchies: string[];
    slug: string;
    text: string;
  }
  export type Result = Record<string, ResultItem[]>;
  // export type MeilisearchResponse = Hits<MeilisearchResponseItem>;

  export interface Response {
    hierarchy_lvl0: string;
    hierarchy_lvl1: string;
    hierarchy_lvl2: string;
    hierarchy_lvl3: string;
    hierarchy_lvl4: string;
    url: string;
    content: string;
  }
}
