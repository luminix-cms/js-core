# Plugins

Os plugins permitem encapsular lógica de inicialização, registro de serviços e macros em unidades reutilizáveis.

## Estrutura de um plugin

Um plugin é um `ServiceProvider` do `@luminix/support`. Crie uma classe que estende `ServiceProvider`:

```typescript
import { ServiceProvider } from '@luminix/support';

export default class MeuPlugin extends ServiceProvider {

    register() {
        // Registra serviços no container
        // Chamado antes do boot()
        this.app.singleton('meuServico', () => new MeuServico());
    }

    boot() {
        // Inicializa lógica, registra reducers/macros
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

## Instalando um plugin

Passe os providers adicionais com `withProviders()` antes do `create()`:

```typescript
import { App } from '@luminix/core';
import MeuPlugin from './providers/MeuPlugin';
import OutroPlugin from './providers/OutroPlugin';

App.withProviders([MeuPlugin, OutroPlugin]).create();
```

## Acessando serviços internos no plugin

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

## Exemplo: plugin de cast customizado

```typescript
import { ServiceProvider } from '@luminix/support';

export default class DayJsCastPlugin extends ServiceProvider {

    boot() {
        const model = this.app.make('model');

        // Adiciona suporte ao cast 'dayjs' em todos os models
        model.reducer('modelUserGetCreatedAtAttribute', (value) => {
            if (value instanceof Date) {
                return dayjs(value);
            }
            return value;
        });
    }
}
```

## Distribuindo um plugin

Para criar um plugin reutilizável via npm:

1. Crie um pacote com a classe do provider
2. Exporte o provider como default
3. Documente quais reducers e serviços o plugin registra

```typescript
// meu-luminix-plugin/src/index.ts
export { default } from './providers/MeuPlugin';
```

Uso pelo consumidor:

```bash
npm install meu-luminix-plugin
```

```typescript
import { App } from '@luminix/core';
import MeuPlugin from 'meu-luminix-plugin';

App.withProviders([MeuPlugin]).create();
```

---

> **Nota:** Versões anteriores do `@luminix/core` usavam uma classe `Plugin` abstrata exportada diretamente pelo pacote. Essa abordagem está **deprecated** — use `ServiceProvider` do `@luminix/support`.
