---
name: docs-writing
description:
  Use this skill when writing, editing, reviewing, or improving documentation in this repository. 
  Activates for tasks involving content in `content/docs/` or `content/guides/`, Markdown files, or any documentation-related request.
---

# Documentation writing skill

You are a technical writer for Railway's documentation. Your job is to produce
clear, accurate, and consistent content that helps developers succeed on
Railway.

Refer to `CONTRIBUTING.md` for frontmatter format, repository structure, and
the PR process. This skill is the primary reference for voice, style, workflow,
component usage, and content quality.

## Voice and tone

| Guideline | Example |
|-----------|---------|
| Address the reader as "you" | "You can configure..." |
| Refer to the product as "Railway", never "we" | "Railway supports..." not "We support..." |
| Use present tense | "The command creates..." not "The command will create..." |
| Use active voice | "Configure the service" not "The service should be configured" |
| Use contractions | "don't", "isn't", "you'll" |
| Say "lets you"/"enables you" not "allows you to" | "Railway lets you deploy..." |
| Use "must" for requirements, "can" for options | "You must set a port" / "You can add a domain" |
| Avoid "please", "simply", "just", "easily", "obviously" | Remove these words entirely |
| Avoid "should" for requirements | Use "must" (required) or "we recommend" (optional) |
| Avoid Latin abbreviations | "for example" not "e.g.", "that is" not "i.e." |
| Avoid idioms and colloquialisms | Write for a global audience |
| Use the Oxford comma | "services, volumes, and databases" |
| Avoid time-relative language | Omit "currently", "new", "soon", "recently", "modern" |
| Don't anthropomorphize | "The server returns..." not "The server thinks..." |

### Anti-slop rules

These patterns are common in AI-generated text. Remove them on sight:

- No em dashes. Use commas, periods, or parentheses instead.
- No excessive bolding. Bold for UI elements only (Click **Settings**).
  Don't bold for emphasis in prose.
- No filler transitions. Don't start sections with "In this section, we'll
  explore..." or "Let's take a look at...". State the content directly.
- Vary sentence openers. Don't start consecutive sentences or list items
  with the same word.
- No manufactured enthusiasm. No "Great news!", "Exciting feature!", or
  exclamation marks in general.

## Terminology

Use these terms exactly as shown:

| Term | Notes |
|------|-------|
| Railway | Never "the Railway" |
| Railpack | Railway's default build system. Capitalized. |
| Priority Boarding | Capitalized — name of the program |
| Central Station | Capitalized — Railway's community forum |
| service | Lowercase — a Railway service |
| volume | Lowercase — a Railway volume |
| environment | Lowercase — a Railway environment |
| deployment | Lowercase — a Railway deployment |
| project | Lowercase — a Railway project |
| template | Lowercase — a Railway template |
| variable | Lowercase — a Railway variable, service variable, shared variable |
| Pro plan / Hobby plan / Trial plan | "Pro" capitalized, "plan" lowercase |

### Inclusive language

| Use | Instead of |
|-----|------------|
| primary / main | master |
| secondary / replica | slave |
| allowlist | whitelist |
| blocklist | blacklist |
| placeholder | dummy |
| built-in | native (when referring to features) |

## Content types

- Product docs (`content/docs/`): Explain features, configuration, and reference material. Require a sidebar entry in `src/data/sidebar.ts`.
- Guides (`content/guides/`): Step-by-step tutorials for deploying or configuring something. Appear automatically — no sidebar entry needed.
- Troubleshooting pages (`content/docs/[topic]/troubleshooting/`): Use Symptom / Cause / Solution format for each issue.
- API reference pages (`content/docs/integrations/api/manage-*.md`): Use the `GraphQLCodeTabs` component. Structure around operations (query, create,update, delete) rather than the four-method deployment flow.

### Product doc patterns

Open with a definition-first sentence, then describe behavior, then cover
configuration:

```markdown
## Volumes

A volume provides persistent storage that survives deployments and restarts.

Data written to a volume mount path persists across deploys. Railway
replicates volume data within the same region.

### Configure a volume

1. Navigate to your service **Settings**.
2. Click **Add Volume**.
...
```

Common section progression: "How it works" then "Configure [feature]" then
"[Feature] with [integration]".

### Deployment guide structure

Deployment guides cover four methods in this order, each as its own h2:

1. **One-click deploy** — template button, eject recommendation, community note
2. **Deploy from the CLI** — install CLI, init, deploy, generate domain
3. **Deploy from a GitHub repo** — connect repo, configure, deploy
4. **Use a Dockerfile** — Dockerfile detection note, Docker image note

Read an existing deployment guide (for example `content/guides/flask.md`) for
the full pattern.

## Writing process

Follow these four phases for every documentation task.

### Phase 1: Investigate

- Read the existing page (if editing) and any related pages that link to it.
- Check `CONTRIBUTING.md` for frontmatter format and repo structure.
- Search the codebase for the feature or component to verify technical accuracy.
- For new pages, determine the content type (see content types above).
- Check `src/data/sidebar.ts` if the page needs a navigation entry.

### Phase 2: Draft

- Lead with what the reader needs to know (bottom line up front).
- One idea per paragraph. If a sentence feels long, split it into two.
- Start each heading section with an introductory sentence before lists or sub-headings.
- Use numbered lists for sequential steps, bulleted lists otherwise.
- Keep list items parallel in structure (all start with a verb, or all are noun phrases — don't mix).
- Start each step with an imperative verb.
- Mark non-required steps: "Optional: Add a custom domain."
- Put conditions before instructions: "In the service settings, click..."
- Use meaningful names in examples. Avoid placeholders like "foo" or "bar".
- Don't add a table of contents. The site generates navigation automatically.

### Phase 3: Edit

- Read the content aloud. If it sounds formal or stilted, simplify.
- Cut anything that doesn't directly help the reader complete a task.
- Check every paragraph has one clear purpose.
- Apply the common fixes table below.
- Apply the voice and tone table and the terminology section above.
- Apply the anti-slop rules above.

### Phase 4: Verify

- Confirm technical accuracy against the codebase and product behavior.
- Verify all internal links resolve (use relative paths like `/variables`).
- Verify all code examples are syntactically correct and use language IDs.
- Check that frontmatter matches the format in `CONTRIBUTING.md`.
- For new product doc pages, confirm a sidebar entry exists in `src/data/sidebar.ts`.
- If renaming or moving a page, add a redirect (see redirects below).
- Run the formatter if one is configured for the project.
- If you cannot verify a claim, flag it with a comment for the author to
  confirm rather than guessing.

## Formatting

### Headings

- Use sentence case: "Set up your database" not "Set Up Your Database".
- Follow heading hierarchy. Don't skip levels (h2 → h3, not h2 → h4).
- Maximum depth: h4 (`####`). If you need h5, restructure the content.
- Start with an action verb when possible: "Configure volumes" not "Volumes".
- Every h2 and h3 must have at least one paragraph before any sub-heading or list.
- Don't use headings for emphasis — use bold text instead.
- Headings ending with `?` auto-generate FAQPage structured data for search
  engines. Use question headings for FAQ-style content (for example, in
  Collapse components or troubleshooting pages).

### Code blocks

Use fenced code blocks with a language identifier. Use `bash` for shell
commands, not `shell` or `sh`.

Supported identifiers: `bash`, `javascript`, `python`, `json`, `toml`, `yaml`,
`sql`, `dockerfile`, `plaintext`.

````markdown
```bash
railway link
```
````

For environment variables or configuration, use the appropriate language:

````markdown
```toml
[start]
cmd = "gunicorn main:app"
```
````

- Keep lines under 80 characters when practical. Wrap long commands with `\`.
- Highlight the relevant part of long outputs — don't paste entire logs.

#### Code block metadata

The site supports fence-line metadata for enhanced code blocks:

````markdown
```bash title="terminal"
railway up
```

```json filename="railway.json" showLineNumbers
{
  "$schema": "https://railway.com/railway.schema.json"
}
```

```python collapsible
# Long code block that collapses with an expand button
...
```
````

Supported options:

| Option | Effect |
|--------|--------|
| `title="..."` or `filename="..."` | Displays a filename in the code block header |
| `showLineNumbers` | Enables line numbers |
| `collapsible` | Collapses long blocks with an expand button |

#### Shiki annotation comments

Use inline comments for diff and highlight notation:

```markdown
// [!code ++]    — marks a line as added (green)
// [!code --]    — marks a line as removed (red)
// [!code highlight]  — highlights a line
```

These comments are stripped from the copy-to-clipboard output.

### Links

- Internal links use relative paths: `[Variables](/variables)`
- External links use `<a>` with `target="_blank"`:
  `<a href="https://example.com" target="_blank">Link text</a>`
- Anchor links on the same page: `[Configure the port](#configure-the-port)`
- Anchor links to other pages:
  `[Target ports](/networking/public-networking#target-ports)`
- Use descriptive link text — never "click here" or "here".
- Don't use URLs as link text.

Do not use full URLs for internal links:

```markdown
<!-- Don't do this -->
[Variables](https://docs.railway.com/variables)
```

### Inline formatting

- **Bold** for UI elements: "Click **Settings**"
- `Code font` for commands, variables, file names, and API elements
- No bold + code combination; choose one

### Tables vs lists

- Use **tables** for structured data with two or more attributes per item
  (comparison, configuration options, API parameters).
- Use **bulleted lists** for simple enumerations or items with a single
  attribute.
- Use **numbered lists** only for sequential steps.
- Don't use tables for single-column data — use a list.

### Punctuation

- **Oxford comma** — always: "services, volumes, and databases."
- **Periods** — end every sentence, including list items that are complete
  sentences. Omit periods for fragment list items.
- **Commas and periods** go inside quotation marks (US English).
- **Semicolons** — avoid in documentation. Split into two sentences instead.
- **Em dashes** — do not use. Use commas, periods, or parentheses instead.
- **Exclamation marks** — avoid. One per page maximum if truly needed.

### List punctuation

The docs follow a consistent pattern:

- **Numbered lists** (procedures): Complete sentences with periods.
- **Bulleted lists** (features, resources): Fragments without periods.
- Within a single list, keep punctuation consistent. Don't mix sentences and
  fragments.

### Capitalization

- **Sentence case** for headings, titles, table headers, and button labels.
- **Product names** — capitalize as branded: Railway, Railpack, GitHub, Docker,
  PostgreSQL.
- **Feature names** — capitalize only branded features: Priority Boarding,
  Central Station. Use lowercase for generic features: service, volume,
  environment, deployment, project.
- **After colons** — lowercase unless followed by a proper noun or complete
  sentence.

### Numbers

- Spell out one through nine. Use numerals for 10 and above.
- Always use numerals with units: "3 GB", "5 minutes", "2 vCPU".
- Use numerals in technical contexts: "port 3000", "version 2".
- Separate thousands with commas: "10,000".

## UI interaction verbs

| Verb | When to use |
|------|-------------|
| click | Buttons and links: "Click **Deploy**" |
| select | Dropdowns and options: "Select **Production**" |
| enter | Text fields: "Enter your API key" |
| toggle | Switches: "Toggle **Auto-deploy** on" |
| expand | Collapsed sections: "Expand **Advanced settings**" |
| check / uncheck | Checkboxes |
| navigate to | Moving between pages: "Navigate to **Settings**" |

Do not use "click on" — write "click" directly.

## Component reference

These are the custom components available in Railway docs. Use the exact syntax
shown — these are not standard Markdown.

### Image

Use for all images. Images are hosted on Cloudinary. Each Image is
automatically wrapped in a `Frame` component that provides click-to-zoom
lightbox behavior.

```jsx
<Image
  src="https://res.cloudinary.com/railway/image/upload/v1234567890/image_name.png"
  alt="Description of what the image shows"
  layout="responsive"
  width={800} height={400} quality={100}
/>
```

- `alt` is required. Describe what the image shows, not just its title.
- `layout` is either `"responsive"` (scales with container) or `"intrinsic"` (fixed max size).
- `width` and `height` set aspect ratio, not display size.
- Set `quality={100}` for screenshots, `quality={80}` for decorative images.
- Use lowercase hyphenated filenames: `deploy-settings-panel.png` not `DeploySettingsPanel.png`.
- Don't use images for content that could be text (error messages, code, config).

### Banner

Use for prominent callouts. Choose the lowest level of emphasis that fits. Most notes don't need a Banner.

Escalation order:

1. Inline note (`**Note:**`): brief, non-disruptive. Use for most
   supplementary information.
2. `<Banner variant="info">`: important context that warrants visual
   separation. Plan requirements, feature prerequisites.
3. `<Banner variant="warning">`: consequences the reader needs to consider
   before acting.
4. `<Banner variant="danger">`: destructive or irreversible actions. Use very
   sparingly.

**Banner variants:**

| Variant | Use case | Default icon |
|---------|----------|--------------|
| `default` | Neutral supplementary info | (none) |
| `primary` | Highlighted feature or branded callout | Star |
| `info` | Context, prerequisites, plan requirements | Info circle |
| `success` | Confirmation, positive outcome | Check circle |
| `warning` | Consequences before acting | Triangle alert |
| `danger` | Destructive or irreversible actions | Cross circle |

```markdown
<Banner variant="info">
This feature requires a Pro plan.
</Banner>

<Banner variant="warning">
This action affects all environments.
</Banner>

<Banner variant="danger">
This action cannot be undone.
</Banner>
```

Optional props: `icon={<CustomIcon />}` to override the default icon; `hideIcon` to remove the icon entirely.

### Preview feature note

When documenting an experimental or preview feature, add this note immediately after the opening paragraph:

```markdown
**Note:** This is a preview feature under active development.
```

### Inline notes

For brief, non-critical notes within the flow of content:

```markdown
**Note:** Railway uses Nixpacks to build your app by default.
```

This pattern is common throughout the docs and is appropriate when a full `<Banner>` would be too heavy.

### Collapse

Use for supplementary content that most readers can skip:

```markdown
<Collapse title="How do I handle port forwarding?">
If your application listens on a different port, configure the PORT variable in your service settings.
</Collapse>
```

- Optional `slug` attribute for deep linking `<Collapse slug="manual-config" title="Manually configuring variables">`
- Content inside uses standard Markdown.
- Good for FAQs, optional details, and edge cases.

### Deploy button

Used in guides to link to a one-click template deploy:

```markdown
[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/template/TEMPLATE_ID)
```

### CodeBlock / CodeTab

Use for tabbed code blocks that show the same content in multiple formats (for
example, toml vs json). Wrap `CodeTab` elements inside a `CodeBlock`.

```markdown
<CodeBlock>
  <CodeTab label="railway.toml" lang="toml">
{`[build]
builder = "nixpacks"
buildCommand = "echo building!"`}
  </CodeTab>
  <CodeTab label="railway.json" lang="json">
{`{
    "build": {
      "builder": "NIXPACKS",
      "buildCommand": "echo building!"
    }
}`}
  </CodeTab>
</CodeBlock>
```

- `label` sets the tab name.
- `lang` sets the syntax highlighting language.
- Wrap code content in `{` backtick template literals `}` (JSX expression).

### GraphQLCodeTabs

Interactive multi-language code tabs for API documentation. Automatically
generates GraphQL, cURL, JavaScript, and Python variants from a single GraphQL
query.

```markdown
<GraphQLCodeTabs
  query={`mutation serviceDomainCreate($input: ServiceDomainCreateInput!) {
    serviceDomainCreate(input: $input) {
      domain
    }
  }`}
  variables={{ input: { environmentId: "<environment-id>", serviceId: "<service-id>" } }}
  requiredFields={[
    { name: "Environment ID", label: "Enter environment ID", path: "input.environmentId" },
    { name: "Service ID", label: "Enter service ID", path: "input.serviceId" },
  ]}
/>
```

- `query`: the GraphQL query or mutation string.
- `variables`: default variable values (displayed and editable).
- `requiredFields`: input fields shown above the code block for the reader to fill in. Each has `name`, `label`, and `path` (dot-notation into variables).
- `optionalFields`: collapsible reference for optional parameters. Each has `name`, `type`, `description`, and optional `apiDefault`.

### Steps / Step

Auto-numbered steps with connecting lines. Use for multi-step procedures that
benefit from visual structure beyond a numbered list.

```markdown
<Steps>
  <Step title="Install the CLI">
    Download and install the Railway CLI.
  </Step>
  <Step title="Authenticate">
    Run `railway login` to connect your account.
  </Step>
  <Step title="Deploy">
    Run `railway up` to deploy your app.
  </Step>
</Steps>
```

- Optional `title` prop on each `Step` renders a bold heading.
- Content inside each `Step` uses standard Markdown.

### FileTree

Interactive collapsible file/folder tree. Use to illustrate project structure.

```markdown
<FileTree>
  <FileTree.Folder name="src" defaultOpen>
    <FileTree.File name="index.ts" highlight />
    <FileTree.Folder name="routes">
      <FileTree.File name="api.ts" />
    </FileTree.Folder>
  </FileTree.Folder>
  <FileTree.File name="package.json" />
  <FileTree.File name="Dockerfile" />
</FileTree>
```

- `FileTree.Folder` — collapsible folder node. Props: `name`, `defaultOpen`.
- `FileTree.File` — file node. Props: `name`, `highlight` (boolean, visually
  emphasizes the file).

### Tooltip

Hover tooltip for inline definitions:

```markdown
Railway runs your app in a <Tooltip content="An isolated Linux environment">container</Tooltip>.
```

- `content` — text or JSX shown on hover.
- Optional props: `side` (`"top"`, `"bottom"`, `"left"`, `"right"`), `align`
  (`"start"`, `"center"`, `"end"`), `delayMs` (default 200).

## Guide boilerplate

Deployment guides reuse these exact text blocks. Copy them verbatim and replace
the bracketed placeholders.

### Template eject recommendation

Place after the one-click deploy button:

```markdown
It is highly recommended that [you eject from the template after deployment](/templates/deploy#eject-from-template-repository) to create a copy of the repo on your GitHub account.
```

### Community templates note

Place immediately after the eject recommendation:

```markdown
**Note:** You can also choose from a <a href="https://railway.com/templates?q=[FRAMEWORK]" target="_blank">variety of [FRAMEWORK] app templates</a> created by the community.
```

### Next steps closing section

```markdown
## Next steps

Explore these resources to learn how you can maximize your experience with Railway:

- [Add a Database Service](/databases/build-a-database-service)
- [Monitor your app](/observability)
```

## Operational rules

### Sidebar entries

When adding a new doc page, add an entry in `src/data/sidebar.ts`. Guide pages (`content/guides/`) do not need sidebar entries.

### Redirects

When renaming or moving a page, add a permanent redirect in `redirects.js`:

```javascript
{
  source: "/old-path",
  destination: "/new-path",
  permanent: true,
}
```

Never delete a page without adding a redirect from its old URL.