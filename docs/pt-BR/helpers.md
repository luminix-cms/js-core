# Helpers

Os helpers são funções de conveniência que encapsulam os facades. São a forma mais concisa de acessar os serviços no código do aplicativo.

## `app(facade?)`

Retorna o facade `App` ou resolve um serviço do container:

```typescript
import { app } from '@luminix/core';

// Retorna o facade App
const App = app();

// Resolve um serviço específico
const config = app('config');
const auth   = app('auth');
const model  = app('model');
const route  = app('route');
const http   = app('http');
const log    = app('log');
const error  = app('error');
```

Equivalente a:
```typescript
import { App } from '@luminix/core';
App;           // facade App
App.make('config'); // serviço config
```

---

## `auth()`

Retorna o facade `Auth`:

```typescript
import { auth } from '@luminix/core';

auth().check();           // boolean
auth().user();            // Model | undefined
auth().id();              // number | string | null
auth().attempt({ email, password });
auth().logout();
```

---

## `config(path?, default?)`

Lê um valor de configuração com dot notation:

```typescript
import { config } from '@luminix/core';

config();                         // retorna o facade Config
config('app.name');               // 'Minha App'
config('app.debug', false);       // com valor padrão
config('app.env');                // 'local' | 'production' | ...
```

Equivalente a:
```typescript
import { Config } from '@luminix/core';
Config.get('app.name');
```

---

## `collect(items?)`

Cria uma `Collection` do `@luminix/support`. A `Collection` é uma coleção fluente com mais de 80 métodos, similar à Collection do Laravel:

```typescript
import { collect } from '@luminix/core';

const usuarios = collect([
    { id: 1, nome: 'Alice', perfil: 'admin' },
    { id: 2, nome: 'Bob',   perfil: 'user'  },
]);

usuarios.where('perfil', 'admin').pluck('nome').first(); // 'Alice'
usuarios.count();           // 2
usuarios.filter(u => u.id > 1).map(u => u.nome).all(); // ['Bob']
```

Veja a [documentação da Collection](https://github.com/luminix-cms/support/blob/v1.x/docs/index.md#collection) para a referência completa.

---

## `error()`

Retorna o facade `Error`:

```typescript
import { error } from '@luminix/core';

error().get('email');            // string | null
error().get('email', 'loginForm'); // bag nomeado
error().all();                   // Record<string, string>
error().add('campo', 'mensagem');
error().set({ campo: 'mensagem' });
error().clear();
```

---

## `log()`

Retorna o facade `Log` (ativo apenas quando `app.debug === true`):

```typescript
import { log } from '@luminix/core';

log().info('Mensagem informativa', dados);
log().warning('Aviso:', mensagem);
log().error('Erro:', erro);
log().debug('Payload:', payload);
```

---

## `model(abstract)`

Retorna a classe do model para o nome dado:

```typescript
import { model } from '@luminix/core';

const User    = model('user');
const Post    = model('post');
const Profile = model('user_profile');

// Instanciar
const user = new User({ name: 'João' });

// Consultar
const { data } = await User.get();
const user = await User.find(1);

// Criar
const user = await User.create({ name: 'João', email: 'joao@example.com' });
```

Equivalente a:
```typescript
import { Model } from '@luminix/core';
Model.make('user');
```

---

## `route()`

Retorna o facade `Route`:

```typescript
import { route } from '@luminix/core';

route().url('home');                          // 'https://example.com/'
route().url(['users.show', { user: 1 }]);     // URL com parâmetro
route().path('users.index');                  // '/users'
route().exists('users.index');                // boolean
route().methods('users.index');               // ['get']
await route().call('users.index');            // Response
await route().call(['users.show', { user: 1 }]);
```

---

## Comparação helpers vs facades

| Helper | Facade equivalente | Quando usar |
|--------|--------------------|-------------|
| `app()` | `App` | Ciclo de vida, container |
| `auth()` | `Auth` | Autenticação |
| `config('path')` | `Config.get('path')` | Leitura de config — `config()` é mais conciso |
| `collect([])` | `new Collection([])` | Criação de coleções |
| `error()` | `Error` | Error bags |
| `log()` | `Log` | Logging condicional |
| `model('x')` | `Model.make('x')` | Acesso a models |
| `route()` | `Route` | URLs e chamadas HTTP |

Os helpers e facades são intercambiáveis. Os helpers são preferíveis no código de aplicativo por serem mais concisos; os facades são preferíveis em plugins e providers onde você precisa da referência tipada diretamente.
