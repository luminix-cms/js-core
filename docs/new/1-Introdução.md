## @luminix/core
Pacote principal do ecossistema Luminix. Fornece integrações, facades e ferramentas que facilitam o desenvolvimento de aplicações JavaScript modernas integradas a backends PHP — especialmente quando usado com o pacote @luminix/support.

Este pacote centraliza o acesso a helpers como autenticação, configuração, rotas, modelos, logs e manipulação de erros, além de fornecer um sistema de plugins e macros estensíveis.

### Introdução
@luminix/core é a espinha dorsal para aplicações que utilizam o ecossistema Luminix, fornecendo:

- Inicialização automática da aplicação;

- Facades inspiradas no Laravel (ex: App, Auth, Config, Log, Route);

- Integração com @luminix/support (Container, Macroable, Events...);

- Suporte a modelos de dados (como Model.save(), Model.all()...);

- Extensões de objetos (Obj.isModel(), macros na Application);

- Plugin system via contratos (Plugin).