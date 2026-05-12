# Facade Auth

O facade `Auth` gerencia o estado de autenticação do usuário. Os dados do usuário são carregados a partir do boot data do `luminix/frontend`.

## Importação

```typescript
import { Auth } from '@luminix/core';   // facade
import { auth } from '@luminix/core';   // helper
```

---

## Métodos

### `auth().check()`

Verifica se há um usuário autenticado:

```typescript
if (auth().check()) {
    console.log('Usuário autenticado');
} else {
    console.log('Usuário não autenticado');
}
```

### `auth().user()`

Retorna uma instância do model `user` com os dados do usuário autenticado, ou `undefined` se não autenticado:

```typescript
const user = auth().user();

if (user) {
    console.log(user.name);
    console.log(user.email);
}
```

O model retornado é uma instância completa — você pode chamar métodos nele:

```typescript
const user = auth().user();
user?.save(); // salva alterações no backend
```

### `auth().id()`

Retorna o ID do usuário autenticado, ou `null` se não autenticado:

```typescript
const userId = auth().id(); // number | string | null
```

---

## Login

### `auth().attempt(credentials, remember?, onSubmit?)`

Realiza o login submetendo um formulário para a rota `login` do Laravel. Isso causa um redirecionamento de página completo — o comportamento padrão do Laravel com autenticação por sessão.

```typescript
auth().attempt({
    email: 'usuario@example.com',
    password: 'senha',
});

// Com "lembrar-me"
auth().attempt({ email: '...', password: '...' }, true);

// Interceptando o submit (ex: para validação customizada)
auth().attempt({ email: '...', password: '...' }, false, (event) => {
    event.preventDefault();
    // lógica customizada
});
```

> **Importante:** `attempt()` submete um formulário HTML e causa redirecionamento. Não retorna uma Promise com o resultado — o comportamento pós-login é definido pelo Laravel.

---

## Logout

### `auth().logout(onSubmit?)`

Submete um formulário POST para a rota `logout` do Laravel:

```typescript
auth().logout();

// Com interceptação
auth().logout((event) => {
    event.preventDefault();
    // confirmação antes de deslogar
});
```

---

## Usando com frameworks

Em aplicações React ou Vue, você geralmente vai querer reatividade sobre o estado de auth. Cada framework tem sua própria forma de integrar:

```typescript
// Exemplo genérico — verifique @luminix/react para a integração recomendada
const isAuthenticated = auth().check();
const currentUser = auth().user();
```

---

## Tipos

```typescript
import type { AuthFacade } from '@luminix/core';

// Credenciais
type AuthCredentials = {
    email: string;
    password: string;
};
```
