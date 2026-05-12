# Models

Os Models do `@luminix/core` são análogos aos models Eloquent do Laravel. Cada model representa um recurso do backend e fornece uma API fluente para criar, ler, atualizar e excluir registros via os endpoints REST gerados pelo `luminix/backend`.

## Obtendo a classe de um model

Use o helper `model()` ou o facade `Model.make()` para obter a classe de um model pelo seu nome em `snake_case`:

```typescript
import { model } from '@luminix/core';

const User = model('user');
const Post = model('post');
const UserProfile = model('user_profile');
```

A convenção de nomenclatura segue o `snake_case` do Eloquent:
- `App\Models\User` → `'user'`
- `App\Models\UserProfile` → `'user_profile'`
- `App\Models\BlogPost` → `'blog_post'`

## Criando instâncias

```typescript
import { model } from '@luminix/core';

const User = model('user');

// Instância vazia
const user = new User();

// Instância com atributos iniciais
const user = new User({ name: 'João Silva', email: 'joao@example.com' });
```

## Estendendo models

Você pode criar uma classe que estende o model para adicionar métodos customizados:

```typescript
import { model } from '@luminix/core';

class User extends model('user') {
    get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    isAdmin(): boolean {
        return this.role === 'admin';
    }
}

const user = await User.find(1);
console.log(user?.fullName); // 'João Silva'
```

## Schema do model

Cada model carrega o schema definido pelo `luminix/frontend` no manifest. Para inspecionar:

```typescript
const User = model('user');

// Schema completo de um model
const schema = User.getSchema();
console.log(schema.fillable);    // ['name', 'email', ...]
console.log(schema.primaryKey);  // 'id'
console.log(schema.timestamps);  // true
console.log(schema.softDeletes); // false
console.log(schema.relations);   // { posts: { type: 'HasMany', model: 'post', ... } }
```

## Próximos passos

- [Operações CRUD](crud.md)
- [Query Builder](query-builder.md)
- [Atributos e Casts](atributos.md)
- [Relacionamentos](relacionamentos.md)
