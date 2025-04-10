## Model

A facade Model é responsável por registrar os modelos com base no schema recebido da API.


- Model.schema()

Retorna o schema completo dos modelos.
```ts
const schema = Model.schema();
```

- Model.schema('user')

Retorna o schema de um modelo específico.
```ts
const userSchema = Model.schema('user');
```

- Model.make()

Retorna todos os modelos registrados.
```ts
const models = Model.make();
```

- Model.make('user')

Retorna um modelo específico.
```ts
const User = Model.make('user');
const user = new User({ name: 'Maria' });
```

- Model.boot(app)

Inicializa os modelos com base no container da aplicação.
```ts
Model.boot(App);
```

- Model.getRelationConstructors('user')

Retorna os construtores de relacionamento disponíveis para o modelo.
```ts
const relations = Model.getRelationConstructors('user');
```