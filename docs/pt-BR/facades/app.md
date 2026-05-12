# Facade App

O facade `App` é o container de serviços central do `@luminix/core`. Ele gerencia o ciclo de vida da aplicação e fornece acesso a todos os serviços internos.

## Importação

```typescript
import { App } from '@luminix/core';     // facade
import { app } from '@luminix/core';     // helper
```

## Ciclo de vida

### `App.create()`

Inicializa a aplicação. Deve ser chamado uma única vez, antes de usar qualquer helper ou facade.

```typescript
App.create();
```

Veja [Inicialização](../guia/inicializacao.md) para detalhes completos.

### `App.down()`

Destrói a instância atual (útil em testes para reinicializar):

```typescript
App.down();
```

### `App.withConfiguration(config)`

Define configuração antes do create. Retorna `this` para encadeamento:

```typescript
App.withConfiguration({ app: { debug: true } }).create();
```

### `App.withProviders(providers)`

Registra provedores de serviço adicionais:

```typescript
App.withProviders([MeuProvider]).create();
```

---

## Container de serviços

### `App.make(abstract)`

Resolve um serviço do container:

```typescript
const config  = App.make('config');
const auth    = App.make('auth');
const model   = App.make('model');
const route   = App.make('route');
const http    = App.make('http');
const log     = App.make('log');
const error   = App.make('error');
```

Equivalente ao helper `app('config')` etc.

### `App.bind(abstract, factory)`

Registra um serviço (nova instância a cada `make()`):

```typescript
App.bind('meuServico', () => new MeuServico());
```

### `App.singleton(abstract, factory)`

Registra um singleton (mesma instância em todos os `make()`):

```typescript
App.singleton('meuServico', () => new MeuServico());
```

---

## Macros de ambiente

### `App.environment(...environments?)`

Sem argumentos, retorna o ambiente atual:

```typescript
App.environment(); // 'local' | 'production' | 'staging' | ...
```

Com argumentos, verifica se está em um dos ambientes:

```typescript
App.environment('local');              // true se env === 'local'
App.environment('local', 'staging');   // true se env === 'local' ou 'staging'
```

### `App.isLocal()`

```typescript
App.isLocal();      // true se env === 'local'
```

### `App.isProduction()`

```typescript
App.isProduction(); // true se env === 'production'
```

### `App.getLocale()`

```typescript
App.getLocale();    // 'pt_BR', 'en', etc.
```

### `App.hasDebugModeEnabled()`

```typescript
App.hasDebugModeEnabled(); // true se app.debug === true
```

---

## Eventos do ciclo de vida

```typescript
App.on('ready',    () => { /* aplicação pronta */ });
App.on('booting',  () => { /* antes do boot dos providers */ });
App.on('booted',   () => { /* após o boot dos providers */ });
App.on('flushing', () => { /* antes de destruir */ });
App.on('flushed',  () => { /* após destruir */ });
```

> Listeners devem ser registrados antes de `App.create()`.

---

## Usando via helper

O helper `app()` oferece atalhos:

```typescript
import { app } from '@luminix/core';

// Retorna o facade App
app();

// Resolve um serviço diretamente
app('config');  // equivalente a App.make('config')
app('auth');
app('model');
```

Veja [helpers](../helpers.md) para todos os atalhos disponíveis.
