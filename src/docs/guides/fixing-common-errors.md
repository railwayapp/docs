---
title: Fixing Common Errors
---
{/**
This page holds descriptions and solutions to common errors users may face
when deploying to Railway.

When adding a new error/section, please keep in mind that content on this
page should be as detailed as possible, and link out to relevant docs when
necessary. We want to be consistent and complete. When in doubt, try to
stick to this formula:

    - Error as section title (`## Some Error`)
        - A description of the error. Explain to users what error this is (add
          a screenshot if applicable), why this happens, and what causes it.
        - How to solve the error (`### Solution`). Solutions may have sections
          underneath it for language/framework/stack-specific solutions, e.g.:
            - Python
            - Go
            - ...
*/}

When deploying to Railway, you may encounter some errors that prevent your
application from working as expected. These are descriptions and solutions to errors that
users commonly encounter.

## Application failed to respond

After deploying your application or making changes, you might encounter this screen when accessing your application's domain:

<Image src="https://res.cloudinary.com/railway/image/upload/v1722017042/docs/application-error_wgrwro_i4tjkl.png"
alt="Screenshot of application failed to respond error"
layout="intrinsic"
width={1080} height={950}
quality={100} />

This error occurs when Railway is unable to communicate with your application, making your request fail with a status code of 502 (Bad Gateway).

For Railway to communicate with your application, your web server should be available at host `0.0.0.0` and listen on the port specified by the `PORT` environment variable, which Railway automatically injects into your application.

Separately, you need to set the correct [target port](/guides/public-networking#target-ports) for your public domain.

Without these configurations, Railway cannot establish a connection to your running application.

### Solution

To fix this, start your application's server using:

- Host = `0.0.0.0`
- Port = Value of the `PORT` environment variable provided by Railway.

Next, ensure that the target port for your public domain is set to the port your application is now listening on.

<Image src="https://res.cloudinary.com/railway/image/upload/v1726092089/docs/target_ports_eiqgw0.png"
alt="Screenshot of application failed to respond error"
layout="intrinsic"
width={700} height={634}
quality={100} />

<span style={{'font-size': "0.9em"}}>Screenshot showing that the domain was previously configured with port 3000, and the correct 8080 port.</span>

**Below are some solution examples for common languages and frameworks.**

#### Node / Express

```javascript
// Use PORT provided in environment or default to 3000
const port = process.env.PORT || 3000;

// Listen on `port` and 0.0.0.0
app.listen(port, "0.0.0.0", function () {
  // ...
});
```

#### Node / Nest

```javascript
// Use `PORT` provided in environment or default to 3000
const port = process.env.PORT || 3000;

// Listen on `port` and 0.0.0.0
async function bootstrap() {
  // ...
  await app.listen(port, "0.0.0.0");
}
```

#### Node / Next

Next needs an additional flag to listen on `PORT`:
```bash
next start --port ${PORT-3000}
```

#### Python / Gunicorn

`gunicorn` listens on `0.0.0.0` and the `PORT` environment variable by default:
```bash
gunicorn main:app
```

There is no additional configuration necessary.

#### Python / Uvicorn

`uvicorn` needs additional configuration flags to listen on `0.0.0.0` and `PORT`:
```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

#### Go / `net/http`

This example is for `net/http` in the Go standard library, but you can also apply this to other frameworks:
```go
func main() {
  // ...
  // Use `PORT` provided in environment or default to 3000
  port := cmp.Or(os.Getenv("PORT"), 3000)

  log.Fatal(http.ListenAndServe((":" + port), handler))
  // ...
}
```

## POST requests turn into GET requests

You might encounter this issue when testing your backend with tools like curl, where your **POST** requests are all converted into **GET** requests when they reach your app.

Depending on the application, this may result in your application returning either a 405 Method Not Allowed or a 404 Not Found status code.

This occurs because your request was made using HTTP. Railway will attempt to redirect your insecure request with a 301 Moved Permanently status code.

When an HTTP client encounters a 301 Moved Permanently redirect, the client will follow the redirect. However, according to the <a href="https://www.rfc-editor.org/rfc/rfc7231#section-6.4.2" target="_blank">HTTP/1.1 specifications</a>, the client will typically change the request method from POST to GET when it follows the redirect to the new URL.

### Solution

Fortunately, the solution is simple: Ensure you are using HTTPS when calling your Railway-hosted services.