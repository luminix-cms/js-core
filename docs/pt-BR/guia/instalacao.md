# Instalação

## Requisitos

- Node.js 18+
- Um bundler moderno (Vite, Webpack, ou similar)
- Uma aplicação Laravel 11 com `luminix/backend` e `luminix/frontend` instalados

## Instalando o pacote

```bash
npm install @luminix/core
```

O `@luminix/support` é uma peer dependency obrigatória instalada automaticamente pelo npm.

## TypeScript

O `@luminix/core` é escrito em TypeScript e publica seus tipos junto com o pacote. Nenhuma instalação extra de `@types/*` é necessária.

Recomenda-se o seguinte `tsconfig.json` mínimo:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "lib": ["ES2020", "DOM"]
  }
}
```

## Estrutura de exports

O pacote expõe helpers, facades e tipos:

```typescript
// Helpers (funções de conveniência)
import { app, auth, collect, config, error, log, model, route } from '@luminix/core';

// Facades (acesso direto sem chamada de função)
import { App, Auth, Config, Error, Http, Log, Model, Route } from '@luminix/core';

// Tipos TypeScript
import type { AppFacade, AppContainers, ModelType, BaseModel } from '@luminix/core';
```

## Próximo passo

[Configurando o Laravel →](configurando-laravel.md)
