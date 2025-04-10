## Route

A facade Route centraliza o controle de rotas nomeadas e gera URLs com substituição de parâmetros dinâmicos.

- Route.get(name: string)

Retorna uma rota definida.
```ts
Route.get('users.show'); // ['/usuarios/{id}', 'get']
```

- Route.exists(name: string)

Verifica se a rota existe.
```ts
Route.exists('users.create'); // true
```

- Route.url([name, params])

Gera a URL absoluta substituindo os parâmetros.
```ts
Route.url(['users.show', { id: 1 }]); // 'https://.../usuarios/1'
```

- Route.path([name, params])

Gera o path relativo substituindo os parâmetros.
```ts
Route.path(['users.show', { id: 1 }]); // '/usuarios/1'
```

- Route.methods(name: string)

Retorna os métodos HTTP permitidos para a rota.
```ts
Route.methods('users.update'); // ['put']
```

- Route.call(generator, tap?, errorBag?)

Faz uma chamada para a rota utilizando as configurações e validações do client.
```ts
await Route.call(['users.store'], (client) => client.withData(userData));
```