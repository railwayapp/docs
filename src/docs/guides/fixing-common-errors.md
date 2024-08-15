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
        - How to solve the error (`## Solution`). Solutions may have sections
          underneath it for language/framework/stack-specific solutions, e.g.:
            - Python
            - Go
            - ...
*/}

When deploying to Railway, you may encounter some errors that prevent your
application from working as expected. These are descriptions and solutions to errors that
users commonly encounter.

## Application Error: This application failed to respond

After deploying your application, you encounter this screen when accessing
your application's domain:
<Image src="https://res.cloudinary.com/railway/image/upload/v1722017042/docs/application-error_wgrwro_i4tjkl.png"
alt="Screenshot of application failed to respond error"
width={1080} height={950}
quality={100} />

This error occurs when Railway is unable to connect to your application, making your request fail with status code 502 (Bad Gateway).

Railway needs to know how to communicate with your application. When you
deploy and expose a web application on Railway, we expect your web server
to be available at host `0.0.0.0` and a port that we provide in the form
of a `PORT` variable. The `PORT` variable is automatically injected by
Railway into your application's environment.

Thus, your web server must listen on host `0.0.0.0` and the port that
Railway provides in the `PORT` environment variable.

### Solution

To fix this, start your application's server using:
* Host = `0.0.0.0`,
* Port = Value of the `PORT` environment variable provided by Railway.

<Banner variant="info">
Alternatively, you can set a custom `PORT` service variable in your
Railway environment to tell Railway that your application is available
at the port you specified. For more information, check out
[Defining Variables](/develop/variables#defining-variables).
**This approach is not recommended**.
</Banner>

Below are some solution examples for common languages and frameworks.

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

## Post requests turn into GET requests

You might encounter this issue when testing your backend with tools like curl, where your **POST** requests are all converted into **GET** requests when they reach your app.

Depending on the application, this may result in your application returning either a 405 Method Not Allowed or a 404 Not Found status code.

This occurs because your request was made using HTTP. Railway will attempt to redirect your insecure request with a 301 Moved Permanently status code.

When an HTTP client encounters a 301 Moved Permanently redirect, the client will follow the redirect. However, according to the <a href="https://www.rfc-editor.org/rfc/rfc7231#section-6.4.2" target="_blank">HTTP/1.1 specifications</a>, the client will typically change the request method from POST to GET when it follows the redirect to the new URL.

Fortunately, the solution is simple: Ensure you are using HTTPS when calling your Railway-hosted services.