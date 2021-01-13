---
title: MongoDB
---

The Railway MongoDB plugin allows you to provision and connect to a
MongoDB database with zero configuration.

### Install

When you run `railway run` in a project with the MongoDB plugin installed, we inject several environment variables.

- `MONGOHOST`
- `MONGOPORT`
- `MONGOUSER`
- `MONGOPASSWORD`
- `MONGO_URL`

### Example Usage

This example requires that you run with `railway run`.

```js
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });

const Cat = mongoose.model('Cat', { name: String });
const kitty = new Cat({ name: 'Zildjian' });
kitty.save().then(() => console.log('meow'));
```

```ruby
require 'mongo'

client = Mongo::Client.new(ENV.MONGO_URL)
db = client.database

db.collections # returns a list of collection objects
db.collection_names # returns a list of collection names
```

```python
import pymongo

client = pymongo.MongoClient(os.environ.get('MONGO_URL'))
db = client.testdb
db.cats.find()
```

### Examples

You can find examples that use the MongoDB plugin at
[github.com/railwayapp/examples](https://github.com/railwayapp/examples).
