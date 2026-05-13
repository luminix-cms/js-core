# Introdução

## O que é o Luminix?

O Luminix é um stack que torna o Laravel um ambiente full-stack completo. O objetivo é permitir que você desenvolva o frontend com uma API mínima e familiar — similar à do Laravel — sem precisar escrever uma camada de API manualmente.

O stack é composto por pacotes PHP para o backend e pacotes JavaScript para o frontend:

```
@luminix/mui-cms         ← CMS completo com Material UI (requer luminix/admin)
    └── @luminix/react   ← Integração com React
            └── @luminix/core   ← este pacote
                    └── @luminix/support
```

No lado PHP (via Composer):

| Pacote | Função |
|--------|--------|
| `luminix/backend` | Gera endpoints RESTful automáticos a partir dos models Eloquent |
| `luminix/frontend` | Serializa configuração e schema de models/rotas para o JavaScript |

## O que é `@luminix/core`?

`@luminix/core` é a biblioteca JavaScript fundamental do stack. Ela é **agnóstica de framework frontend** — funciona com React, Vue, Svelte, ou vanilla JS/TS.

Ela fornece:

- **Models** — uma camada de dados Eloquent-like para consumir os endpoints gerados pelo `luminix/backend`
- **Facades** — `App`, `Auth`, `Config`, `Route`, `Http`, `Log`, `Error`
- **Sistema de Plugins e Reducers** — para estender e customizar o comportamento
- **Helpers** — `app()`, `auth()`, `config()`, `model()`, `route()`, `log()`, `error()`, `collect()`

## Pré-requisitos

Para usar `@luminix/core`, você precisa:

1. Uma aplicação Laravel 11 com os pacotes PHP instalados:
   - [`luminix/backend`](https://github.com/luminix-cms/backend) — gera a API REST
   - [`luminix/frontend`](https://github.com/luminix-cms/frontend) — injeta os dados de boot na página

2. A diretiva Blade `@luminixEmbed()` presente na página onde o JavaScript é carregado (ou o arquivo JSON gerado por `php artisan luminix:manifest` disponível em tempo de build)

## Próximos passos

- [Instalação](instalacao.md) — requisitos e `npm install`
- [Configurando o Laravel](configurando-laravel.md) — setup dos pacotes PHP
- [Inicialização](inicializacao.md) — como fazer o `App.create()`
