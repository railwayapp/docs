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
