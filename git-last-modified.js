// Last-modified dates for docs content, from git history.
//
// Used by content-collections.ts (page footer, article:modified_time,
// JSON-LD dateModified) and next-sitemap.config.js (<lastmod>).
//
// Railway builds don't include a full .git directory, so `git log` in the
// build context returned nothing and every date was silently dropped. When
// the working tree has no usable (full) history, fetch it: the docs repo is
// public, and a blob-less bare clone carries only commits and trees, which
// is all `git log --name-only` needs.
const { execFileSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const REPO_URL = "https://github.com/railwayapp/docs.git";
const HISTORY_DIR = path.join(os.tmpdir(), "railway-docs-history.git");

let cache = null;

const git = (args, opts = {}) =>
  execFileSync("git", args, {
    encoding: "utf-8",
    stdio: ["ignore", "pipe", "ignore"],
    maxBuffer: 256 * 1024 * 1024,
    ...opts,
  });

/** Git args that point at a repository with full history, or null. */
function historySource() {
  try {
    const shallow = git(["rev-parse", "--is-shallow-repository"]).trim();
    if (shallow === "false") return [];
  } catch {
    // Not a git checkout (e.g. Railway build context).
  }

  try {
    if (fs.existsSync(HISTORY_DIR)) {
      git(["--git-dir", HISTORY_DIR, "fetch", "--quiet", "origin"], {
        timeout: 60_000,
      });
    } else {
      const branch = process.env.RAILWAY_GIT_BRANCH || "main";
      git(
        [
          "clone",
          "--quiet",
          "--bare",
          "--filter=blob:none",
          "--single-branch",
          "--branch",
          branch,
          REPO_URL,
          HISTORY_DIR,
        ],
        { timeout: 120_000 },
      );
    }
    return ["--git-dir", HISTORY_DIR];
  } catch {
    return null;
  }
}

/**
 * Map of repo-relative file path → ISO date of the last commit touching it.
 * Built once per process from a single `git log` walk.
 */
function getLastModifiedMap() {
  if (cache) return cache;
  cache = new Map();

  const source = historySource();
  if (source == null) return cache;

  let log = "";
  try {
    const ref = source.length ? ["HEAD"] : [];
    log = git([
      ...source,
      "log",
      ...ref,
      "--format=%x00%cI",
      "--name-only",
      "--no-renames",
      "--",
      "content",
    ]);
  } catch {
    return cache;
  }

  // Newest commits come first, so the first date seen for a file wins.
  for (const entry of log.split("\0")) {
    const [date, ...files] = entry.split("\n");
    if (!date) continue;
    for (const file of files) {
      if (file && !cache.has(file)) cache.set(file, date.trim());
    }
  }
  return cache;
}

/** Last-modified ISO date for a content file (repo-relative), or null. */
function lastModifiedForFile(filePath) {
  return getLastModifiedMap().get(filePath) ?? null;
}

/** Last-modified ISO date for a public docs URL path, or null. */
function lastModifiedForUrl(urlPath) {
  const clean = urlPath.replace(/^\/+|\/+$/g, "");
  const [root, rest] = clean.startsWith("guides/")
    ? ["content/guides", clean.slice("guides/".length)]
    : ["content/docs", clean];
  const base = rest ? `${root}/${rest}` : root;
  const candidates = [
    `${base}.md`,
    `${base}.mdx`,
    `${base}/index.md`,
    `${base}/index.mdx`,
  ];
  for (const candidate of candidates) {
    const date = lastModifiedForFile(candidate);
    if (date) return date;
  }
  return null;
}

module.exports = {
  getLastModifiedMap,
  lastModifiedForFile,
  lastModifiedForUrl,
};
