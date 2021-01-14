---
title: Env Vars
---

The Railway Env Vars plugin allows you to specify environment variables that should be available to your code when you run `railway run`.

For example, if you use the Env Vars plugin and create a variable named `HELLO`
with the value of `world`. When you run your code with `railway run`, `HELLO`
will be available as an environment variable.

```js
console.log(process.env.HELLO);
// world
```

```ruby
print ENV.HELLO
# world
```

```python
print(os.environ.get('HELLO'))
# world
```
