# Facade Route

O facade `Route` fornece acesso às rotas nomeadas do Laravel que foram incluídas no manifest pelo `luminix/frontend`. Use-o para gerar URLs ou fazer chamadas HTTP diretamente.

## Importação

```typescript
import { Route } from '@luminix/core';  // facade
import { route } from '@luminix/core'; // helper
```

---

## Gerando URLs

### `route().url(generator)`

Retorna a URL completa (com domínio) para uma rota nomeada:

```typescript
route().url('home');           // 'https://example.com/'
route().url('users.index');    // 'https://example.com/users'
route().url('users.show');     // erro — parâmetro {user} não fornecido
```

Para rotas com parâmetros, passe um tuplo `[routeName, replacements]`:

```typescript
route().url(['users.show', { user: 1 }]);
// 'https://example.com/users/1'

route().url(['posts.comments.store', { post: 42 }]);
// 'https://example.com/posts/42/comments'
```

### `route().path(generator)`

Retorna apenas o path (sem domínio):

```typescript
route().path('users.index');               // '/users'
route().path(['users.show', { user: 1 }]); // '/users/1'
```

---

## Fazendo chamadas HTTP

### `route().call(generator, tap?, errorBag?)`

Faz uma requisição HTTP para a rota, usando o método HTTP definido no manifest:

```typescript
const response = await route().call('users.index');

if (response.successful()) {
    const users = response.json('data');
}
```

Com parâmetros de rota:

```typescript
const response = await route().call(['users.show', { user: 1 }]);
```

Customizando a requisição via `tap`:

```typescript
import { Client } from '@luminix/support';

const response = await route().call(
    ['users.store', {}],
    (client: Client) => client.withData({ name: 'João', email: 'joao@example.com' })
);
```

Com error bag nomeado (para gerenciar erros de múltiplos formulários):

```typescript
const response = await route().call('users.store', 
    (client) => client.withData(formData),
    'userForm'    // error bag nomeado
);

// Erros ficam disponíveis no bag 'userForm'
error().get('name', 'userForm');
```

Erros de validação (HTTP 422) são automaticamente extraídos e colocados no error bag.

---

## Verificações

### `route().exists(name)`

Verifica se uma rota existe no manifest:

```typescript
route().exists('users.index');  // true | false
```

### `route().methods(generator)`

Retorna os métodos HTTP disponíveis para uma rota:

```typescript
route().methods('users.index'); // ['get']
route().methods('users.store'); // ['post']
```

### `route().get(name)`

Retorna o tuplo `[path, ...methods]` de uma rota:

```typescript
route().get('users.show'); // ['/users/{user}', 'get']
```

---

## Reducers da Route

O Route facade suporta reducers para customizar o comportamento global das requisições:

### `clientOptions` — Adicionar opções a todas as requisições

```typescript
import { Route } from '@luminix/core';

Route.reducer('clientOptions', (options, routeName) => {
    return {
        ...options,
        headers: {
            ...options.headers,
            'X-Custom-Header': 'valor',
        }
    };
});
```

### `clientError` — Customizar mensagens de erro

```typescript
Route.reducer('clientError', (errors, { response, name }) => {
    if (response.status() === 403) {
        return { ...errors, _global: 'Você não tem permissão para esta ação.' };
    }
    return errors;
});
```

### `replaceRouteParams` — Substituição automática de parâmetros

Quando `route().url('rota')` é chamado sem replacements explícitos, este reducer é chamado para substituir automaticamente os parâmetros da URL:

```typescript
Route.reducer('replaceRouteParams', (url) => {
    // Substitui {id} com o ID do item selecionado globalmente
    return url.replace('{id}', globalSelectedId);
});
```

---

## Tipos

```typescript
import type { RouteGenerator, HttpMethod, RouteFacade } from '@luminix/core';

// Generator pode ser string (nome da rota) ou tuplo com replacements
type RouteGenerator = string | [string, Record<string, string | number>];

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';
```
