## App
A facade App é a porta de entrada para o container de serviços da aplicação. Ela permite acessar configurações, ambiente, e plugins registrados.

Retorna o ambiente atual ou verifica se está incluído entre os ambientes informados.
```ts
App.environment(...environments: string[]): string | boolean
```

Retorna o idioma/localidade atual da aplicação.
```ts
App.environment(); // 'local'

App.environment('production', 'staging'); // false se estiver em ambiente 'local'
App.getLocale(): string
```

Verifica se o modo debug está habilitado.

```ts
App.getLocale(); // Ex: 'pt-BR'
App.hasDebugModeEnabled(): boolean
```

Verifica se a aplicação está rodando em ambiente local.
```ts
if (App.hasDebugModeEnabled()) {
  console.log('Debug ON');
}
App.isLocal(): boolean
```

Verifica se está rodando em ambiente de produção.
```ts
if (App.isLocal()) {
  console.log('Ambiente local');
}
App.isProduction(): boolean
```

```ts
if (App.isProduction()) {
  console.warn('⚠️ Atenção: ambiente de produção!');
}
```