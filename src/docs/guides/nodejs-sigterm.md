---
title: Why SIGTERM handling may not work with Node.js runtime scripts
description: SIGTERM might sometimes fail to process on shutdown. Here's why
---

If you’ve tried to capture SIGTERM in your Node.js app and noticed your handler never runs, the cause is usually the package manager.

When you start your app with NPM, Yarn, or PNPM, the package manager becomes the main process, not your app.
Because the signal has been intercepted, the service will eventually be force quit which is displayed as a sudden "crash".

The fix is simple: start Node directly.

Head to your service's Settings tab. From there scroll to the "Deploy" section and change "Custom Start Command".

Instead of this:
```bash
npm run start
```

Use this:
```bash
node index.js
```

With this change, your app will receive SIGTERM directly and can handle shutdown cleanly.
