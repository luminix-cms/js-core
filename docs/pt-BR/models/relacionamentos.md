# Relacionamentos

Os relacionamentos definidos nos models Eloquent com type hints são automaticamente detectados pelo `luminix/frontend` e incluídos no manifest. O `@luminix/core` os expõe como propriedades do model.

## Pré-requisito no Eloquent

Para que um relacionamento seja detectado, o método deve ter type hint de retorno:

```php
// app/Models/User.php
public function posts(): HasMany
{
    return $this->hasMany(Post::class);
}

public function profile(): HasOne
{
    return $this->hasOne(UserProfile::class);
}
```

Sem o type hint, o relacionamento não aparece no manifest.

## Acessando relacionamentos pré-carregados

Se o backend retornar os dados do relacionamento já carregados (`with()`), o Luminix os converte automaticamente em instâncias do model correspondente:

```typescript
// Backend fez: User::with('posts', 'profile')->find(1)
const user = await User.find(1);

// Relacionamento HasMany → Collection<Model>
const posts = user.posts;
posts.each((post) => console.log(post.title));
posts.first()?.save();

// Relacionamento HasOne → Model | null
const profile = user.profile;
console.log(profile?.bio);
```

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

## Relações sem dados pré-carregados

Quando o relacionamento não foi carregado pelo backend, a propriedade retorna `undefined`:

```typescript
const user = await User.find(1); // sem with('posts')

user.posts; // undefined — não foi carregado
```

Use a propriedade `relations` para inspecionar o estado:

```typescript
const relacao = user.relation('posts');
// relacao é a instância da relação (HasMany, BelongsTo, etc.)
```

## Operações em relacionamentos BelongsToMany

Para relacionamentos `BelongsToMany` e `MorphToMany`, o `luminix/backend` expõe endpoints de sync, attach e detach. Use o facade `Route` para chamá-los diretamente:

```typescript
import { route } from '@luminix/core';

// Sincroniza os IDs (substitui todos)
await route().call(['luminix-api.users.posts.sync', { user: 1 }], 
    (client) => client.withData({ ids: [1, 2, 3] })
);

// Adiciona sem remover os existentes
await route().call(['luminix-api.users.posts.attach', { user: 1 }],
    (client) => client.withData({ ids: [4, 5] })
);

// Remove
await route().call(['luminix-api.users.posts.detach', { user: 1 }],
    (client) => client.withData({ ids: [2] })
);
```

## Metadados do relacionamento

```typescript
const User = model('user');
const schema = User.getSchema();

schema.relations;
// {
//   posts: {
//     type: 'HasMany',
//     model: 'post',
//     foreignKey: 'user_id',
//     name: 'posts',
//   },
//   profile: {
//     type: 'HasOne',
//     model: 'user_profile',
//     foreignKey: 'user_id',
//     name: 'profile',
//   }
// }
```
