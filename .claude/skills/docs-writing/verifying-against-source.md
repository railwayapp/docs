# Verifying against source code

Load this when a documentation change makes a technical claim and you need to
verify it against Railway's real implementation. See the gating rule in
`SKILL.md` under "Verifying against source code" for when this applies.

## Find the source repository

Most documented behavior lives in a public `railwayapp` repository. Map the doc
area to its repository:

| Doc area | Repository |
|----------|------------|
| CLI (`content/docs/cli/`, `cli.md`) | `railwayapp/cli` (Rust) |
| Builds and Railpack (`content/docs/builds/`, `build-deploy.md`) | `railwayapp/railpack` |
| TypeScript SDK, sandbox SDK examples (`sandboxes.md`) | `railwayapp/railway-ts-sdk` |
| MCP server and agent tooling (`content/docs/integrations/`, `agents.md`) | `railwayapp/railway-mcp-server` |
| Agent skills (`agents.md`) | `railwayapp/railway-skills` |
| Network diagnostics troubleshooting (`networking/`) | `railwayapp/netdiag` |

For the public GraphQL API (`content/docs/integrations/api/`), there is no
public source repo — verify against the live schema by introspecting
`https://backboard.railway.com/graphql/v2`.

If the change touches something not in this table, infer the most likely repo
and confirm it exists before cloning:

```bash
gh repo view railwayapp/<name> --json visibility,description
```

If you can't find a public source for a claim, say so in your summary rather
than guessing — flag the unverified claim for the author.

## Clone and verify

Shallow-clone the repo into `/tmp` (reuse the clone if it already exists from
this session):

```bash
DEST=/tmp/railway-src/cli
gh repo clone railwayapp/cli "$DEST" -- --depth=1 2>/dev/null \
  || git -C "$DEST" pull --ff-only
```

Then check each technical claim in the docs against the code: command and
subcommand names, flag spellings and defaults, config keys, API field names and
types, SDK method signatures, environment variable names. Explore the repo to
find where the behavior is defined (for example, the CLI defines its commands
under `src/commands/`).

Flag every mismatch — outdated flags, renamed commands, removed options, changed
defaults — for the author. Only "fix" the docs to match the code when the
correction is obvious and unambiguous; when intent is unclear, surface the
discrepancy instead of silently rewriting.
