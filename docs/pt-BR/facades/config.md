# Facade Config

O facade `Config` fornece acesso à configuração da aplicação com dot notation. Os dados de configuração são carregados a partir do boot data do `luminix/frontend`.

## Importação

```typescript
import { Config } from '@luminix/core';  // facade
import { config } from '@luminix/core'; // helper
```

---

## Leitura

### `config(path, default?)`

O helper `config()` aceita um caminho dot notation e um valor padrão opcional:

```typescript
config('app.name');           // 'Minha Aplicação'
config('app.env');            // 'local' | 'production' | ...
config('app.debug');          // true | false
config('app.url');            // 'https://example.com'
config('app.locale');         // 'pt_BR'

config('auth.user');          // objeto do usuário ou null
config('auth.csrf');          // token CSRF

// Com valor padrão se o caminho não existir
config('app.timezone', 'UTC');
```

Via facade:

```typescript
Config.get('app.name');
Config.get('app.name', 'Padrão');
Config.has('app.debug');      // true | false
Config.all();                 // objeto completo (congelado)
```

---

## Escrita

### `Config.set(path, value)`

Modifica ou adiciona um valor de configuração. O caminho `auth.user` é protegido contra escrita:

```typescript
Config.set('app.name', 'Novo Nome');
Config.set('meuPlugin.opcao', true);
```

### `Config.merge(path, value)`

Mescla profundamente um objeto em um caminho existente:

```typescript
Config.merge('app', { timezone: 'America/Sao_Paulo' });
```

---

## Estrutura padrão da configuração

A configuração é populada pelo `luminix/frontend`. A estrutura principal é:

```typescript
{
    app: {
        name: string;
        env: string;        // 'local', 'production', ...
        debug: boolean;
        url: string;
        locale: string;
        fallback_locale: string;
    },
    auth: {
        user: object | null; // dados do usuário autenticado
        csrf: string;        // token CSRF do Laravel
    },
    manifest: {
        models: { ... };     // schema dos models
        routes: { ... };     // mapa de rotas
    }
}
```

---

## Configuração customizada

Você pode adicionar seus próprios valores de configuração, tanto em `withConfiguration()` quanto via `Config.set()`:

```typescript
// Na inicialização
App.withConfiguration({
    meuApp: {
        apiKey: import.meta.env.VITE_API_KEY,
        version: '1.0.0',
    }
}).create();

// Depois do boot
config('meuApp.apiKey');         // sua chave de API
config('meuApp.version');        // '1.0.0'
Config.set('meuApp.debug', true);
```

---

## Eventos de mudança

O facade `Config` é baseado em `PropertyBag` do `@luminix/support`, que emite eventos a cada escrita:

```typescript
Config.on('change', (e) => {
    console.log(e.type);   // 'set' | 'merge' | 'delete'
    console.log(e.path);   // caminho dot-notation que mudou
    console.log(e.value);  // novo valor
});
```

---

## Tipos

```typescript
import type { AppConfiguration } from '@luminix/core';

type AppConfiguration = {
    app?: {
        name?: string;
        env?: string;
        debug?: boolean;
        url?: string;
        [key: string]: unknown;
    };
    auth?: {
        user: object | null;
        csrf?: string;
    };
    manifest?: {
        models?: ModelSchema;
        routes?: RouteDefinition;
    };
    [key: string]: unknown;
};
```
