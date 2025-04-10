## Config
A facade Config oferece uma estrutura de PropertyBag para acessar e modificar configurações da aplicação em tempo de execução.

Obtém o valor de uma configuração.
```ts
Config.get(path: string, defaultValue?)
```

Define um valor em determinada chave.
```ts
const appName = Config.get('app.name', 'Aplicação Padrão');
Config.set(path: string, value: any)
```

Verifica se a configuração existe.
```ts
Config.set('app.debug', true);
Config.has(path: string): boolean
```

Remove uma configuração.
```ts
if (Config.has('auth.user')) {
  console.log('Usuário está configurado');
}
Config.delete(path: string)
```

Retorna todas as configurações registradas.
```ts
Config.delete('manifest.models');
Config.all(): AppConfiguration
```

Verifica se não há nenhuma configuração registrada.
```ts
console.log(Config.all());
Config.isEmpty(): boolean
```

```ts
if (Config.isEmpty()) {
  console.warn('Configuração vazia');
}
```