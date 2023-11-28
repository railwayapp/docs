export interface FrontMatter {
  title: string;
}

export type ISidebarContent = ISidebarSection[];

export interface IPage {
  title: string;
  slug: string;
  category?: string;
}

export interface IExternalLink {
  title: string;
  url: string;
}

export interface ISidebarSection {
  title?: string;
  content: (IPage | ISubSection | IExternalLink)[];
}

export interface ISubSection {
  subTitle: IPage;
  pages: IPage[];
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
