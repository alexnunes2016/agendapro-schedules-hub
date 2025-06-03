# Express API Starter with Typescript

How to use this template:

```sh
npx create-express-api --typescript --directory my-api-name
```

Includes API Server utilities:

* [morgan](https://www.npmjs.com/package/morgan)
  * HTTP request logger middleware for node.js
* [helmet](https://www.npmjs.com/package/helmet)
  * Helmet helps you secure your Express apps by setting various HTTP headers. It's not a silver bullet, but it can help!
* [dotenv](https://www.npmjs.com/package/dotenv)
  * Dotenv is a zero-dependency module that loads environment variables from a `.env` file into `process.env`
* [cors](https://www.npmjs.com/package/cors)
  * CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.

Development utilities:

* [typescript](https://www.npmjs.com/package/typescript)
  * TypeScript is a language for application-scale JavaScript.
* [ts-node](https://www.npmjs.com/package/ts-node)
  * TypeScript execution and REPL for node.js, with source map and native ESM support.
* [nodemon](https://www.npmjs.com/package/nodemon)
  * nodemon is a tool that helps develop node.js based applications by automatically restarting the node application when file changes in the directory are detected.
* [eslint](https://www.npmjs.com/package/eslint)
  * ESLint is a tool for identifying and reporting on patterns found in ECMAScript/JavaScript code.
* [typescript-eslint](https://typescript-eslint.io/)
  * Tooling which enables ESLint to support TypeScript.
* [jest](https://www.npmjs.com/package/jest)
  * Jest is a delightful JavaScript Testing Framework with a focus on simplicity.
* [supertest](https://www.npmjs.com/package/supertest)
  * HTTP assertions made easy via superagent.

## Setup

```
npm install
```

## Lint

```
npm run lint
```

## Test

```
npm run test
```

## Development

```
npm run dev
```

# Backend Admin - AgendoPro

## Descrição
API RESTful para administração do sistema AgendoPro, com autenticação JWT (Supabase), controle de permissões, relatórios e gestão de usuários, organizações, papéis e permissões.

## Instalação

```bash
npm install
```

## Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
SUPABASE_URL=URL_DO_SUPABASE
SUPABASE_SERVICE_ROLE_KEY=CHAVE_SERVICE_ROLE_DO_SUPABASE
SUPABASE_JWT_SECRET=SEGREDO_JWT_DO_SUPABASE
```

## Execução

```bash
npm run dev
```

## Endpoints Principais

- `GET /users` - Lista usuários (protegido)
- `GET /organizations` - Lista organizações (protegido)
- `GET /roles` - Lista papéis (protegido)
- `GET /permissions` - Lista permissões (protegido)
- `GET /admin/statistics` - Estatísticas administrativas (protegido)

## Exemplo de Requisição Autenticada

```bash
curl -H "Authorization: Bearer SEU_TOKEN_JWT" http://localhost:3000/users
```

## Protegendo rotas por permissão

Exemplo:
```ts
import { permissionMiddleware } from './middlewares/permissionMiddleware';

router.get('/rota-secreta', authMiddleware, permissionMiddleware('users.manage'), (req, res) => {
  res.json({ message: 'Acesso permitido apenas para quem tem a permissão users.manage!' });
});
```

## Estrutura de Pastas

- `src/controllers` - Lógica dos endpoints
- `src/routes` - Definição das rotas
- `src/services` - Integração com Supabase
- `src/middlewares` - Autenticação e autorização

## Observações
- Todas as rotas são protegidas por autenticação JWT do Supabase.
- Use o token JWT gerado pelo Supabase Auth para autenticar as requisições.
- Para permissões avançadas, utilize o middleware `permissionMiddleware`.

---

Dúvidas? Abra uma issue ou entre em contato com o time de desenvolvimento.
