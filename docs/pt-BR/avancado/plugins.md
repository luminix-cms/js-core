# Extensões

As extensões permitem encapsular lógica de inicialização, registro de serviços e reducers em unidades reutilizáveis.

## Estrutura de uma extensão

Uma extensão é um `ServiceProvider` do `@luminix/support`. Crie uma classe que estende `ServiceProvider`:

```typescript
import { ServiceProvider } from '@luminix/support';

export default class MinhaExtensao extends ServiceProvider {

    register() {
        // Registra serviços no container
        // Chamado antes do boot()
        this.app.singleton('meuServico', () => new MeuServico());
    }

    boot() {
        // Inicializa lógica, registra reducers
        // Todos os serviços já estão disponíveis aqui
        const config = this.app.make('config');
        const model  = this.app.make('model');

        model.reducer('modelPostGetExcerptAttribute', (value, post) => {
            return post.attributes.content?.substring(0, 150) + '...';
        });
    }

    flush() {
        // Limpeza quando App.down() é chamado
    }
}
```

## Instalando uma extensão

Passe os providers com `withProviders()` antes do `create()`:

```typescript
import { App } from '@luminix/core';
import MinhaExtensao from './providers/MinhaExtensao';
import OutraExtensao from './providers/OutraExtensao';

App.withProviders([MinhaExtensao, OutraExtensao]).create();
```

## Acessando serviços internos

Dentro do `boot()`, todos os serviços do `@luminix/core` já estão disponíveis:

```typescript
boot() {
    const config = this.app.make('config');  // ConfigFacade
    const model  = this.app.make('model');   // ModelFacade
    const route  = this.app.make('route');   // RouteFacade
    const auth   = this.app.make('auth');    // AuthFacade
    const log    = this.app.make('log');     // LogFacade
    const error  = this.app.make('error');   // ErrorFacade
    const http   = this.app.make('http');    // HttpFacade
}
```

## Exemplo: extensão de cast customizado

```typescript
import { ServiceProvider } from '@luminix/support';
import dayjs from 'dayjs';

export default class DayJsCastExtensao extends ServiceProvider {

    boot() {
        const model = this.app.make('model');

        // Converte created_at para objeto Day.js em todos os models
        model.reducer('model', (ModelClass) => class extends ModelClass {
            get created_at() {
                const raw = super.getAttribute('created_at');
                return raw instanceof Date ? dayjs(raw) : raw;
            }
        });
    }
}
```

## Distribuindo uma extensão via npm

1. Crie um pacote com a classe do provider
2. Exporte o provider como default
3. Documente quais reducers e serviços a extensão registra

```typescript
// minha-extensao-luminix/src/index.ts
export { default } from './providers/MinhaExtensao';
```

Uso pelo consumidor:

```bash
npm install minha-extensao-luminix
```

```typescript
import { App } from '@luminix/core';
import MinhaExtensao from 'minha-extensao-luminix';

App.withProviders([MinhaExtensao]).create();
```
