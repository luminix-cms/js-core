# @luminix/core

Biblioteca JavaScript fundamental do stack Luminix. Agnóstica de framework frontend — funciona com React, Vue, Svelte ou vanilla JS/TS.

## Posição no stack

```
@luminix/mui-cms         ← CMS completo com Material UI
    └── @luminix/react   ← Integração com React
            └── @luminix/core   ← este pacote
                    └── @luminix/support
```

## O que faz

- **Models** — API Eloquent-like para consumir os endpoints REST do `luminix/backend`
- **Facades** — `App`, `Auth`, `Config`, `Route`, `Http`, `Log`, `Error`
- **Plugins e Reducers** — para estender e customizar o comportamento
- **Helpers** — `app()`, `auth()`, `config()`, `model()`, `route()`, `log()`, `error()`, `collect()`

## Pré-requisitos

Uma aplicação Laravel 11 com:
- [`luminix/backend`](https://github.com/luminix-cms/backend) — gera a API REST automaticamente
- [`luminix/frontend`](https://github.com/luminix-cms/frontend) — injeta os dados de boot na página via `@luminixEmbed()`

## Instalação

```bash
npm install @luminix/core
```

## Uso rápido

```typescript
import { App, model, auth, config } from '@luminix/core';

// Inicializa (lê config do @luminixEmbed() automaticamente)
App.create();

// Acessa dados de configuração
console.log(config('app.name'));

// Verifica autenticação
if (auth().check()) {
    console.log(`Bem-vindo, ${auth().user()?.name}`);
}

// Usa um model
const User = model('user');
const { data } = await User.where('role', 'admin').orderBy('name').get();
data.each((user) => console.log(user.name, user.email));

// Cria um registro
const post = await model('post').create({ title: 'Olá mundo', content: '...' });
```

## Documentação

[Documentação completa (pt-BR) →](docs/pt-BR/README.md)

## Licença

MIT
