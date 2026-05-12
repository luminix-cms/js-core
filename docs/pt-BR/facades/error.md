# Facade Error

O facade `Error` gerencia error bags — coleções nomeadas de mensagens de erro. É alimentado automaticamente pelo facade `Route` após requisições que retornam erros de validação (HTTP 422) ou erros de servidor.

## Importação

```typescript
import { Error } from '@luminix/core';  // facade (evitar conflito com o Error nativo)
import { error } from '@luminix/core'; // helper (recomendado)
```

> **Atenção:** importar `Error` do `@luminix/core` pode conflitar com o `Error` nativo do JavaScript. Prefira o helper `error()` ou use um alias: `import { Error as LuminixError } from '@luminix/core'`.

---

## Error bags

Todos os métodos aceitam um argumento `bag` opcional (padrão: `'default'`). Error bags permitem isolar erros de diferentes formulários na mesma página.

---

## Lendo erros

### `error().get(key, bag?)`

Retorna a mensagem de erro para um campo, ou `null` se não houver:

```typescript
error().get('email');           // 'O campo email é obrigatório.'  ou  null
error().get('name');
error().get('email', 'login');  // bag nomeado
```

### `error().all(bag?)`

Retorna todos os erros do bag como objeto:

```typescript
error().all();
// { name: 'Campo obrigatório.', email: 'Email inválido.' }

error().all('loginForm');
```

---

## Escrevendo erros

### `error().add(key, message, bag?)`

Adiciona um único erro manualmente:

```typescript
error().add('email', 'Este email já está em uso.');
error().add('card', 'Número de cartão inválido.', 'pagamento');
```

### `error().set(errors, bag?)`

Substitui todos os erros do bag de uma vez:

```typescript
error().set({
    name: 'Nome é obrigatório.',
    email: 'Email inválido.',
});
```

---

## Limpando erros

### `error().clear(bag?)`

Limpa todos os erros de um bag:

```typescript
error().clear();           // limpa o bag 'default'
error().clear('loginForm'); // limpa um bag específico
```

---

## Erros do Laravel via @luminixEmbed

Erros de validação do Laravel passados via `@luminixEmbed('email|password')` são carregados automaticamente no bag `'default'` durante o boot:

```blade
{{-- No layout Blade --}}
@luminixEmbed('email|password')
```

```typescript
// No JavaScript, após App.create()
error().get('email');    // erro de validação do Laravel, se houver
error().get('password');
```

---

## Integração com route().call()

O facade Route alimenta o facade Error automaticamente após requisições com erro:

```typescript
await route().call(
    ['users.store', {}],
    (client) => client.withData(formData),
    'userForm'      // <- bag nomeado
);

// Erros de validação (422) disponíveis aqui
error().get('name', 'userForm');
error().get('email', 'userForm');
```

---

## Multiplos bags

Use bags nomeados para isolar erros de diferentes formulários na mesma página:

```typescript
// Formulário de login
await route().call('login', (c) => c.withData(loginData), 'login');

// Formulário de registro
await route().call('register', (c) => c.withData(registerData), 'register');

// Lendo cada bag separadamente
error().get('email', 'login');
error().get('email', 'register');

// Limpando individualmente
error().clear('login');
```
