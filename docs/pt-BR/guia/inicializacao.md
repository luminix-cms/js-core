# Inicialização

## Ciclo de vida

A inicialização do `@luminix/core` usa o container de serviços de `@luminix/support`. O método `App.create()` executa o ciclo completo de bootstrap:

| Etapa | Evento | O que acontece |
|-------|--------|----------------|
| 1 | `init` | Provedores instanciados |
| 2 | — | `register()` chamado em cada provedor — registra os serviços internos (auth, config, error, http, log, model, route) |
| 3 | `booting` | — |
| 4 | — | `boot()` chamado em cada provedor — inicializa os models com o schema do manifest |
| 5 | `booted` | — |
| 6 | `ready` | Aplicação completamente inicializada |

## Uso com `@luminixEmbed()`

Quando a diretiva `@luminixEmbed()` está presente na página, a configuração é lida automaticamente do DOM. Nenhuma configuração manual é necessária:

```typescript
import { App } from '@luminix/core';

App.create();
```

O `App.create()` retorna `void`. A aplicação está pronta de forma síncrona após a chamada.

## Uso com manifest JSON

Quando você gerou um arquivo de manifest, passe-o manualmente:

```typescript
import { App } from '@luminix/core';
import manifest from './config/manifest.json';

App.withConfiguration({ manifest }).create();
```

## Configuração adicional

Use `withConfiguration()` para sobrescrever ou complementar os dados de boot:

```typescript
import { App } from '@luminix/core';

App.withConfiguration({
    app: {
        name: import.meta.env.VITE_APP_NAME,
        debug: import.meta.env.DEV,
    },
}).create();
```

Os valores passados em `withConfiguration()` são **mesclados** com os dados lidos do DOM — você não precisa repetir tudo.

## Usando os helpers após o boot

Após `App.create()`, todos os helpers e facades estão disponíveis:

```typescript
import { App } from '@luminix/core';
import { config, auth, model } from '@luminix/core';

App.create();

// Todos os helpers funcionam sincronamente a partir daqui
console.log(config('app.name'));

if (auth().check()) {
    const user = auth().user();
    console.log(`Bem-vindo, ${user?.name}`);
}

const User = model('user');
User.get().then(({ data }) => console.log(data.count(), 'usuários'));
```

## Ouvindo eventos do ciclo de vida

```typescript
import { App } from '@luminix/core';

App.on('ready', () => {
    console.log('Aplicação pronta');
});

App.on('booting', () => {
    console.log('Inicializando...');
});

App.create();
```

> **Nota:** Os listeners devem ser registrados **antes** de chamar `App.create()`.

## Reinstanciando a aplicação

Para destruir todos os serviços e recriar do zero (útil em testes):

```typescript
import { App } from '@luminix/core';

App.down(); // destrói a instância atual
App.withConfiguration({ ... }).create(); // cria uma nova
```

## Múltiplos provedores

Para registrar provedores customizados (por exemplo, de um plugin):

```typescript
import { App } from '@luminix/core';
import MeuProvider from './providers/MeuProvider';

App.withProviders([MeuProvider]).create();
```

Veja [Plugins](../avancado/plugins.md) para detalhes.

## Próximos passos

- [Models](../models/introducao.md) — como usar models para interagir com o backend
- [Facades](../facades/app.md) — referência de todos os facades
- [Helpers](../helpers.md) — funções de conveniência
