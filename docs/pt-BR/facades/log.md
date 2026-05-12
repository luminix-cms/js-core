# Facade Log

O facade `Log` fornece logging condicional por nível, ativo apenas quando `app.debug` é `true`. Isso evita vazar informações de debug em produção sem precisar remover as chamadas do código.

## Importação

```typescript
import { Log } from '@luminix/core';  // facade
import { log } from '@luminix/core'; // helper
```

---

## Comportamento

Todos os métodos delegam ao `console` do navegador, **mas apenas quando `app.debug === true`**:

| Método | `console` usado |
|--------|-----------------|
| `emergency()` | `console.error` |
| `alert()` | `console.error` |
| `critical()` | `console.error` |
| `error()` | `console.error` |
| `warning()` | `console.warn` |
| `notice()` | `console.info` |
| `info()` | `console.info` |
| `debug()` | `console.debug` |

---

## Uso

```typescript
log().info('Usuário carregado:', user);
log().warning('Nenhum post encontrado para o usuário', userId);
log().error('Falha ao salvar:', error);
log().debug('Payload enviado:', payload);
```

Qualquer número de argumentos é aceito (assim como `console.log`):

```typescript
log().info('Resposta do backend:', response.status(), response.json());
```

---

## Verificando o modo debug

Se você precisa rodar lógica adicional apenas em modo debug, use o facade `App`:

```typescript
import { App } from '@luminix/core';

if (App.hasDebugModeEnabled()) {
    // lógica de desenvolvimento
}
```

---

## Configurando o modo debug

O debug é determinado pelo valor de `app.debug` nos dados de boot. Para ativar manualmente:

```typescript
App.withConfiguration({ app: { debug: true } }).create();
```

Em projetos com Vite:

```typescript
App.withConfiguration({ app: { debug: import.meta.env.DEV } }).create();
```
