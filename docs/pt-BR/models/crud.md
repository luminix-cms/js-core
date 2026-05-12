# Operações CRUD

## Criar

### `new Model(attributes?)` + `save()`

Cria uma instância local e persiste no backend:

```typescript
import { model } from '@luminix/core';

const User = model('user');

const user = new User({
    name: 'João Silva',
    email: 'joao@example.com',
    password: 'senha-segura',
});

await user.save();

console.log(user.id);               // ID atribuído pelo backend
console.log(user.exists);           // true
console.log(user.wasRecentlyCreated); // true
```

### `Model.create(attributes)`

Cria diretamente no backend e retorna a instância populada:

```typescript
const user = await User.create({
    name: 'Maria Souza',
    email: 'maria@example.com',
});

console.log(user.id); // ID atribuído pelo backend
```

---

## Ler

### `Model.get(options?)`

Retorna uma listagem paginada:

```typescript
const { data, meta, links } = await User.get();

data.each((user) => console.log(user.name));

console.log(meta.total);        // total de registros
console.log(meta.current_page); // página atual
console.log(meta.last_page);    // última página
```

Com parâmetros de paginação:

```typescript
const { data } = await User.get({ per_page: 25, page: 2 });
```

### `Model.find(id)`

Busca um model por ID. Retorna `null` se não encontrado:

```typescript
const user = await User.find(1);

if (user) {
    console.log(user.name);
}
```

### `Model.first()`

Retorna o primeiro registro:

```typescript
const user = await User.first();
```

---

## Atualizar

### `model.save()` (instância existente)

Salva as mudanças de uma instância existente. Envia apenas os campos modificados por padrão:

```typescript
const user = await User.find(1);

user.name = 'João Atualizado';
user.email = 'novo@example.com';

await user.save();
```

Opções disponíveis:

```typescript
await user.save({
    // Envia todos os atributos fillable, não apenas os modificados
    sendsOnlyModifiedFields: false,

    // Dados extras no payload
    additionalPayload: { notify: true },
});
```

### `model.update(attributes)`

Atalho para atualizar atributos específicos sem precisar atribuí-los um a um:

```typescript
await user.update({ name: 'Outro Nome', role: 'admin' });
```

### `Model.update(id, attributes)` (estático)

Atualiza diretamente pelo ID:

```typescript
const user = await User.update(1, { name: 'João Atualizado' });
```

---

## Excluir

### `model.delete()`

Soft delete (se o model usa SoftDeletes) ou exclusão permanente:

```typescript
const user = await User.find(1);
await user.delete();
```

### `Model.delete(id)` / `Model.delete(ids[])` (estático)

Exclui por ID ou por array de IDs:

```typescript
await User.delete(1);
await User.delete([1, 2, 3]);
```

### `model.forceDelete()` / `Model.forceDelete(id)` 

Exclusão permanente, mesmo quando SoftDeletes está ativo:

```typescript
await user.forceDelete();
await User.forceDelete(1);
await User.forceDelete([1, 2, 3]);
```

---

## Restaurar (SoftDeletes)

### `model.restore()` / `Model.restore(id)`

Restaura um registro soft-deleted:

```typescript
await user.restore();
await User.restore(1);
await User.restore([1, 2, 3]);
```

---

## Atualizar do backend

### `model.refresh()`

Recarrega os atributos de um model existente a partir do backend:

```typescript
const user = await User.find(1);

// ... algum tempo depois, o backend pode ter mudado
await user.refresh();

console.log(user.name); // valor atual do backend
```

---

## Verificando estado da instância

```typescript
const user = new User({ name: 'João' });

user.exists;             // false — ainda não foi persistido
user.wasRecentlyCreated; // false

await user.save();

user.exists;             // true
user.wasRecentlyCreated; // true

user.name = 'Maria';
user.isDirty;            // true — há atributos modificados não salvos

await user.save();
user.isDirty;            // false
```

---

## Customizando a requisição HTTP

Todos os métodos de escrita aceitam um parâmetro `tap` para modificar o cliente HTTP:

```typescript
import { Client } from '@luminix/support';

await user.save(
    { additionalPayload: { notify: true } },
    (client: Client) => client.withHeaders({ 'X-Custom': 'value' })
);
```
