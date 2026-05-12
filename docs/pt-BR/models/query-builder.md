# Query Builder

O Query Builder permite construir consultas ao backend de forma fluente, inspirado no Eloquent do Laravel.

## Iniciando uma query

```typescript
import { model } from '@luminix/core';

const User = model('user');

// Forma encadeada
const { data } = await User.query()
    .where('role', 'admin')
    .orderBy('name')
    .get();

// Atalhos estáticos (equivalentes)
const { data } = await User.where('role', 'admin').orderBy('name').get();
```

## `where()`

Filtra por valor exato:

```typescript
User.where('role', 'admin')
User.where('status', '=', 'active')

// Operadores disponíveis
User.where('age', '>', 18)
User.where('age', '>=', 18)
User.where('age', '<', 65)
User.where('age', '<=', 65)
User.where('role', '!=', 'guest')
```

Closure para agrupamento de condições:

```typescript
User.where((query) => {
    query.where('role', 'admin').where('active', true);
})
```

## `whereNull()` / `whereNotNull()`

```typescript
User.whereNull('deleted_at')      // apenas registros não excluídos
User.whereNotNull('email_verified_at') // apenas emails verificados
```

## `whereBetween()` / `whereNotBetween()`

```typescript
User.whereBetween('age', [18, 65])
User.whereNotBetween('score', [0, 10])
```

## `orderBy()`

```typescript
User.orderBy('name')          // ascendente (padrão)
User.orderBy('name', 'asc')
User.orderBy('created_at', 'desc')
```

## `searchBy()`

Busca textual (usa o parâmetro `q` no backend):

```typescript
User.searchBy('joão silva')
```

A busca é implementada no backend via `luminix/backend`. Por padrão, pesquisa nos atributos marcados como pesquisáveis no model Eloquent.

## `limit()`

Limita o número de resultados por página:

```typescript
User.limit(10)  // equivalente a per_page=10
```

> O backend do Luminix tem um limite máximo de 150 registros por página.

## `minified()`

Solicita uma versão reduzida dos dados (sem atributos calculados e relacionamentos):

```typescript
const { data } = await User.minified().get();
```

Útil para listagens onde você só precisa de `id` e `labeledBy` (campo configurado com `labeledBy` no manifest).

## Encadeando múltiplos filtros

```typescript
const { data, meta } = await User
    .where('role', 'admin')
    .whereNotNull('email_verified_at')
    .orderBy('name', 'asc')
    .limit(20)
    .get();

console.log(`Página ${meta.current_page} de ${meta.last_page}`);
console.log(`Total: ${meta.total} admins`);
data.each((user) => console.log(user.name));
```

## Paginação

O método `get()` retorna uma resposta paginada:

```typescript
const response = await User.get();

// Dados
response.data;              // Collection<Model>
response.meta.total;        // total de registros
response.meta.current_page; // página atual (começa em 1)
response.meta.last_page;    // última página
response.meta.per_page;     // registros por página
response.meta.from;         // índice do primeiro registro
response.meta.to;           // índice do último registro

// Links de navegação
response.links.first;       // URL da primeira página
response.links.last;        // URL da última página
response.links.prev;        // URL da página anterior (null se primeira)
response.links.next;        // URL da próxima página (null se última)

// Array de links para paginação numérica
response.meta.links;        // [{ url, label, active }]
```

Buscando outra página:

```typescript
const page2 = await User.query().get({ page: 2, per_page: 25 });
```

## Métodos terminais

| Método | Retorna | Descrição |
|--------|---------|-----------|
| `get(options?)` | `Promise<ModelPaginatedResponse>` | Executa a consulta com paginação |
| `first()` | `Promise<Model \| null>` | Primeiro resultado |

## Interfaces TypeScript

```typescript
import type { BuilderInterface, Scope } from '@luminix/core';

// Scope é uma função que recebe um BuilderInterface e retorna void
type Scope = (query: BuilderInterface) => void;

// Usando um scope customizado
User.where((query: BuilderInterface) => {
    query.where('role', 'admin').whereNotNull('email_verified_at');
});
```
