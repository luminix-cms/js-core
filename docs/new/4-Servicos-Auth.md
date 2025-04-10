## Auth
A facade Auth fornece métodos de autenticação, permitindo verificar o estado do usuário e acessar seus dados.

Realiza o login com as credenciais informadas. Pode lembrar a sessão e disparar uma callback.
```ts
Auth.attempt(credentials, remember, onSubmit?)
```

Verifica se o usuário está autenticado.
```ts
Auth.attempt({ email: 'user@email.com', password: '123456' }, true);
Auth.check(): boolean
```

Realiza o logout do usuário atual.
```ts
if (Auth.check()) {
  console.log('Usuário logado!');
}
Auth.logout(onSubmit?)
```

Retorna o modelo do usuário autenticado ou null.
```ts
Auth.logout();
Auth.user(): Model | null
```

Retorna o ID do usuário autenticado.
```ts
console.log(Auth.user()?.getAttribute('name'));
Auth.id(): number | string | null
```

```ts
console.log('User ID:', Auth.id());
```