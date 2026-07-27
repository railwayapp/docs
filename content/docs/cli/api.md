---
title: railway api
description: Query the Railway public GraphQL API.
---

Explore the Railway [public GraphQL API](/integrations/api) schema and execute
authenticated operations directly from the CLI.

The intended workflow is discovery-first: search the schema for a capability,
inspect the relevant field or type, then execute a precise operation. Schema
results always come from live introspection, so they never drift from what the
API supports.

## Usage

```bash
railway api [QUERY] [COMMAND]
```

You must be authenticated to use this command. Run
[railway login](/cli/login) or set a token (see
[Tokens](/integrations/api#creating-a-token)).

## Subcommands

| Subcommand | Description |
|------------|-------------|
| `search` | Search GraphQL types and fields |
| `describe` | Describe a GraphQL type or field |
| `schema` | Print the live GraphQL introspection schema |

## Execute a query

Run `railway api` without a subcommand to execute a GraphQL document against
the Railway public API. Pass the document as an inline argument, from a file
with `--file`, or piped on stdin.

```bash
railway api 'query { me { id name } }'
```

From a file:

```bash
railway api --file query.graphql
```

From stdin:

```bash
cat query.graphql | railway api
```

### Options

| Flag | Description |
|------|-------------|
| `-f, --file <PATH>` | Read the GraphQL document from a file. Use `-` to read from stdin |
| `--variables <JSON\|@PATH>` | JSON variables object, or `@PATH` to read JSON from a file. Use `@-` for stdin |
| `--var <KEY=VALUE>` | Set a typed variable. The value is parsed as JSON when possible |
| `--raw-var <KEY=VALUE>` | Set a string variable |
| `--operation-name <NAME>` | Operation to execute when the document contains multiple operations |
| `--compact` | Print compact JSON |
| `--allow-errors` | Exit successfully even when the response has an `errors` array |

Pass the document either as `QUERY` or with `--file`, not both. The document
and variables can't both come from stdin.

### Variables

Pass variables as a JSON object, from a file, or as individual key-value
pairs:

```bash
# Inline JSON object
railway api --file query.graphql --variables '{"projectId": "abc-123"}'

# From a JSON file
railway api --file query.graphql --variables @vars.json

# Individual variables (values parsed as JSON when possible)
railway api --file query.graphql --var projectId=abc-123 --var limit=10

# Force string values
railway api --file query.graphql --raw-var name=1234
```

Values set with `--var` and `--raw-var` override keys with the same name from
`--variables`.

### Exit status

The command exits with an error when the API returns a non-2xx HTTP status or
the response contains GraphQL errors. Use `--allow-errors` to exit
successfully on GraphQL errors, for example when a script inspects the
response itself. The response body prints either way.

## Search the schema

Search the live schema for matching types and fields:

```bash
railway api search serviceInstance
```

Output is `{"results": [...], "total": N}`. Results are ranked before the
limit is applied: executable root operations first, then types, then fields.
The `total` field shows when the limit truncated the list.

### Options for `search`

| Flag | Description |
|------|-------------|
| `--kind <KIND>` | Restrict results to a kind: `all`, `type`, `query`, `mutation`, `subscription`, `field`, `input`, or `enum` (default: `all`) |
| `--limit <N>` | Maximum number of results to print (default: 25) |
| `--compact` | Print compact JSON |

Narrow results to mutation fields:

```bash
railway api search serviceInstance --kind mutation
```

## Describe a type or field

Inspect a GraphQL type, root field, or a specific field on a type using
`Parent.field` notation:

```bash
# Describe a root field, including its arguments and return type
railway api describe serviceInstance

# Describe a type and its fields
railway api describe ServiceInstance

# Describe a specific field on a type
railway api describe ServiceInstance.buildCommand
```

Output is `{"matches": [...]}` and includes union members and interface
implementors, so you can construct inline fragments for abstract types.

### Options for `describe`

| Flag | Description |
|------|-------------|
| `--compact` | Print compact JSON |

## Print the schema

Fetch and print the full introspection schema from the Railway API:

```bash
railway api schema
```

### Options for `schema`

| Flag | Description |
|------|-------------|
| `--compact` | Print compact JSON |

## Examples

### Look up your user ID

```bash
railway api 'query { me { id name email } }'
```

### Find and run a mutation

```bash
# Discover the mutation
railway api search deploymentRestart --kind mutation

# Inspect its arguments
railway api describe deploymentRestart

# Execute it
railway api 'mutation($id: String!) { deploymentRestart(id: $id) }' \
  --var id=<deployment-id>
```

### Run a saved query with variables from a file

```bash
railway api --file query.graphql --variables @vars.json
```

## Related

- [Public API](/integrations/api)
- [Introduction to GraphQL](/integrations/api/graphql-overview)
- [railway login](/cli/login)
