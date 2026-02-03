# Railway Documentation

This is the official documentation for [Railway](https://railway.com). You can view it at [docs.railway.com](https://docs.railway.com).

## Local Development

You'll need to have [Node.js](https://nodejs.org) and [pnpm](https://pnpm.io) installed. You can then install dependencies and start the development server by running the following commands:

```bash
pnpm install
pnpm dev
```

Open [localhost:3001](http://localhost:3001) to see the docs.

### Available Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server on port 3001 |
| `pnpm build` | Create production build |
| `pnpm start` | Start production server |
| `pnpm clean` | Remove build artifacts |

## Local Search Setup

Search is powered by Meilisearch. To test search functionality locally, you'll need Docker.

### Search Commands

| Command | Description |
|---------|-------------|
| `pnpm search:start` | Start the Meilisearch container |
| `pnpm search:stop` | Stop the Meilisearch container |
| `pnpm search:build` | Index local docs (requires dev server running) |
| `pnpm search:setup` | Start Meilisearch and index docs in one command |

### Quick Setup

1. Start the dev server in one terminal:
   ```bash
   pnpm dev
   ```

2. In another terminal, run the full search setup:
   ```bash
   pnpm search:setup
   ```

This starts Meilisearch on port 7700 and indexes all documentation pages from your local dev server.

## Contributing

Contributions from the community are welcome! Please read the [Contributing Guide](CONTRIBUTING.md) for details on how to submit changes.
