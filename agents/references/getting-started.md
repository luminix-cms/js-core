# Getting started

```bash
npm install @luminix/core @luminix/support
```

`@luminix/support` is a peer dependency: it is never bundled into this package, and the app must
install it itself.

## The page has to carry the payload

Everything this runtime knows arrives as one JSON blob embedded in the page by `luminix/frontend`
(`@luminixEmbed()` in the Blade layout): the model schema, the named routes, and the application
config including the authenticated user. There is no build-time codegen and no schema request —
without the blob the runtime boots empty:

- `model('post')` throws `ModelNotFoundException` — the alias is absent from the schema
- `route().url('luminix.post.index')` throws `RouteNotFoundException`
- `config('app.name')` returns the default you passed

Tests and non-Blade hosts pass the same shape by hand -> `bootstrapping.md`.

## Boot, then use

Something must drive the lifecycle before any facade is touched. In a React app `@luminix/react`
calls `App.create()` for you; anywhere else you call it yourself. Model classes are built during
boot, so the first safe moment is the `ready` event — subscribed before whatever drives the boot
runs, since the event does not replay:

```typescript
import { App, model, config } from '@luminix/core';

App.on('ready', async () => {
    const Post = model('post');                       // class built from the schema
    const { data, meta } = await Post.query()
        .where('status', 'published')
        .orderBy('created_at', 'desc')
        .get();                                        // GET /luminix-api/posts?...

    data.each((post) => console.log(post.title));       // data is a Collection
    console.log(meta.total, config('app.name'));
});
```

## Aliases

A model is addressed by its alias — the snake_case Laravel class name (`App\Models\BlogPost` →
`blog_post`), unless the model overrides it server-side. The same alias appears in the generated
route names (`luminix.blog_post.index`), in `model.getType()`, and in every reducer name that
targets one model.

## Where configuration lives

`config()` reads the embedded application config by dot path. The `manifest` key — schema and routes
— is deliberately not part of it: reach the schema through `Model.schema()` / `Post.getSchema()` and
routes through `route()`. `config('manifest.models')` is always `undefined`.
