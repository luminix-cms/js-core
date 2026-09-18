# Extending the runtime

Two mechanisms: a **service provider** registers and boots your own services, and a **reducer**
rewrites a value the runtime is about to use. Nothing here requires forking a class.

## Service providers

```typescript
import { ServiceProvider } from '@luminix/support';

export default class AppServiceProvider extends ServiceProvider {
    register() {
        this.app.singleton('report', () => new ReportService());
    }
    boot() {
        this.app.make('report').warmUp();
    }
}
```

`register()` only binds; `boot()` does the side effects. `this.app` is the container —
`bind` resolves anew each time, `singleton` caches, `instance` stores a value you already have.
Register the provider through `App.withProviders([...])`, or through the `providers` prop if
`@luminix/react` is driving the boot.

`boot()` is synchronous and **not awaited**. Anything the first request depends on — a token, a
locale file — must already be resolved before the app renders; fetch it before `create()` rather
than starting a promise inside `boot()`.

Guard non-idempotent global setup: a provider's `boot()` runs again on every fresh container, which
in a test suite means every test.

## Reducers

A reducer is a callback in a priority-ordered pipeline over one named value. It is registered on the
facade that owns the value, and returns an unsubscribe function.

```typescript
const stop = Model.reducer('modelPostGetExcerptAttribute', (value, post) => value ?? post.body.slice(0, 200));
```

The third argument is the priority, defaulting to `10`; higher runs **later** and therefore wins.
A name that collides with a real property of the service throws `ReducerOverrideException`. When the
value is a plain object or array the chain runs inside immer, so a callback may mutate what it
receives *or* return a replacement — never both.

### Model reducers

| Name | Rewrites |
|---|---|
| `model` | every model class as it is built — `(Base, alias) => class extends Base` |
| `model{Alias}` | one model's class, same shape, alias in StudlyCase |
| `model{Alias}Get{Attr}Attribute` | the value read for an attribute — a virtual attribute needs no column |
| `model{Alias}Set{Attr}Attribute` | the value stored on write |
| `model{Alias}Json` | the object `toJson()` produces |
| `relationMap` | the constructor used for each relation type |
| `guessInverseRelation` | which relation types count as an inverse of which |

`Route` owns `clientOptions`, `clientError` and `replaceRouteParams` -> `requests-and-errors.md`.

### Timing: class extension runs on `booting`

Model classes are built during the boot phase. A `model{Alias}` reducer registered in a provider's
`boot()` arrives after its class was built, and its methods are missing from every instance
("x is not a function"). Register it from `register()`, on the `booting` event:

```typescript
register() {
    this.app.on('booting', () => {
        Model.reducer('modelUser', (User) => class extends User {
            hasRole(role: string) { return (this.roles ?? []).some((r) => r.name === role); }
            can(permission: string) {
                return this.hasRole('admin') || (config('auth.permissions') ?? []).includes(permission);
            }
        });
    });
}
```

Attribute reducers run per attribute access, so `boot()` is soon enough for those:

```typescript
boot() {
    Model.reducer('modelTaskGetDueDateAttribute', (value) => (value ? dayjs(value) : null));
    // consumers keep reading task.due_date, now a dayjs
}
```

An attribute reducer is also the only way to add a computed property: a getter on a `class extends`
of the same name shadows the Proxy's attribute lookup and recurses.

## Typing your additions

```typescript
declare module '@luminix/core' {
    interface AppContainers {
        report: ReportService;
    }
}
```

That single declaration makes `app('report')` and `App.make('report')` typed everywhere. The package
also exports, as types, `AppFacade`, `AppConfiguration`, `ModelType`, `BaseModel`, `ModelAttribute`,
`ModelSaveOptions`, `ModelPaginatedResponse`, `ModelPaginatedLink`, `BuilderInterface`, `Scope`,
`Relation`, `AuthFacade`, `LogFacade`, `RouteFacade`, `RouteReducers`, `RouteGenerator` and
`HttpMethod`. A schema type (`ModelSchemaAttributes`) is not among them — read the shape off
`Post.getSchema()`.
