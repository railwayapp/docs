import { readdirSync } from "node:fs";
import { join } from "node:path";

const deepReadDir = (dirPath: string): unknown[] =>
  readdirSync(dirPath, { withFileTypes: true }).map(dirent => {
    const path = join(dirPath, dirent.name);
    return dirent.isDirectory() ? deepReadDir(path) : path;
  });

// POSTS_PATH is useful when you want to get the path to a specific file
const POSTS_PATH = join(process.cwd(), "src/docs");

// postFilePaths is the list of all mdx files inside the POSTS_PATH directory
const postFilePaths = (deepReadDir(POSTS_PATH).flat() as string[])
  .map(path => path.replace(POSTS_PATH, ""))
  // Only include md(x) files
  .filter(path => /\.mdx?$/.test(path));
