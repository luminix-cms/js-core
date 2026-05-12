# Atributos e Casts

## Acessando atributos

Os atributos de um model são acessados diretamente como propriedades. O Luminix converte automaticamente entre `snake_case` (backend) e `camelCase` (JavaScript):

```typescript
const user = await User.find(1);

user.name;          // 'João Silva'
user.email;         // 'joao@example.com'
user.avatarSrc;     // ← camelCase de 'avatar_src'
user.createdAt;     // Date { ... }
user.emailVerifiedAt; // Date { ... } ou null
```

## O objeto `attributes`

O armazenamento interno fica em `user.attributes`, sempre em `snake_case`:

```typescript
user.attributes;
// {
//   id: 1,
//   name: 'João Silva',
//   avatar_src: 'https://example.com/avatar.jpg',
//   created_at: '2024-01-01T00:00:00.000Z',
// }
```

## Casts

Os casts definidos no model Eloquent são aplicados automaticamente:

| Cast Eloquent | Tipo JavaScript |
|---------------|-----------------|
| `boolean` / `bool` | `boolean` |
| `date` / `datetime` / `immutable_date` / `immutable_datetime` | `Date` |
| `float` / `double` / `decimal:n` | `number` |
| `integer` / `int` | `number` |

Os timestamps do Laravel (`created_at`, `updated_at`, `deleted_at`) são automaticamente convertidos para `Date`:

```typescript
user.createdAt instanceof Date; // true
user.createdAt.toLocaleDateString('pt-BR'); // '01/01/2024'
```

Plugins podem adicionar suporte a outros tipos de cast (ex: Day.js via `@luminix/plugin-dayjs-cast`).

## `fill(attributes)`

Preenche múltiplos atributos de uma vez. Apenas atributos presentes em `fillable` são aceitos:

```typescript
user.fill({ name: 'Maria', email: 'maria@example.com' });
```

## `toJson()`

Retorna os atributos em `snake_case` como objeto simples:

```typescript
user.toJson();
// { id: 1, name: 'João', email: 'joao@example.com', created_at: '...' }
```

## `diff()`

Retorna os atributos que foram modificados desde o último save (ou desde a criação):

```typescript
const user = await User.find(1);
user.name = 'Novo Nome';

user.diff();
// { name: 'Novo Nome' }
```

## `isDirty`

Indica se há atributos modificados não salvos:

```typescript
user.isDirty; // false (logo após find())

user.name = 'Novo Nome';
user.isDirty; // true

await user.save();
user.isDirty; // false
```

## `original`

Os atributos originais (antes de qualquer modificação desde o último save):

```typescript
user.original;
// { id: 1, name: 'João', ... } — valores não modificados
```

## O Proxy — camada de resolução

O `@luminix/core` usa um `Proxy` JavaScript para interceptar o acesso a propriedades. A ordem de resolução ao acessar `model.propriedade` é:

1. Propriedades nativas da classe (`exists`, `isDirty`, `attributes`, etc.)
2. Relacionamentos pré-carregados (retorna instância(s) do model relacionado)
3. Macros registradas como `model_{model}_call_{method}_method`
4. Atributos do objeto `attributes` (com conversão camelCase → snake_case e cast aplicado)
5. Macros de acesso registradas como `model_{model}_get_{attribute}_attribute`

Isso significa que você nunca precisa chamar `getAttribute('nome')` manualmente — apenas acesse `model.nome`.

## Atributos personalizados via Reducer

Use o sistema de reducers para adicionar atributos virtuais:

```typescript
import { Model } from '@luminix/core';

// Registra um reducer que adiciona o atributo 'firstName'
Model.reducer(`modelUserGetFirstNameAttribute`, (value, user) => {
    return user.attributes.name?.split(' ')[0] ?? null;
});

// Agora disponível em qualquer instância de User
const user = await model('user').find(1);
console.log(user.firstName); // 'João'
```

Veja [Reducers](../avancado/reducers.md) para mais detalhes.
