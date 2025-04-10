### Instalação
#### Usando npm
```bash
npm install @luminix/core
```

#### Ou com yarn
```bash
yarn add @luminix/core
```

### Requisitos
Este pacote assume um ambiente moderno baseado em módulos (ESM), como:

Node.js >= 18

TypeScript >= 5

Frameworks como Vite, Next.js, Astro...

### Scripts disponíveis

```bash
npm run build       # Compila o pacote como biblioteca
npm run test        # Executa os testes (Jest + JSDOM)
npm run lint        # Lint no projeto com ESLint
```

### Testes
O projeto utiliza jest com babel-jest e ts-jest, sendo compatível com bibliotecas como nanoevents e lodash-es.

```bash
testRegex: '/tests/.*\\.(test|spec)?\\.(ts|tsx)$',
transformIgnorePatterns: [
    'node_modules/(?!nanoevents|lodash-es)',
]
```