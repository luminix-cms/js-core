# Documentação — @luminix/core

Documentação completa do pacote `@luminix/core`, a camada JavaScript fundamental do stack Luminix.

---

## Guia

| Página | Descrição |
|--------|-----------|
| [Introdução](guia/introducao.md) | O que é o Luminix e o papel deste pacote |
| [Instalação](guia/instalacao.md) | Requisitos e como instalar |
| [Configurando o Laravel](guia/configurando-laravel.md) | `luminix/backend`, `luminix/frontend` e `@luminixEmbed()` |
| [Inicialização](guia/inicializacao.md) | Ciclo de vida da aplicação e `App.create()` |

---

## Models

| Página | Descrição |
|--------|-----------|
| [Introdução aos Models](models/introducao.md) | O que são Models e como obtê-los |
| [Operações CRUD](models/crud.md) | Criar, ler, atualizar e excluir |
| [Query Builder](models/query-builder.md) | Filtros, paginação, ordenação e busca |
| [Atributos e Casts](models/atributos.md) | Acesso a atributos, conversão e o Proxy |
| [Relacionamentos](models/relacionamentos.md) | HasOne, HasMany, BelongsTo e variantes Morph |

---

## Facades

| Facade | Descrição |
|--------|-----------|
| [App](facades/app.md) | Container de serviços, macros e ambiente |
| [Auth](facades/auth.md) | Autenticação, usuário atual e logout |
| [Config](facades/config.md) | Acesso à configuração com dot notation |
| [Route](facades/route.md) | URLs e chamadas de rotas nomeadas |
| [Http](facades/http.md) | Cliente HTTP fluente |
| [Log](facades/log.md) | Logging condicional por nível |
| [Error](facades/error.md) | Gerenciamento de error bags |

---

## Avançado

| Página | Descrição |
|--------|-----------|
| [Extensões](avancado/plugins.md) | Extensão do `@luminix/core` via ServiceProvider |
| [Reducers](avancado/reducers.md) | Pipeline de transformação para Models e rotas |

---

## Referência rápida

| Página | Descrição |
|--------|-----------|
| [Helpers](helpers.md) | Funções `app()`, `auth()`, `config()`, `model()` e outras |
