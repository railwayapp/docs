export interface Author {
  name: string;
  link: string;
  handle: string;
}

export const authors: Record<string, Author> = {
  runzer: {
    name: "Jake Runzer",
    link: "https://twitter.com/jakerunzer",
    handle: "jakerunzer",
  },
  cooper: {
    name: "Jake Cooper",
    link: "https://twitter.com/JustJake",
    handle: "justjake",
  },
};
