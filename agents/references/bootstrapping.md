# Bootstrapping by hand

Driving the lifecycle yourself — a vanilla page, Vue, a worker, a test suite: any host where
nothing calls `App.create()` for you. Only the bootstrap differs; models, query builder, facades and
reducers behave identically afterwards.

```typescript
import { App } from '@luminix/core';

App.withProviders([AnalyticsProvider])
   .withConfiguration({ app: { env: 'test', debug: true }, auth: { user: null } })
   .create();
```

A page that carries the embedded payload needs nothing but `App.create()`. Both `withProviders()`
and `withConfiguration()` must run **before** `create()` — afterwards they change nothing about the
booted container — and `create()` deep-merges the embedded payload **over** what you passed, so a
key present in both takes the page's value, not yours.

## What `create()` does, in order

| Step | Hook |
|---|---|
| reads the embedded config, if the page has it | — |
| instantiates the providers | `init` (receives the provider instances) |
| runs every `register()` | — |
| — | `booting` |
| runs every `boot()`, which is where model classes get built from the schema | — |
| — | `booted` |
| — | `ready` |

`register`/`boot` are provider methods, not events. The events are `init`, `booting`, `booted`,
`ready`, plus `flushing`/`flushed` on teardown. Two consequences:

- anything that must exist **before** model classes are built — a `model{Name}` class-extension
  reducer above all — registers on `booting`, not in a provider's `boot()` -> `extending.md`
- `App.on('ready', ...)` after `create()` has already returned never fires. Subscribe first, or
  just use the facades — by then the container is up

## Configuration shape

```typescript
App.withConfiguration({
    app:      { name: 'App', env: 'production', debug: false, url: 'https://app.test' },
    auth:     { user: { id: 1, name: 'Alice' }, csrf: '...' },
    manifest: { models: schemaJson, routes: routeJson },
}).create();
```

`app.url` prefixes every URL `route().url()` builds. `app.debug` gates the whole `Log` facade.
`manifest.models` and `manifest.routes` are the schema and route table — the same JSON
`luminix/frontend` embeds, and the only way to get working models without a page payload.

`create()` touches `document`, so a non-DOM host (a worker, a node test runner) needs a DOM
implementation such as jsdom.

## Teardown

```typescript
App.down();      // flush the container and drop the instance — the next access builds a fresh one
```

`create()` on an application that already has services logs a warning and returns without booting
anything: to re-boot with different configuration, tear it down first. `App.flush()` empties the
container in place, emitting `flushing` (where each provider's `flush()` runs) and `flushed`.
