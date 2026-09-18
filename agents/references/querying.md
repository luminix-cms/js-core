# Querying

The builder collects a query string and sends it to the model's `index` route. Nothing is evaluated
client-side: every clause below is a parameter `luminix/backend` interprets.

```typescript
const { data, meta, links } = await model('post').query()
    .where('status', 'published')
    .where('views', '>=', 100)
    .whereBetween('created_at', ['2026-01-01', '2026-06-30'])
    .whereNotNull('published_at')
    .orderBy('created_at', 'desc')
    .searchBy('laravel')
    .limit(20)
    .get({ page: 2 });
```

`Post.where(...)`, `Post.orderBy(...)`, `Post.searchBy(...)`, `Post.minified()`, `Post.limit(...)`,
`Post.whereNull(...)` and their siblings open a builder too — `.query()` is optional.

## Filters

`where(column, value)` is an exact match; `where(column, operator, value)` appends an operator
suffix to the parameter key. `where(callback)` hands the builder to a function, for composing
clauses conditionally.

| Written | Sent |
|---|---|
| `where('status', 'active')` | `where[status]=active` |
| `where('age', '>=', 18)` | `where[age:greaterThanOrEquals]=18` |
| `where('name', '!=', 'Alice')` | `where[name:notEquals]=Alice` |
| `where('title', 'contains', 'api')` | `where[title:contains]=api` |
| `whereBetween('age', [18, 65])` | `where[age:between][]=18&…` |
| `whereNull('deleted_at')` | `where[deleted_at:null]=` |

`=`, `!=`, `>`, `>=`, `<`, `<=` are translated; any other operator string is passed through
verbatim, which is how the backend's named operators (`contains`, `startsWith`, `endsWith`, `like`,
`relation`, and project macros) are reached. An operator the backend does not implement is a server
error, not a client one — `notLike` exists in the TypeScript union and has no counterpart in
`luminix/backend`.

**Filtering by a relation.** When the column names a relation, the value is a list of related keys
and the backend turns it into a `whereHas`; the explicit `relation` operator only makes that
readable:

```typescript
await model('user').query().where('roles', [1, 2]).minified().all();
// where[roles][]=1&where[roles][]=2 — same as where('roles', 'relation', [1, 2])
```

## Shaping the request

| Call | Effect |
|---|---|
| `limit(n)` | `per_page` — the page size, not a total cap |
| `searchBy(term)` | `q`, a search across the model's fillable columns. An empty string removes the parameter instead of sending an empty `q` |
| `minified()` | `minified=1` — the backend answers with key and label only, so skip it whenever the UI reads another column |
| `with(['author.team'])` / `withOnly` / `without` | the `with` parameter. `luminix/backend` ignores it unless the model implements `scopeBeforeLuminix`/`scopeAfterLuminix` |
| `include(searchParams)` | copies a `URLSearchParams` into the query — how a URL-driven filter UI replays its own state |
| `unset(key)` | drops a parameter already set |

A builder is mutable and reusable: keep the reference and append clauses under a condition.

```typescript
const query = model('post').query().orderBy('created_at', 'desc');
if (status !== 'all') query.where('status', status);
const { data } = await query.get({ page });
```

## Getting results

| Call | Resolves to |
|---|---|
| `get({ page, replaceLinks })` | `{ data: Collection<Model>, meta, links }` |
| `all()` | `Collection<Model>` — every match, no pagination |
| `first()` | `Model \| null` |
| `find(id)` | `Model \| null`, filtering on the primary key |

`all()` is not a single unpaginated request: it asks for one page sized at
`config('luminix.backend.api.max_per_page', 150)`, reads `meta.last_page`, then fetches every
remaining page in parallel. On a large table that is a burst of requests — filter first, or paginate.

`replaceLinks: true` rewrites `links` and `meta.links` against the current `window.location`, so
pagination URLs point at the page the user is on rather than at the API.

`Collection` is not an array: `map()` returns another `Collection`, and `.all()` is what hands you a
plain array (`@luminix/support`).

A failed request rejects here, with `ModelQueryFailedException` carrying the original `response` —
unlike `route().call()`, which resolves. Model instances come back with `exists = true` already set.

## Builder events

The builder is an `EventSource`, which is where loading state comes from:

```typescript
const query = model('post').query();
query.on('submit',  () => setLoading(true));
query.on('success', ({ items }) => setLoading(false));
query.on('error',   ({ error }) => { setLoading(false); report(error); });
```

`change` fires whenever a clause is added. `success` carries `items` — the `Collection` for
`get()`/`all()`, the single model for `first()`/`find()`.
