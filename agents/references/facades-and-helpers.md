# Facades and helpers

Every service is reachable as a static facade or through a helper function. The helper is the short
form; the facade exposes the full service, including reducer registration.

| Facade | Helper | Holds |
|---|---|---|
| `App` | `app()` / `app('name')` | the container, macros, lifecycle events |
| `Config` | `config('path', default)` | the embedded application config |
| `Auth` | `auth()` | the authenticated user, login and logout |
| `Model` | `model('alias')` | the model registry, the schema, model reducers |
| `Route` | `route()` / `route(name, params)` | named routes and calls -> `requests-and-errors.md` |
| `Http` | — | a fresh HTTP client per call -> `requests-and-errors.md` |
| `Log` | `log()` / `log(...data)` | eight RFC 5424 levels |
| `Error` | `error('field')` | named error bags -> `requests-and-errors.md` |

`collect(array)` wraps an array in a `@luminix/support` `Collection`, and `Obj.isModel(value)` — a
macro this package installs — is the reliable way to tell a model from a plain object.

## `App` — container and environment

```typescript
app('analytics');                     // resolve a binding, typed through AppContainers
App.make('analytics');                // the same
App.singleton('analytics', () => new AnalyticsService());
App.instance('clock', systemClock);

App.environment();                    // 'production' — the app.env value
App.environment('local', 'test');     // true when it matches any argument
App.isLocal(); App.isProduction(); App.hasDebugModeEnabled(); App.getLocale();
```

Registering services belongs in a provider, not in application code -> `extending.md`.

## `Config` — the embedded config

```typescript
config('app.name');
config('data.roles', []);             // any key the app embedded, with a default
config();                             // the PropertyBag itself
```

Reads are dot-paths into what the page embedded (or what `withConfiguration()` passed). Two
constraints worth knowing: the `manifest` key — schema and routes — is stripped from this bag, and
`auth.user` is locked, so writing to it throws rather than faking a login.

## `Auth`

```typescript
auth().check();                       // is there a user in the payload
auth().user();                        // a hydrated Model (exists = true); undefined when nobody is
                                      // signed in, though the declared type says null — test falsiness
auth().id();                          // its key, or null
auth().attempt({ email, password }, remember);
auth().logout();
```

`attempt()` and `logout()` are **not** XHR calls. Each builds a hidden form, adds the `auth.csrf`
token from the config, and submits it to the `login` / `logout` named route — the page navigates and
the next payload carries the new user. Both need those routes in the table, and an `onSubmit`
callback is the only hook before the browser leaves.

The user comes from `config('auth.user')`, so it is as fresh as the page. There is no refresh
without a reload.

## `Log`

```typescript
log().info('payload received', { data });
log('quick debug');                   // shorthand for log().debug(...)
```

`emergency`, `alert`, `critical`, `error`, `warning`, `notice`, `info`, `debug` map onto the
console. **Every level is silent unless `app.debug` is true** — including `model.dump()` and the
internal warnings about invalid attributes. Chasing a quiet failure starts by enabling it.

## A facade of your own

```typescript
import { MakeFacade } from '@luminix/support';
import { app } from '@luminix/core';

// the provider did: this.app.singleton('report', () => new ReportService());
class Report { getFacadeAccessor() { return 'report'; } }

export default MakeFacade(Report, app());   // import anywhere as Report.generate(...)
```
