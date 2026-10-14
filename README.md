<div align="center">

# E-commerce API

API REST para gerenciamento de usuários, categorias, produtos e pedidos, desenvolvida como projeto de estudo e portfólio em backend.

[![NestJS](https://img.shields.io/badge/NestJS-12-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Fastify](https://img.shields.io/badge/Fastify-5-000000?style=for-the-badge&logo=fastify&logoColor=white)](https://fastify.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Zod](https://img.shields.io/badge/Zod-4-3E67B1?style=for-the-badge&logo=zod&logoColor=white)](https://zod.dev/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![pnpm](https://img.shields.io/badge/pnpm-11-F69220?style=for-the-badge&logo=pnpm&logoColor=white)](https://pnpm.io/)

</div>

## Sobre o projeto

Este projeto foi desenvolvido durante a formação em Engenharia de Software para praticar fundamentos de desenvolvimento backend, organização de código, validação de dados e persistência relacional.

A API implementa um fluxo básico de e-commerce, com gerenciamento de usuários, categorias, produtos, estoque e pedidos. O foco está em aplicar os conceitos estudados em um projeto funcional, evoluindo sua estrutura à medida que novos desafios aparecem.

> **Atenção:** o projeto não possui autenticação nem autorização. Não exponha suas rotas publicamente nem utilize dados reais sem implementar essas proteções.

## Funcionalidades

- CRUD de usuários, categorias e produtos.
- Hash de senhas com Argon2, sem expor os hashes nas respostas de usuário.
- Filtro de produtos por categoria e parte do nome.
- Criação e consulta de pedidos, com filtro opcional por usuário.
- Cálculo do total no servidor e registro do preço unitário no momento da compra.
- Baixa de estoque na criação do pedido e reposição no cancelamento.
- Validação de payloads e variáveis de ambiente com Zod.
- Tratamento global de exceções e documentação interativa da API.

## Tecnologias

| Tecnologia                                                                    | Uso                                   |
| ----------------------------------------------------------------------------- | ------------------------------------- |
| [NestJS](https://nestjs.com/) e [TypeScript](https://www.typescriptlang.org/) | Estrutura da aplicação e linguagem    |
| [Fastify](https://fastify.dev/)                                               | Adaptador HTTP                        |
| [Prisma](https://www.prisma.io/)                                              | Acesso ao banco de dados e migrations |
| [PostgreSQL](https://www.postgresql.org/)                                     | Banco de dados relacional             |
| [Zod](https://zod.dev/)                                                       | Validação de dados e configuração     |
| [OpenAPI](https://www.openapis.org/) e [Scalar](https://scalar.com/)          | Documentação interativa               |
| [Argon2](https://github.com/ranisr/argon2)                                    | Hash de senhas                        |
| [Docker Compose](https://docs.docker.com/compose/)                            | Banco de dados local                  |
| [pnpm](https://pnpm.io/)                                                      | Gerenciamento de pacotes              |

## Arquitetura

O código é organizado por módulos de domínio (`users`, `categories`, `products` e `orders`) e utiliza o padrão Repository para separar os serviços da implementação de persistência.

```text
Controller → Service → Abstract Repository → Prisma Repository → PrismaService → PostgreSQL
```

Os contratos abstratos são usados na injeção de dependências do NestJS, enquanto os repositórios concretos cuidam do acesso ao banco. Nas operações de pedidos, as transações ajudam a manter os dados do pedido e do estoque consistentes.

## Como executar localmente

### Requisitos

- Node.js `24 LTS`.
- pnpm.
- Docker e Docker Compose.

### 1. Instale as dependências

```bash
pnpm install
```

### 2. Configure as variáveis de ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Configure o `.env` com os valores do ambiente local. Para o banco criado pelo Docker Compose, use uma URL semelhante a:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:SUA_SENHA@localhost:5432/ecommerce?schema=public
```

Confira se a `DATABASE_URL` no seu `.env` é válida antes de iniciar a aplicação.

### 3. Inicie o banco de dados

```bash
pnpm db:up
```

### 4. Gere o Prisma Client e aplique as migrations

```bash
pnpm prisma:generate
pnpm prisma:migrate
```

### 5. Inicie a API

```bash
pnpm start:dev
```

A API ficará disponível em `http://localhost:3000`. A documentação interativa estará em `http://localhost:3000/docs`.

## Endpoints

Todas as rotas são relativas a `http://localhost:3000`. Os parâmetros `:id` e os identificadores enviados no corpo devem ser UUIDs válidos.

| Método   | Rota                 | Sucesso          | Descrição                                    |
| -------- | -------------------- | ---------------- | -------------------------------------------- |
| `POST`   | `/users`             | `201 Created`    | Cadastra um usuário                          |
| `GET`    | `/users`             | `200 OK`         | Lista usuários                               |
| `GET`    | `/users/:id`         | `200 OK`         | Busca um usuário                             |
| `PUT`    | `/users/:id`         | `200 OK`         | Atualiza um usuário                          |
| `DELETE` | `/users/:id`         | `200 OK`         | Remove um usuário                            |
| `POST`   | `/categories`        | `201 Created`    | Cadastra uma categoria                       |
| `GET`    | `/categories`        | `200 OK`         | Lista categorias                             |
| `GET`    | `/categories/:id`    | `200 OK`         | Busca uma categoria                          |
| `PATCH`  | `/categories/:id`    | `200 OK`         | Atualiza uma categoria                       |
| `DELETE` | `/categories/:id`    | `204 No Content` | Remove uma categoria                         |
| `POST`   | `/products`          | `201 Created`    | Cadastra um produto                          |
| `GET`    | `/products`          | `200 OK`         | Lista produtos                               |
| `GET`    | `/products/:id`      | `200 OK`         | Busca um produto                             |
| `PATCH`  | `/products/:id`      | `200 OK`         | Atualiza um produto                          |
| `DELETE` | `/products/:id`      | `204 No Content` | Remove um produto                            |
| `POST`   | `/orders`            | `201 Created`    | Cria um pedido e baixa o estoque             |
| `GET`    | `/orders`            | `200 OK`         | Lista pedidos                                |
| `GET`    | `/orders/:id`        | `200 OK`         | Busca um pedido com seus itens               |
| `PATCH`  | `/orders/:id/cancel` | `200 OK`         | Cancela um pedido pendente e repõe o estoque |

### Parâmetros de consulta

| Rota            | Parâmetro    | Descrição                                                   |
| --------------- | ------------ | ----------------------------------------------------------- |
| `GET /products` | `categoryId` | Filtra pelo UUID da categoria                               |
| `GET /products` | `search`     | Busca parte do nome sem diferenciar maiúsculas e minúsculas |
| `GET /orders`   | `userId`     | Filtra pedidos pelo UUID do usuário                         |

### Exemplo: criar um pedido

O usuário e os produtos devem existir previamente. Envie os produtos e suas quantidades; o total e o preço unitário são calculados pela API.

```bash
curl -X POST http://localhost:3000/orders \
  -H 'Content-Type: application/json' \
  -d '{
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "items": [
      {
        "productId": "6ba7b810-9dad-41d1-80b4-00c04fd430c8",
        "quantity": 2
      }
    ]
  }'
```

A API calcula o total a partir dos preços dos produtos e registra o preço unitário aplicado no momento da compra. Não inclua `total` ou `unitPrice` na requisição.

## Scripts úteis

| Comando                       | Descrição                               |
| ----------------------------- | --------------------------------------- |
| `pnpm start:dev`              | Inicia a API em modo de desenvolvimento |
| `pnpm build`                  | Compila a aplicação                     |
| `pnpm typecheck`              | Verifica os tipos TypeScript            |
| `pnpm db:up` / `pnpm db:down` | Inicia ou para o PostgreSQL local       |
| `pnpm prisma:generate`        | Gera o Prisma Client                    |
| `pnpm prisma:migrate`         | Executa migrations em desenvolvimento   |
| `pnpm prisma:studio`          | Abre o Prisma Studio                    |

Outros comandos disponíveis estão definidos no `package.json`.

## Limitações atuais

- Não há autenticação nem autorização.
- As listagens não possuem paginação.
- O projeto ainda não possui testes automatizados.

## Uso de ferramentas de IA

GitHub Copilot e Claude foram utilizados como apoio durante o desenvolvimento, para explorar soluções, auxiliar em tarefas repetitivas e revisar implementações. As decisões e a validação do comportamento da aplicação fazem parte do processo de desenvolvimento do projeto.
