export interface FrontMatter {
  title: string;
  id: string;
  wordCount: number;
}

export type SidebarContent = SidebarSection[];

export interface Page {
  title: string;
  slug: string;
}

export interface SidebarSection {
  title?: string;
  pages: Page[];
}
