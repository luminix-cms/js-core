# Facade Http

O facade `Http` fornece um cliente HTTP fluente baseado em Axios. É a camada de comunicação usada internamente pelos Models e pelo facade Route, mas também pode ser usado diretamente.

## Importação

```typescript
import { Http } from '@luminix/core'; // facade
```

Não há um helper de função curta para o `Http` — use o facade diretamente.

---

## Requisições simples

```typescript
// GET
const response = await Http.get('/api/dados');
const response = await Http.get('/api/dados', { pagina: 2 });

// POST
const response = await Http.post('/api/dados', { nome: 'João' });

// PUT
const response = await Http.put('/api/dados/1', { nome: 'João' });

// PATCH
const response = await Http.patch('/api/dados/1', { nome: 'João' });

// DELETE
const response = await Http.delete('/api/dados/1');
```

---

## Cliente pré-configurado

Use `Http.getClient()` para obter uma instância de `Client` do `@luminix/support` e encadear configurações:

```typescript
const client = Http.getClient()
    .baseUrl('https://api.externa.com')
    .withToken('meu-token')
    .acceptJson();

const response = await client.get('/usuarios');
```

Atalhos disponíveis diretamente no facade:

```typescript
Http.baseUrl('https://api.externa.com').get('/usuarios');
Http.withToken('meu-token').post('/dados', payload);
Http.withHeaders({ 'X-App': 'Luminix' }).get('/status');
Http.asForm().post('/login', { email: '...', password: '...' });
Http.acceptJson().get('/api/v2/dados');
Http.withBasicAuth('user', 'pass').get('/protected');
Http.withData({ extra: true }).post('/dados', payload);
Http.withQueryParameters({ page: 2 }).get('/lista');
Http.withOptions({ timeout: 5000 }).get('/lento');
```

---

## Trabalhando com a Response

O objeto `Response` do `@luminix/support` oferece helpers para verificar status e acessar dados:

```typescript
const response = await Http.get('/api/usuarios');

// Dados
response.json();              // corpo completo
response.json('data');        // caminho dot notation
response.body();              // como string
response.status();            // código HTTP numérico

// Verificações de status
response.successful();        // 2xx
response.failed();            // 4xx ou 5xx
response.ok();                // 200
response.created();           // 201
response.notFound();          // 404
response.unprocessableEntity(); // 422

// Lançar exceção em caso de erro
response.throw();             // lança se failed()
response.throwIfClientError();
response.throwIfServerError();
```

---

## Verificando erros de validação

```typescript
import { isValidationError } from '@luminix/core';

try {
    const response = await Http.throw().post('/api/usuarios', dados);
} catch (e) {
    if (isValidationError(e)) {
        // e.response.data.errors — erros do Laravel
        console.log(e.response.data.errors);
    }
}
```

---

## Referência completa do Client

Para a documentação completa do `Client`, `Request` e `Response`, consulte a [documentação do @luminix/support](../../../../support/docs/index.md#http-client).
