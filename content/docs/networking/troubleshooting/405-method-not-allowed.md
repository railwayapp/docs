---
title: 405 Method Not Allowed
description: Learn how to troubleshoot and fix the '405 Method Not Allowed' error.
---

## What This Error Means

This error is returned by your application when you attempt to make a POST request to your application, but the request is redirected to a GET request.

Depending on the application, this may result in your application returning either a 405 Method Not Allowed or a 404 Not Found status code.

Seemingly POST requests are being turned into GET requests.

## Why This Error Can Occur

This occurs because your request was made using HTTP. Railway will attempt to redirect your insecure request with a 301 Moved Permanently status code.

When an HTTP client encounters a 301 Moved Permanently redirect, the client will follow the redirect. However, according to the <a href="https://www.rfc-editor.org/rfc/rfc7231#section-6.4.2" target="_blank">HTTP/1.1 specifications</a>, the client will typically change the request method from POST to GET when it follows the redirect to the new URL.

## Solution

Ensure you are explicitly using `https://` when calling your Railway-hosted services.

For example, if you are using `curl` to test your application, you should use the following command:

```bash
curl -X POST https://your-app.railway.app/api
```

Notice the `https://` prefix.

This ensures that the request is made using HTTPS, avoiding the 405 Method Not Allowed error that your application would otherwise return.
