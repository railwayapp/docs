# Contributing to Railway Docs

Thank you for your interest in improving Railway's documentation! Clear, accurate docs help developers succeed with Railway, and every contribution is appreciated.

If you'd like to contribute, feel free to open a pull request or create an issue. You can find open documentation issues on the [GitHub issues page](https://github.com/railwayapp/docs/issues).

## Writing Principles

Railway's documentation serves a global audience of developers with varying experience levels. Keep these principles in mind when writing:

### Write for clarity

- Focus on what the reader needs to accomplish. Include only the information necessary to complete the task.
- Use short sentences and simple words. If a sentence feels long, split it into two.
- Each paragraph should cover one idea. Start a new paragraph when you shift topics.

### Write naturally

- Use conversational language. Read your writing aloud to check if it sounds natural.
- Remove filler words like "simply," "just," "easily," and "obviously." These words add no value and can feel dismissive.
- Avoid idioms and colloquialisms that may not translate well for non-native English speakers.

### Be consistent

- Refer to the reader as "you." Refer to Railway by name rather than using "we."
- Use present tense: "The command creates a new service" rather than "The command will create a new service."
- Format headings in sentence case: "Set up your database" not "Set Up Your Database."

## Content Types

This repository contains two types of content:

### Docs

Location: `content/docs/`

Reference documentation that explains Railway's features and concepts. These pages are organized by topic in the sidebar navigation.

**Required frontmatter:**

```yaml
---
title: Page Title
description: A brief description of the page content.
---
```

### Guides

Location: `content/guides/`

Step-by-step tutorials that walk readers through specific tasks, such as deploying a framework or configuring a feature.

**Required frontmatter:**

```yaml
---
title: Guide Title
description: A brief description of what this guide covers.
---
```

**Optional frontmatter:**

```yaml
---
title: Guide Title
description: A brief description of what this guide covers.
date: "2024-01-15"
author:
  name: Author Name
  avatar: https://example.com/avatar.png
  link: https://github.com/username
tags:
  - deployment
  - nodejs
---
```

## Repository Structure

```
content/
├── docs/           # Reference documentation
│   ├── overview/
│   ├── platform/
│   ├── pricing/
│   └── ...
└── guides/         # Step-by-step tutorials

src/
├── components/     # React components
├── data/
│   └── sidebar.ts  # Navigation configuration
└── ...
```

## Adding New Content

### Adding a new docs page

1. Create a new `.md` file in the appropriate `content/docs/` subdirectory
2. Add the required frontmatter (title and description)
3. Write your content using Markdown
4. Add a navigation entry in `src/data/sidebar.ts`
5. Run `pnpm dev` to preview your changes

### Adding a new guide

1. Create a new `.md` file in `content/guides/`
2. Add the required frontmatter
3. Write your guide content
4. Guides automatically appear in the guides section (no sidebar entry needed)

## Formatting Guidelines

### Code blocks

Use fenced code blocks with a language identifier:

````markdown
```javascript
const railway = require('railway');
```
````

For shell commands, use `bash`:

````markdown
```bash
railway link
```
````

### Links

- Use relative links for internal pages: `[Variables](/variables)` not `[Variables](https://docs.railway.com/variables)`
- Make link text descriptive: `See the [deployment guide](/guides/deploying)` not `Click [here](/guides/deploying)`

### Images

- Store images in a reliable hosting service (Railway uses Cloudinary)
- Include alt text for accessibility
- Use the `<Image>` component for responsive images:

```jsx
<Image
  src="https://example.com/image.png"
  alt="Description of the image"
  width={800}
  height={400}
/>
```

### Admonitions

Use admonitions sparingly to highlight important information:

```markdown
<Warning>
This action cannot be undone.
</Warning>

<Info>
This feature requires a Pro plan.
</Info>
```

## Pull Request Process

1. **Fork the repository** and create a new branch for your changes
2. **Make your changes** following the guidelines above
3. **Test locally** by running `pnpm dev` and reviewing your changes
4. **Submit a pull request** with a clear description of what you changed and why
5. **Address feedback** from reviewers if requested

### Commit messages

Write clear, concise commit messages that describe the change:

- `Add guide for deploying Django applications`
- `Fix typo in networking documentation`
- `Update PostgreSQL connection examples`

### What to expect

- Pull requests are reviewed regularly, typically within a few days
- For larger changes, revisions may be suggested or alternative approaches discussed
- Once approved, your changes will be merged and automatically deployed

## Questions?

If you have questions about contributing, feel free to open an issue or reach out on [Central Station](https://station.railway.com).
