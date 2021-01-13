---
title: MySQL
---

The Railway PostgreSQL plugin allows you to provision and connect to a
PostgreSQL database with zero configuration.

### Connect

When you run `railway run` in a project with the Postgres plugin installed, we inject several environment variables.

- PGHOST
- PGPORT
- PGUSER
- PGPASSWORD
- PGDATABASE
- DATABASE_URL

Many libraries will automatically look for the `DATABASE_URL` variable and use
it to connect to Postgres. You can also manually use these variables however you
like.

### Example Usage

Run these examples with `railway run`.

```js
import pg from "pg";

// connects with the DATABASE_URL env var
const client = new pg.Pool();

client.query("SELECT NOW()");
```

```ruby
require 'pg'

# connects with the DATABASE_URL env var
conn=PG.connect()
res = conn.exec("SELECT now()")
res.each{|row|
    puts row
}
```

```python
import psycopg2

# connects with the DATABASE_URL env var
conn = psycopg2.connect("")
cur = conn.cursor()
cur.execute("SELECT NOW()")
rows = cur.fetchall()

for row in rows:
    print(row)
```

### Examples

You can find examples that use the Postgres plugin at
[github.com/railwayapp/examples](https://github.com/railwayapp/examples).
