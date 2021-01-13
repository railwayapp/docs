export interface FrontMatter {
  title: string;
  id: string;
  wordCount: number;
}

export type ISidebarContent = ISidebarSection[];

export interface IPage {
  title: string;
  slug: string;
}

export interface ISidebarSection {
  title?: string;
  pages: IPage[];
}
