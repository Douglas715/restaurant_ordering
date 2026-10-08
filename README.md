# 🍽️ Restaurant Ordering System – API REST

API REST para um **sistema de autoatendimento de restaurante**, desenvolvida na disciplina de Desenvolvimento Back-End (Engenharia de Software – Campus SJP).

## 1. Descrição do projeto

Em restaurantes com autoatendimento (totens, tablets ou QR Code nas mesas), o cliente consulta o cardápio e monta o próprio pedido sem depender de um atendente. Esta API é o **back-end** que sustenta esse fluxo: ela organiza o cardápio em **categorias** e **produtos**, persiste os dados em um banco PostgreSQL (Supabase) e os expõe via HTTP em formato JSON, para que qualquer front-end (totem, app ou site) possa consumi-los.

**Objetivo da API:** oferecer operações de cadastro, consulta, atualização e exclusão (CRUD) das entidades do restaurante, com validações básicas, tratamento de erros e persistência real no Supabase/PostgreSQL.

## 2. Identificação do estudante

**Nome completo:** `[PREENCHER – nome completo do estudante]`

## 3. Tecnologias utilizadas

| Tecnologia | Uso |
|---|---|
| **Node.js** (≥ 20.6) | Ambiente de execução |
| **TypeScript** | Linguagem do projeto |
| **Express 5** | Framework HTTP / rotas |
| **Supabase** (`@supabase/supabase-js`) | Plataforma de backend e cliente de acesso ao banco |
| **PostgreSQL** | Banco de dados relacional (hospedado no Supabase) |
| **tsx** | Execução de TypeScript em desenvolvimento |
| **Git / GitHub** | Versionamento de código |

## 4. Entidades e relacionamentos

### Category (categorias do cardápio)

| Atributo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | UUID | sim (gerado) | Chave primária |
| `name` | texto | **sim** | Nome da categoria |
| `description` | texto | não | Descrição |
| `icon` | texto | não | Ícone/emoji da categoria |
| `display_order` | inteiro | não | Ordem de exibição no cardápio |
| `active` | booleano | não | Se a categoria está ativa |

### Product (produtos do cardápio)

| Atributo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | UUID | sim (gerado) | Chave primária |
| `categoryId` | UUID | **sim** | Chave estrangeira → `categories.id` |
| `name` | texto | **sim** | Nome do produto |
| `description` | texto | não | Descrição |
| `price` | numérico | **sim** | Preço |
| `image` | texto | não | URL da imagem |
| `available` | booleano | não | Disponível no momento |
| `active` | booleano | não | Se o produto está ativo no cardápio |

### Relacionamento

```
categories (1) ────────< (N) products
   id (PK)                   categoryId (FK) → categories.id
```

Uma **categoria** possui vários **produtos**; cada **produto** pertence a exatamente uma categoria.

## 5. Estrutura do projeto

```
src/
├── config/        # Configuração do cliente Supabase (supabase.ts)
├── controller/    # Recebe a requisição HTTP, valida e devolve a resposta
├── model/         # Representação das entidades e acesso aos dados (Category, Product)
├── repositories/  # Acesso e persistência dos dados no Supabase
├── Routes/        # Definição dos endpoints de cada entidade
├── app.ts         # Criação do app Express, middlewares e registro das rotas
└── server.ts      # Inicialização do servidor (porta 3000)
```

**Fluxo de uma requisição:** `Route → Controller → Model/Repository → Supabase → resposta JSON`.

## 6. Configuração e execução

```bash
# 1. Clonar o repositório
git clone https://github.com/Douglas715/restaurant_ordering.git
cd restaurant_ordering

# 2. Instalar as dependências
npm install

# 3. Criar o arquivo de variáveis de ambiente
cp .env.example .env     # Windows (PowerShell): copy .env.example .env
# edite o .env com as credenciais do seu projeto Supabase

# 4. Criar as tabelas no Supabase (veja a seção 8)

# 5. Iniciar em modo de desenvolvimento (com reload automático)
npm run dev
```

O servidor sobe em **http://localhost:3000**.

| Script | Comando | Função |
|---|---|---|
| `npm run dev` | `node --watch --env-file=.env --import=tsx/esm src/server.ts` | Desenvolvimento |
| `npm run build` | `tsc` | Compila para `dist/` |
| `npm start` | `node dist/server.js` | Executa a versão compilada |

## 7. Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `SUPABASE_URL` | URL do projeto no Supabase (*Project Settings → API*) |
| `SUPABASE_SECRET_KEY` | Chave secreta do projeto (uso exclusivo no servidor) |

O repositório inclui o arquivo **`.env.example`** apenas com os nomes das variáveis e valores de exemplo. O arquivo **`.env`** (credenciais reais) está listado no `.gitignore` e **não deve ser enviado ao Git**.

## 8. Banco de dados

Execute o script abaixo no **SQL Editor** do Supabase para criar a estrutura:

```sql
create extension if not exists "pgcrypto";

create table categories (
    id            uuid primary key default gen_random_uuid(),
    name          text not null,
    description   text,
    icon          text,
    display_order integer default 0,
    active        boolean not null default true
);

create table products (
    id            uuid primary key default gen_random_uuid(),
    "categoryId"  uuid not null references categories (id) on delete restrict,
    name          text not null,
    description   text,
    price         numeric(10,2) not null check (price >= 0),
    image         text,
    available     boolean not null default true,
    active        boolean not null default true
);

create index idx_products_category on products ("categoryId");
```

| Tabela | Chave primária | Chave estrangeira |
|---|---|---|
| `categories` | `id` (UUID) | — |
| `products` | `id` (UUID) | `categoryId` → `categories.id` |

> Com `on delete restrict`, não é possível excluir uma categoria que ainda possua produtos, preservando a integridade dos dados.

## 9. Documentação dos endpoints

### Geral

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/` | Informações básicas da API |

### Categorias

| Método | Endpoint | Descrição | Corpo (JSON) |
|---|---|---|---|
| GET | `/categories` | Lista todas as categorias | — |
| GET | `/categories/:id` | Consulta uma categoria pelo ID | — |
| GET | `/categories/search/:keyword` | Pesquisa por palavra-chave (nome ou descrição) | — |
| POST | `/categories` | Cadastra uma categoria | `name` (obrigatório), `description`, `icon`, `display_order`, `active` |
| PUT | `/categories/:id` | Atualiza uma categoria | `name` (obrigatório), demais campos opcionais |
| DELETE | `/categories/:id` | Remove uma categoria | — |

### Produtos

| Método | Endpoint | Descrição | Corpo (JSON) |
|---|---|---|---|
| GET | `/products` | Lista todos os produtos | — |
| GET | `/products/:id` | Consulta um produto pelo ID | — |
| GET | `/products/search/:keyword` | Pesquisa por palavra-chave | — |
| POST | `/products` | Cadastra um produto | `categoryId`, `name`, `price` (obrigatórios), `description`, `image`, `available`, `active` |
| PUT | `/products/:id` | Atualiza um produto | mesmos campos do POST |
| DELETE | `/products/:id` | Remove um produto | — |

### Códigos de resposta HTTP

| Código | Quando ocorre |
|---|---|
| `200 OK` | Consulta, atualização ou exclusão realizada com sucesso |
| `201 Created` | Registro criado com sucesso |
| `400 Bad Request` | Dados obrigatórios ausentes ou inválidos |
| `404 Not Found` | Registro não encontrado |
| `500 Internal Server Error` | Erro inesperado no servidor ou no banco |

## 10. Exemplos de requisições

### Criar categoria — `POST /categories`

```json
{
  "name": "Pizzas",
  "description": "Pizzas tradicionais e especiais",
  "icon": "🍕",
  "display_order": 1,
  "active": true
}
```

### Atualizar categoria — `PUT /categories/:id`

```json
{
  "name": "Pizzas Premium",
  "description": "Pizzas especiais da casa",
  "icon": "🍕",
  "display_order": 2,
  "active": true
}
```

### Criar produto — `POST /products`

```json
{
  "categoryId": "UUID-DA-CATEGORIA",
  "name": "Pizza Margherita",
  "description": "Molho de tomate, mussarela e manjericão",
  "price": 42.9,
  "image": "https://exemplo.com/margherita.jpg",
  "available": true,
  "active": true
}
```

### Atualizar produto — `PUT /products/:id`

```json
{
  "categoryId": "UUID-DA-CATEGORIA",
  "name": "Pizza Margherita Grande",
  "description": "Molho de tomate, mussarela de búfala e manjericão",
  "price": 54.9,
  "image": "https://exemplo.com/margherita.jpg",
  "available": true,
  "active": true
}
```

### Exemplo de resposta de erro

```json
{ "message": "O nome da categoria é obrigatório." }
```

### Exemplo com cURL

```bash
curl -X POST http://localhost:3000/categories \
  -H "Content-Type: application/json" \
  -d '{"name":"Bebidas","description":"Refrigerantes e sucos","display_order":2}'

curl http://localhost:3000/categories/search/beb
```

## 11. Versionamento

O projeto é versionado com Git e o histórico de commits das aulas foi preservado (uma branch/commit por etapa: configuração inicial, rotas HTTP, endpoints com JSON e `randomUUID`, CRUD, conexão com Supabase e controllers/rotas).

Repositório: <https://github.com/Douglas715/restaurant_ordering>
