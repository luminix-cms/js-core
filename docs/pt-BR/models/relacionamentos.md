# Relacionamentos

Os relacionamentos definidos nos models Eloquent com type hints são automaticamente detectados pelo `luminix/frontend` e incluídos no manifest. O `@luminix/core` os expõe como propriedades e como métodos de relação.

## Pré-requisito no Eloquent

Para que um relacionamento seja detectado, o método deve ter type hint de retorno:

```php
// app/Models/Post.php
public function author(): BelongsTo
{
    return $this->belongsTo(User::class);
}

public function categories(): BelongsToMany
{
    return $this->belongsToMany(Category::class);
}
```

Sem o type hint, o relacionamento não aparece no manifest.

## Relacionamentos pré-carregados (eager loading)

Se o backend retornar os dados do relacionamento já carregados (`with()`), o Luminix os converte automaticamente em instâncias do model correspondente:

```typescript
// Backend fez: Post::with('author', 'categories')->find(1)
const post = await Post.find(1);

// BelongsTo → Model | null
post.author?.name;

// BelongsToMany → Collection<Model> | null
post.categories?.each((cat) => console.log(cat.name));
```

## Lazy loading

Quando o relacionamento não foi carregado pelo backend, a propriedade retorna `undefined`. Para carregá-lo sob demanda, use o método `{nome}Relation()`:

```typescript
const post = await Post.find(1);

post.author; // undefined — não foi carregado

const author = await post.authorRelation().get();

post.author; // agora está populado
author === post.author; // true — cached na instância
```

O padrão de nomenclatura é `{camelCase do nome da relação}Relation`:
- relação `author` → `post.authorRelation()`
- relação `categories` → `post.categoriesRelation()`
- relação `user_profile` → `user.userProfileRelation()`

## Tipos de relacionamentos suportados

| Tipo | Descrição |
|------|-----------|
| `HasOne` | Um para um (lado dono) |
| `HasMany` | Um para muitos (lado dono) |
| `BelongsTo` | Um para um / muitos para um (lado filho) |
| `BelongsToMany` | Muitos para muitos |
| `MorphOne` | Polimórfico um para um |
| `MorphMany` | Polimórfico um para muitos |
| `MorphTo` | Polimórfico (lado filho) |
| `MorphToMany` | Polimórfico muitos para muitos |

## Consultando relacionamentos

O objeto de relação retornado por `xyzRelation()` expõe o query builder completo:

```typescript
// Consultar com filtros
const adminPosts = await post.categoriesRelation()
    .where('active', true)
    .orderBy('name')
    .get();

// Primeiro resultado
const firstCategory = await post.categoriesRelation().first();

// Todos os registros (todas as páginas)
const allCategories = await post.categoriesRelation().all();

// Buscar por ID
const category = await post.categoriesRelation().find(3);
```

## Operações em `HasMany`

```typescript
const post = await Post.find(1);

// Salva um model relacionado (define automaticamente a foreign key)
const comment = new Comment({ body: 'Ótimo post!' });
await post.commentsRelation().save(comment);

// Salva vários de uma vez
await post.commentsRelation().saveMany([comment1, comment2]);
```

## Operações em `BelongsToMany`

```typescript
const post = await Post.find(1);

// Sincroniza (substitui todos os IDs)
await post.categoriesRelation().sync([1, 2, 3]);

// Adiciona sem remover os existentes (com pivot opcional)
await post.categoriesRelation().attach(4, { order: 1 });

// Remove
await post.categoriesRelation().detach(2);

// Sincroniza com valores de pivot
await post.categoriesRelation().syncWithPivotValues([1, 2], { featured: true });
```

Os métodos `sync`, `attach` e `detach` atualizam os dados em cache na instância automaticamente. Para executar a operação sem atualizar o cache local, use as variantes `*Quietly`:

```typescript
await post.categoriesRelation().syncQuietly([1, 2, 3]);
await post.categoriesRelation().attachQuietly(4);
await post.categoriesRelation().detachQuietly(2);
```

## Metadados do relacionamento

```typescript
const Post = model('post');
const schema = Post.getSchema();

schema.relations;
// {
//   author: {
//     type: 'BelongsTo',
//     model: 'user',
//     foreignKey: 'user_id',
//     name: 'author',
//   },
//   categories: {
//     type: 'BelongsToMany',
//     model: 'category',
//     foreignKey: 'post_id',
//     name: 'categories',
//   }
// }
```
