# Requests and errors

## Named routes

The route table comes from the page payload; nothing is hard-coded and an unknown name throws
`RouteNotFoundException`.

```typescript
import { route, Route } from '@luminix/core';

route().url('luminix.post.index');                       // app.url + the path
route().url(['luminix.post.show', { id: 42 }]);          // '/luminix-api/posts/42'
route('luminix.post.show', { id: 42 });                  // same, as a one-liner
route().exists('admin.customer.index');                  // routes the user may not reach are absent
route().methods('luminix.post.store');                   // ['post']
```

A replacer must match the placeholders exactly: a missing or an extra key is a `TypeError` naming
it. Omitting the replacer entirely leaves the `{placeholders}` in place for the
`replaceRouteParams` reducer to fill — that is how a client-side router resolves them.

`route().exists()` is the feature flag for gated UI: a route the backend did not expose to this user
is simply not in the table.

## Calling a route

```typescript
const response = await Route.call('luminix.post.index', (c) => c.withQueryParameters({ page: 2 }));
await Route.call('luminix.post.store', (c) => c.withData(payload), 'post.store');
await Route.call(['luminix.post.show', { id }]);
```

`call(generator, tap?, errorBag?)` picks the HTTP verb from the route table, hands you the `Client`
to configure, and **resolves for every status** — a 422 or a 500 settles normally, exactly like
Laravel's `Http` facade. Branch on `response.successful()`, or opt into throwing with
`response.throw()`.

Before the request it clears the named error bag (`default` when you pass none); after it, a
validation failure fills that bag with one joined message per field, and any other failure fills it
with the server's `message` under the `axios` key. That is what makes a failed call readable from
anywhere without passing the response around.

Model writes do not follow this rule: `save()`, `delete()` and friends call `throw()` for you and
reject -> `models.md`.

## Raw HTTP

`Http` builds a fresh `Client` per call, for URLs that are not in the route table:

```typescript
import { Http } from '@luminix/core';

const res = await Http.acceptJson().withToken(token).get('/api/health');
await Http.post(url, payload);
```

Everything it returns is a `@luminix/support` `Response`: `successful()`, `ok()`, `status()`,
`json()` / `json('key')`, `failed()`, `unprocessableEntity()`, `throw()`, `throwIfServerError()`.
`json('key')` is the supported way to read one field — `_response` is internal.

## Validation errors

```typescript
import { isValidationError } from '@luminix/support';

const response = await Route.call('luminix.post.store', (c) => c.withData(payload));
if (isValidationError(response)) {
    const errors = response.json('errors');        // { field: string[] }
} else if (response.successful()) {
    const id = response.json('id');
}
```

`isValidationError` is a 422 with Laravel's error shape. If you prefer exceptions, `response.throw()`
inside `try/catch` gives a plain `Error`; narrow it with axios's `isAxiosError` and read
`err.response`.

## Error bags

A bag is a named map of field → message. Besides what `Route.call()` writes, the `default` bag is
pre-filled at boot from the validation errors the page itself carries — the classic full-page
POST-redirect, with no 422 response to parse:

```typescript
import { error, Error } from '@luminix/core';

error('email');                        // first message for a field in the default bag, or null
Error.get('password', 'registration'); // a named bag
Error.all('registration');
Error.add('email', 'Already taken.', 'registration');
Error.clear('registration');
```

A model write targets the bag named by `model.getErrorBag('store' | 'update')` -> `models.md`.

## Headers on every request

`Route.call()` and every model write go through one client; a `clientOptions` reducer is where a
token or a header joins them:

```typescript
Route.reducer('clientOptions', (options, routeName) => ({
    ...options,
    headers: { ...options.headers, Authorization: `Bearer ${token}` },
}));
```

It does not reach anything else: `Http` hands out a fresh client per call, and a plugin that builds
its own client needs its own wiring. The companion `clientError` reducer rewrites what a failed
call puts in the error bag.
