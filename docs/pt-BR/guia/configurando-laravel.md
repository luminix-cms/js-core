# Configurando o Laravel

O `@luminix/core` precisa de dois pacotes PHP instalados no Laravel: `luminix/backend` e `luminix/frontend`.

## Instalando os pacotes PHP

```bash
composer require luminix/backend luminix/frontend
```

Após a instalação, publique as configurações:

```bash
php artisan vendor:publish --provider="Luminix\Backend\BackendServiceProvider"
php artisan vendor:publish --provider="Luminix\Frontend\FrontendServiceProvider"
```

## luminix/backend

O `luminix/backend` gera automaticamente endpoints RESTful para cada model Eloquent que use a trait `LuminixModel`. Esses endpoints são o que os [Models](../models/introducao.md) do `@luminix/core` consomem.

```php
// app/Models/Post.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Luminix\Backend\Model\LuminixModel;

class Post extends Model
{
    use LuminixModel;

    protected $fillable = ['title', 'content', 'published_at'];
}
```

Endpoints gerados automaticamente (sob o prefixo `/luminix-api`):

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/luminix-api/posts` | Listagem paginada |
| `POST` | `/luminix-api/posts` | Criar |
| `GET` | `/luminix-api/posts/{id}` | Buscar por ID |
| `POST` | `/luminix-api/posts/{id}` | Atualizar |
| `DELETE` | `/luminix-api/posts/{id}` | Excluir |
| `DELETE` | `/luminix-api/posts` | Exclusão em lote |
| `POST` | `/luminix-api/posts/restore` | Restaurar (SoftDeletes) |

## luminix/frontend

O `luminix/frontend` empacota os dados de boot (configuração da aplicação, schema dos models, mapa de rotas) e os entrega ao JavaScript.

Há duas formas de fazer isso.

---

### Opção 1: Diretiva Blade `@luminixEmbed()` (recomendada)

Adicione a diretiva ao layout Blade da página onde o JavaScript roda:

```blade
<!DOCTYPE html>
<html>
<head>
    @vite(['resources/js/app.js'])
</head>
<body>
    @luminixEmbed()
    <div id="app"></div>
</body>
</html>
```

A diretiva renderiza um elemento HTML oculto com os dados de boot em JSON:

```html
<div id="luminix-embed" style="display: none" aria-hidden="true">
    <div id="luminix-data::config" data-json="1" data-value='{"app":{...},"auth":{...},"manifest":{...}}'></div>
</div>
```

O `@luminix/core` lê esse elemento automaticamente durante `App.create()`.

#### Erros de validação do Laravel

Passe os campos que devem expor erros de validação via parâmetro:

```blade
@luminixEmbed('email|password')
```

Os erros estarão disponíveis via `error().get('email')` após o boot.

---

### Opção 2: Arquivo de manifest (build estático)

Use quando a configuração pode ser gerada em tempo de build (ambiente sem autenticação ou com autenticação via token):

```bash
# Gera resources/js/config/manifest.json
php artisan luminix:manifest

# Para usuários não autenticados (somente dados públicos)
php artisan luminix:manifest --no-auth

# Caminho customizado
php artisan luminix:manifest --path=resources/js/config/manifest.json
```

No JavaScript, importe o arquivo e passe na inicialização:

```typescript
import { App } from '@luminix/core';
import manifest from './config/manifest.json';

App.withConfiguration({ manifest }).create();
```

---

## Dados de boot

Independentemente da forma escolhida, o objeto de configuração tem este formato:

```typescript
{
    app: {
        name: string;
        env: 'local' | 'production' | string;
        debug: boolean;
        url: string;
        locale: string;
    },
    auth: {
        user: { id: number; name: string; email: string; [key: string]: unknown } | null;
        csrf: string;
    },
    manifest: {
        models: {
            [abstract: string]: {
                attributes: ModelAttribute[];
                displayName: { singular: string; plural: string };
                fillable: string[];
                casts: Record<string, string>;
                primaryKey: string;
                timestamps: boolean;
                labeledBy: string;
                softDeletes: boolean;
                relations: Record<string, RelationMetaData>;
            }
        },
        routes: {
            [routeName: string]: [path: string, ...methods: string[]]
        }
    }
}
```

## Próximo passo

[Inicialização →](inicializacao.md)
