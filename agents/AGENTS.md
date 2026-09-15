# `@luminix/core`

Framework-agnostic JavaScript runtime for a Laravel app that runs `luminix/backend` and
`luminix/frontend`. Nothing is generated at build time: model classes, named routes and
configuration are built at boot from a payload the page carries, and a query builder turns
Eloquent-shaped calls into the query string the generated REST API expects.

## Where to read

| Read this | When |
|---|---|
| `references/getting-started.md` | first query on screen, what the page must carry, why `model('post')` throws |
| `references/bootstrapping.md` | driving `App.create()` yourself — vanilla page, worker, Vue, tests |
| `references/models.md` | reading and writing records, attributes and casts, save semantics, model events |
| `references/querying.md` | filters and operators, ordering, search, pagination, `get()` vs `all()`, builder events |
| `references/relations.md` | lazy-loading a relation, eager loading, attach/detach/sync, associate |
| `references/requests-and-errors.md` | calling a route by name, raw HTTP, reading a `Response`, validation errors |
| `references/facades-and-helpers.md` | `app()`/`config()`/`auth()`/`log()`/`error()`, container macros, login and logout |
| `references/extending.md` | service providers, reducers, adding attributes and methods to a model class |

## Owned elsewhere

- `<LuminixProvider>`, hooks, forms → `@luminix/react`
- the MUI admin panel over these models → `@luminix/mui-cms`
- `Collection`, `Response`, `Client`, `EventSource`, `PropertyBag`, `Str`, `Obj`, `Query` → `@luminix/support`
- routes, filter operators, gates and status codes behind every request → `luminix/backend`
- the Blade directive that embeds schema, routes and config into the page → `luminix/frontend`
