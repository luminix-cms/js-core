## Introdução
O Luminix ORM é um Object-Relational Mapper baseado em API REST, inspirado no Eloquent do Laravel, porém adaptado para comunicação via HTTP com backends modernos. Ele permite trabalhar com modelos como se fossem instâncias locais, gerenciando requisições, relacionamentos, serialização, mutators/casts e até paginação.

Os modelos podem ser registrados dinamicamente a partir de um manifesto enviado pelo backend, o que possibilita uma abordagem desacoplada e flexível para lidar com diferentes recursos da API.

### Relacionamentos
O Luminix ORM suporta diversos tipos de relacionamentos entre modelos, todos inspirados no padrão Eloquent:

#### BelongsTo
Representa um relacionamento "pertence a". Exemplo: cada Post pertence a um User.

```ts
const post = await Post.find(1);
const user = await post.relation('author')?.get(); // Busca o autor associado
```
Você também pode associar ou desassociar:

```ts
await post.relation('author')?.associate(user); // Associa
await post.relation('author')?.dissociate();    // Remove a associação
```

#### HasOne
Representa um relacionamento "possui um". Exemplo: um User possui um Profile.

```ts
const user = await User.find(1);
const profile = await user.relation('profile')?.get(); // Busca o perfil
```
Para salvar:

```ts
await user.relation('profile')?.save(new Profile({ bio: 'Desenvolvedor' }));
```

#### HasMany
Representa um relacionamento "possui muitos". Exemplo: um User possui muitos Posts.

```ts
const user = await User.find(1);
const posts = await user.relation('posts')?.all(); // Busca todos os posts
```

Salvar vários registros:

```ts
await user.relation('posts')?.saveMany([
  new Post({ title: 'Post 1' }),
  new Post({ title: 'Post 2' }),
]);
```

#### BelongsToMany
Relacionamento muitos-para-muitos. Exemplo: um User pode pertencer a vários Groups.

```ts
const user = await User.find(1);
const groups = await user.relation('groups')?.all(); // Todos os grupos do usuário

await user.relation('groups')?.attach(5); // Associa com o grupo de ID 5
await user.relation('groups')?.detach(5); // Remove a associação
await user.relation('groups')?.sync([1, 2, 3]); // Sincroniza os grupos
```

#### MorphTo / MorphOne / MorphMany
Relacionamentos polimórficos. Exemplo: uma Image pode pertencer a um User ou a um Post.

```ts
const image = await Image.find(1);
const owner = await image.relation('imageable')?.get(); // Pode ser um User ou Post
```

## Mutators e Casts
Mutators permitem customizar como os dados são acessados e armazenados nos modelos. Casts são usados para transformar atributos em tipos específicos automaticamente.

Acessando atributos (mutators):
```ts
const user = new User({ name: 'john doe' });
console.log(user.getAttribute('name')); // john doe
```
Você pode definir um mutator para formatar o nome:

```ts
// Exemplo dentro de definição de Model
get name() {
  return Str.title(this.attributes.name);
}
```

Casts automáticos:
Você pode definir casts no schema vindo do backend:

```ts
"casts": {
  "created_at": "datetime",
  "is_active": "boolean"
}
```
O modelo irá automaticamente converter:

```ts
const user = await User.find(1);
console.log(user.getAttribute('created_at') instanceof Date); // true
console.log(typeof user.getAttribute('is_active')); // boolean
```
