## Error
A facade Error gerencia mensagens de erro para validações ou exibições manuais.

Adiciona um erro à chave especificada.
```ts
Error.add(key: string, value: string, bag?: string)
```

Substitui os erros existentes com um novo conjunto.
```ts
Error.add('email', 'E-mail inválido');
Error.set(errors: Record<string, string>, bag?: string)
```

Obtém o erro associado à chave.
```ts
Error.set({
  email: 'Campo obrigatório',
  password: 'Muito curta',
});
Error.get(key: string, bag?: string): string | null
```

Retorna todos os erros.
```ts
const message = Error.get('email');
console.log(message); // 'Campo obrigatório'
Error.all(bag?: string): Record<string, string>
```

Limpa todos os erros registrados (ou de uma bag específica).
```ts
const allErrors = Error.all();
console.log(allErrors); // { email: 'Campo obrigatório', password: 'Muito curta' }
Error.clear(bag?: string)
```

Obtém uma instância ErrorBag associada a um nome.
```ts
Error.clear();
Error.bag(name?: string): ErrorBag
```

```ts
const errors = Error.bag('login').all();
```