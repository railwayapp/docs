export interface FrontMatter {
  title: string;
}

export type ISidebarContent = ISidebarSection[];

export interface IPage {
  title: string;
  slug: string;
  category?: string;
}

export interface ISidebarSection {
  title?: string;
  pages: IPage[];
}

export namespace Search {
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
