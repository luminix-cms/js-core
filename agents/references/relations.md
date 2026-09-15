# Relations

Every relation in the schema becomes a relation object on the instance. `HasOne`, `HasMany`,
`BelongsTo`, `BelongsToMany`, `MorphOne`, `MorphMany`, `MorphTo` and `MorphToMany` are supported.

```typescript
const post = await model('post').find(1);

post.author;                  // eager-loaded data: a Model, or a Collection for a to-many
post.authorRelation();        // the relation object
post.relation('author');      // the same object — the argument must be camelCase
```

`relation()` returns `undefined` for a name that is not camelCase, which is the usual reason a
lazy-load "does nothing": the schema key is `snake_case`, the accessor argument is not.

## Reading

| Relation | `get()` | Also |
|---|---|---|
| `HasOne`, `BelongsTo`, `MorphOne`, `MorphTo` | `Model \| null` | — |
| `HasMany`, `BelongsToMany`, `MorphMany`, `MorphToMany` | `{ data, meta, links }`, paginated | `all()`, `first()`, `find(id)` |

```typescript
const team    = await post.authorRelation().get();             // to-one: the model itself
const { data } = await post.commentsRelation().get();          // to-many: a page
const every   = await post.commentsRelation().all();           // to-many: a Collection

const recent = await post.commentsRelation()
    .query().orderBy('created_at', 'desc').limit(5).get();     // full builder -> querying.md
```

A lazy-load is a query against the *related* model's index route, constrained by the inverse
relation. Two consequences:

- the related model's schema must declare a relation pointing back, of the matching type
  (`HasMany` ⇄ `BelongsTo`, `BelongsToMany` ⇄ `BelongsToMany`, `MorphMany` ⇄ `MorphTo`). Without it,
  `NoInverseRelationException` names the model and the type it expected
- that constraint is locked on the builder: overwriting it with your own `where()` on the same key
  throws. Filter on anything else freely

A `MorphTo` resolves its target from the instance's own `{relation}_type` attribute, so the class it
returns depends on the row.

## Eager loading

`with(['author.team'])` on the builder only adds a `with` parameter to the request; whether anything
is eager-loaded is decided by the model's `scopeBeforeLuminix`/`scopeAfterLuminix` in
`luminix/backend`. Relations that do arrive are hydrated into the relation objects and readable as
properties.

## Writing

```typescript
await post.authorRelation().associate(user);      // BelongsTo: sets the FK and updates the parent
await post.authorRelation().dissociate();         // sets it to null

await user.postsRelation().save(post);            // HasOne/HasMany: sets the FK, saves the child
await user.postsRelation().saveMany([a, b]);      // HasMany, in parallel

await post.tagsRelation().attach(3, { order: 1 }); // BelongsToMany: pivot data is the request body
await post.tagsRelation().detach(3);
await post.tagsRelation().sync([1, 2, { tag_id: 3, order: 9 }]);
await post.tagsRelation().syncWithPivotValues([1, 2], { order: 0 });
```

`associate()` refuses a model of the wrong type or one that was never persisted. `MorphTo.associate()`
saves an unpersisted model first and writes both `{relation}_id` and `{relation}_type`.

Each write has a `...Quietly` twin — `saveQuietly`, `saveManyQuietly`, `attachQuietly`,
`detachQuietly`, `syncQuietly`, `syncWithPivotValuesQuietly`. The difference is local, not remote:
the plain version refetches or patches the in-memory collection afterwards, the quiet one leaves it
stale. Use the quiet form when you already know the new contents, and hand them over yourself:

```typescript
const ids = selected.map((tag) => tag.id);
if (!isEqual([...ids].sort(), post.tags.pluck('id').all().sort())) {   // skip a no-op round trip
    await post.tagsRelation().syncQuietly(ids);
    post.tagsRelation().set(collect(selected));                        // refresh the UI, no refetch
}
```

The M:N routes only exist when the parent model declares the relation as syncable server-side; that
declaration lives in `luminix/backend`, and without it the call fails on a missing route.
