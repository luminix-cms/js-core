## Log

Permite registrar mensagens em diferentes níveis de log. Só funciona se o modo debug estiver ativo.

Mensagens de debug.
```ts
Log.debug(...args)
```

Mensagens informativas.
```ts
Log.debug('Usuário logado:', user);

Log.info(...args)
```

Eventos normais mas significativos.
```ts
Log.info('Sessão iniciada');

Log.notice(...args)
```

Avisos importantes.
```ts
Log.notice('Aviso: limite de acesso quase atingido');

Log.warning(...args)
```

Erros esperados.
```ts
Log.warning('Token prestes a expirar');

Log.error(...args)
```

Erros críticos.
```ts
Log.error('Erro ao carregar dados do usuário');

Log.critical(...args)
```

Ações devem ser tomadas imediatamente.
```ts
Log.critical('Erro crítico no servidor');

Log.alert(...args)
```

Sistema indisponível.
```ts
Log.alert('Sistema em risco');

Log.emergency(...args)
```
```ts
Log.emergency('Falha fatal no sistema');
```