# Models

A model class is built at boot from its schema entry and retrieved by alias. There is no class to
import and no file to generate:

```typescript
import { model } from '@luminix/core';

const User = model('user');        // throws ModelNotFoundException for an unknown alias
const schema = User.getSchema();   // fillable, casts, relations, primaryKey, labeledBy, displayName
```

## Attributes go through a Proxy

Reading or writing any property that is not a real method falls through to the attribute bag:

```typescript
user.name = 'Bob';                 // setAttribute('name', 'Bob')
user.name;                         // getAttribute('name'), cast applied
user.posts;                        // an eager-loaded relation: Collection<Model> (not an array)
user.postsRelation();              // the relation object itself -> relations.md
```

The schema's `casts` run on both directions: a `date`/`datetime` column accepts a `Date` and stores
its ISO string, reads back a `Date`, and `bool`, `int`, `float`, `decimal:n` are coerced. A model
with `timestamps` casts `created_at`/`updated_at` even when the `casts` map omits them.

What survives the cast must be JSON — string, number, boolean, null, or nested objects and arrays of
those. Anything else is refused: a warning outside production, a `TypeError` when `app.env` is
`production`. Back a column with a class of your own through an attribute reducer instead ->
`extending.md`.

`fill()` silently drops anything outside `fillable`; direct assignment does not.

## Reading

`await User.get()` resolves to `{ data, meta, links }` with `data` a `Collection<User>`;
`User.find(1)` and `User.first()` to `User | null`. Filters, ordering, pagination and the
unpaginated `all()` -> `querying.md`.

## Writing

```typescript
const user = await User.create({ name: 'Alice' });   // new instance, filled, saved
await User.update(1, { name: 'Alicia' });            // no fetch: fills a stub and saves it
await User.delete([1, 2, 3]);                        // destroyMany
await User.restore([1]);                             // restoreMany
await User.forceDelete([1]);                         // destroyMany with ?force=true

user.name = 'Bob';
await user.save();                                   // sends the diff only
await user.save({ sendsOnlyModifiedFields: false }); // sends every fillable attribute
await user.update({ name: 'Bob' });                  // one-shot update, skips the dirty tracking
await user.refresh();                                // re-fetch; throws if the model is not persisted
await user.delete(); await user.forceDelete(); await user.restore();
```

`save()` resolves to the `Response`, or to `undefined` without issuing any request when there is
nothing to send — an unchanged model saves to nothing. Unlike `route().call()`, it **throws** on a
non-2xx status, after emitting the instance's `error` event.

On success the instance is rehydrated from the response body, `exists` becomes `true` and
`wasRecentlyCreated` marks an instance stored by its own `save()`. `response.json('id')` is how you
read the new key.

## `exists` decides store vs update

`new User(json)` is born `exists = false`, so `save()` would POST and duplicate the record. Set it
when hydrating a record you fetched yourself:

```typescript
const user = new User(rawJson);
user.exists = true;             // now save() routes to luminix.user.update
```

Instances produced by the query builder already have it set.

## Sending more than attributes

```typescript
user.fill(data);
await user.save({ additionalPayload: { roles: ['editor'], classroom_ids: [1, 2] } });
```

`additionalPayload` is merged into the request body after the attribute diff, which is how pivot
ids, role names or computed arrays reach a controller hook without becoming model attributes.

## Instance helpers

| Call | Answers |
|---|---|
| `isDirty` | changed since hydration — a **property**, not a method |
| `diff()` | only the changed attributes, the exact body `save()` sends |
| `getKey()` / `getKeyName()` | primary key value / its column name |
| `getLabel()` | the attribute named by the schema's `labeledBy` |
| `getType()` | the alias — `route().url([\`luminix.${item.getType()}.update\`, { id: item.getKey() }])` is how a generic editor addresses a model it does not know |
| `toJson()` | attributes plus every loaded relation, as plain JSON |
| `getErrorBag('update')` | the bag name a write fills: `user[1].update`, or `user.store` when new |
| `dump()` | logs the JSON form instead of the Proxy — silent unless `app.debug` |

`User.singular()` / `User.plural()` return the schema's display names.

## Events

Every instance is an `EventSource` — `change`, `save`, `create`, `update`, `delete`, `restore`,
`error` — and the `Model` facade re-emits each of them for every model at once, plus `fetch` for
each model the query builder hydrates. Facade payloads carry `class` and `model`.

```typescript
user.on('change', ({ value }) => console.log('pending changes', value));
user.on('error',  ({ error, operation }) => report(operation, error));

Model.on('fetch', ({ class: alias, model }) => track(alias, model.getKey()));
```
