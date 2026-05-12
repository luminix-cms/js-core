# Reducers

O sistema de reducers permite customizar e estender o comportamento do `@luminix/core` sem modificar o código-fonte. Reducers são funções puras que transformam um valor — múltiplos reducers para o mesmo nome formam um pipeline executado em ordem de prioridade.

O sistema é fornecido pelo mixin `Reducible` do `@luminix/support`. Consulte a [documentação do @luminix/support](../../../../../support/docs/index.md#reducible) para os detalhes da API.

---

## Reducers de Model

### Atributo virtual: `model{Model}Get{Attribute}Attribute`

Adiciona ou sobrescreve um atributo de um model específico:

```typescript
import { Model } from '@luminix/core';

// Atributo 'firstName' no model User
Model.reducer('modelUserGetFirstNameAttribute', (value, user) => {
    return user.attributes.name?.split(' ')[0] ?? null;
});

// Atributo 'avatarUrl' no model User
Model.reducer('modelUserGetAvatarUrlAttribute', (value, user) => {
    return `https://cdn.example.com/avatars/${user.id}.jpg`;
});

// Agora disponíveis:
const user = await model('user').find(1);
user.firstName;  // 'João'
user.avatarUrl;  // 'https://cdn.example.com/avatars/1.jpg'
```

### Método customizado: `model{Model}Call{Method}Method`

Adiciona um método a um model específico:

```typescript
Model.reducer('modelUserCallGetDisplayNameMethod', (result, user) => {
    return `${user.name} <${user.email}>`;
});

// Agora disponível:
user.getDisplayName(); // 'João Silva <joao@example.com>'
```

### Transformando a classe: `model`

Permite modificar a classe de qualquer model antes de ser registrado:

```typescript
Model.reducer('model', (ModelClass, abstract) => {
    if (abstract === 'user') {
        return class extends ModelClass {
            get isAdmin() {
                return this.role === 'admin';
            }
        };
    }
    return ModelClass;
});
```

### Mapa de relações: `relationMap`

Substitui ou adiciona construtores de relações:

```typescript
import { Model } from '@luminix/core';
import MinhaRelacaoCustomizada from './MinhaRelacao';

Model.reducer('relationMap', (map, abstract) => {
    return { ...map, CustomRelation: MinhaRelacaoCustomizada };
});
```

---

## Reducers de Route

### `clientOptions` — Opções globais para todas as requisições

```typescript
import { Route } from '@luminix/core';

Route.reducer('clientOptions', (options, routeName) => {
    // Adiciona um header a todas as chamadas
    return {
        ...options,
        headers: {
            ...options.headers,
            'X-Requested-With': 'XMLHttpRequest',
        },
    };
});
```

### `clientError` — Customizar mensagens de erro HTTP

```typescript
Route.reducer('clientError', (errors, { response, name }) => {
    if (response.status() === 429) {
        return { ...errors, _rate: 'Muitas requisições. Aguarde um momento.' };
    }
    if (response.status() === 503) {
        return { ...errors, _server: 'Servidor em manutenção.' };
    }
    return errors;
});
```

### `replaceRouteParams` — Substituição automática de parâmetros de rota

Chamado quando `route().url('rota-com-parametros')` é usado sem replacements explícitos:

```typescript
Route.reducer('replaceRouteParams', (url) => {
    // Injeta automaticamente o ID do item selecionado no contexto atual
    const currentId = getCurrentItemId();
    return url.replace('{item}', String(currentId));
});
```

---

## Gerenciando reducers

```typescript
// Registrar — retorna função de cancelamento
const off = Model.reducer('modelUserGetFirstNameAttribute', handler);

// Cancelar
off();

// Com prioridade explícita (menor = executa primeiro, padrão = 10)
Model.reducer('modelUserGetFirstNameAttribute', handler, 5);

// Verificar se existe
Model.hasReducer('modelUserGetFirstNameAttribute'); // true

// Limpar todos os reducers de um nome
Model.clearReducer('modelUserGetFirstNameAttribute');

// Limpar todos os reducers
Model.flushReducers();
```

---

## Registrando reducers em plugins

O lugar recomendado para registrar reducers é o método `boot()` de um plugin:

```typescript
import { ServiceProvider } from '@luminix/support';

export default class MeuPlugin extends ServiceProvider {
    boot() {
        const model = this.app.make('model');
        const route = this.app.make('route');

        model.reducer('modelUserGetFirstNameAttribute', (value, user) => {
            return user.attributes.name?.split(' ')[0] ?? null;
        });

        route.reducer('clientOptions', (options) => ({
            ...options,
            timeout: 10000,
        }));
    }
}
```
