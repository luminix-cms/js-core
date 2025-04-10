## Http

A facade para chamadas HTTP utilizando uma API fluente baseada em Client. Permite configurar cabeçalhos, baseURL, autenticação, dados e efetuar chamadas com diversos métodos HTTP.

Define a URL base para todas as requisições subsequentes.
```ts
Http.baseUrl(url: string): Client
```

Define o cabeçalho Accept.
```ts
Http.baseUrl('https://api.exemplo.com').get('/users');

Http.accept(type: string): Client
```

Atalho para definir Accept: application/json.
```ts
Http.accept('application/json');

Http.acceptJson(): Client
```

Define o Content-Type como application/x-www-form-urlencoded.
```ts
Http.acceptJson();

Http.asForm(): Client
```

Adiciona cabeçalhos personalizados.
```ts
Http.asForm().post('/login', { email, password });

Http.withHeaders(headers: Record<string, string>): Client
```

Mescla opções extras no client.
```ts
Http.withHeaders({ Authorization: 'Bearer TOKEN' });

Http.withOptions(options: RequestOptions): Client
```

Adiciona dados ao corpo da requisição.
```ts
Http.withOptions({ timeout: 5000 });

Http.withData(data: object): Client
```

Define parâmetros da URL.
```ts
Http.withData({ ativo: true }).post('/produtos');

Http.withQueryParameters(params: object | string): Client
```

Define autenticação via Basic Auth.
```ts
Http.withQueryParameters({ page: 1, limit: 10 }).get('/usuarios');

Http.withBasicAuth(user, pass): Client
```

Define o cabeçalho Authorization: Bearer.
```ts
Http.withBasicAuth('admin', '123456');

Http.withToken(token: string): Client
```

Realiza uma requisição GET.
```ts
Http.withToken('TOKEN').get('/perfil');

Http.get(url: string, query?)
```

Realiza uma requisição POST.
```ts
const response = await Http.get('/usuarios');

Http.post(url: string, data?)
```

Realiza uma requisição PUT.
```ts
const response = await Http.post('/usuarios', { nome: 'João' });

Http.put(url: string, data?)
```

Realiza uma requisição PATCH.
```ts
await Http.put('/usuarios/1', { ativo: false });

Http.patch(url: string, data?)
```

Realiza uma requisição DELETE.
```ts
await Http.patch('/usuarios/1', { nome: 'João da Silva' });

Http.delete(url: string, query?)

await Http.delete('/usuarios/1');
```