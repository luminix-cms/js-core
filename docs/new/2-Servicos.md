## Serviços

### App

A fachada `App` permite registrar e acessar serviços e plugins.

#### Exemplo:
```ts
import { App } from 'luminix';

App.down(); // Reinicia a instância
```

#### Tipos:
```ts
type AppFacade = {
  down(): void;
  setInstance(app: Application): void;
};
```

### Auth

A fachada `Auth` lida com autenticação e sessão do usuário.

#### Métodos:
- `attempt(credentials, remember)`
- `check()`
- `logout()`
- `user()`
- `id()`

#### Exemplo:
```ts
import { Auth } from 'luminix';

if (Auth.check()) {
  const user = Auth.user();
}
```

### Config

A fachada `Config` é baseada em um `PropertyBag`, permitindo manipulação reativa da configuração da aplicação.

#### Exemplo:
```ts
import { Config } from 'luminix';

const name = Config.get('app.name');
```

### Error

Manipula erros de validação e mensagens associadas.

#### Métodos:
- `add(key, value)`
- `set(errors)`
- `get(key)`
- `clear()`
- `bag(name)`

#### Exemplo:
```ts
Error.set({ email: 'Inválido' });
console.log(Error.get('email'));
```

### Http

Facilidade para criar requisições HTTP com Axios.

#### Métodos principais:
- `get`, `post`, `put`, `patch`, `delete`
- `withHeaders`, `withToken`, `asForm`

#### Exemplo:
```ts
Http.withToken('abc').get('/user');
```

### Log

Camadas de logging com níveis baseados em RFC 5424.

```ts
Log.info('Mensagem informativa');
Log.error('Erro crítico');
```

### Model

Centraliza registro de modelos, schemas e relacionamentos.

#### Métodos:
- `schema()`
- `make()`
- `boot()`

```ts
Model.schema('User');
```

### Route

Gerencia rotas e gera URLs para modelos.

```ts
Route.to('users.show', { id: 1 });
```

---

## Luminix ORM

### Introdução

O Luminix ORM é inspirado no Eloquent ORM do Laravel, mas com foco em integração com APIs REST. Ele fornece modelos reativos com base em eventos e suporte a relacionamentos, mutators, casts, e muito mais.

### Relacionamentos

Os modelos suportam:
- HasOne, HasMany, BelongsTo, BelongsToMany
- MorphOne, MorphMany, MorphTo, MorphToMany

Exemplo:
```ts
class Post extends Model {
  user() {
    return this.hasOne(User);
  }
}
```

### Mutators / Casts

Você pode definir `casts` no schema:
```ts
User.getSchema().casts = {
  is_active: 'boolean',
};
```

Ou sobrescrever getters:
```ts
getAttribute(key: string) {
  if (key === 'name') return this.attributes[key].toUpperCase();
  return super.getAttribute(key);
}
```

---

> ✅ **Pronto!** Documentação atualizada com os tipos completos das facades e serviços do Luminix. Podemos agora seguir para documentar os Builders, Models ou algum helper específico como `collect`, `app`, `model` etc. Só avisar!