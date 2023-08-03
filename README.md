# Teste do desenvolvedor back-end (Node.js)

A desafio de desenvolvimento de API RESTful foi inspirado no https://github.com/Wiredcraft/test-backend

## Contexto

Criação de uma API RESTful em que seje possa realizar as requisições `get/create/update/delete` de dados armazenados em uma banco de dados. Nesta solução o banco de dados escolhido foi o PostgreSQL.

### Requisitos

- A API segue o padrão de design RESTful API.
- Os dados são salvos em banco de dados PostgreSQL.


### Modelo de Usuário

Os dados estão modelados dessa forma:
```
{
  "id": "xxx",                  // user ID 
  "name": "test",               // user name
  "dob": "",                    // date of birth
  "address": "",                // user address
  "description": "",            // user description
  "createdAt": ""               // user created date
}
```

### Funcionalidades

- Cadastro de Usuários
- Atualização de Usuários
- Listagem de um ou todos os Usuários	
- Exclução de Usuários


## Documentação da API

#### Retorna todos os usuários

```http
  GET /api/users
```

```
{
  "users":[
  {
    "id": "f3c931ca-0e5d-42c3-9e77-6325595e0592",                  
    "name": "test",               
    "dob": "1994-01-14T02:00:00.000Z",                    
    "address": "Casa do Deploy",                
    "description": "Uma API feita em Node JS",            
    "createdAt": "2023-07-27T02:02:33.640Z" 
  },
   {
    "id": "f3c931ca-0e5d-42c3-9e77-6325595e0592",                  
    "name": "test",               
    "dob": "1994-01-14T02:00:00.000Z",                    
    "address": "Casa do Deploy",                
    "description": "Uma API feita em Node JS",            
    "createdAt": "2023-07-27T02:02:33.640Z" 
  },
  ]
}
```

#### Retorna um usuário

```http
  GET /api/users/${id}
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id`      | `string` | **Obrigatório**. O ID do usuário que você quer |


```
{
  "user":
  {
    "id": "f3c931ca-0e5d-42c3-9e77-6325595e0592",                  
    "name": "test",               
    "dob": "1994-01-14T02:00:00.000Z",                    
    "address": "Casa do Deploy",                
    "description": "Uma API feita em Node JS",            
    "createdAt": "2023-07-27T02:02:33.640Z" 
  }
}
```
#### Cria um usuário


```http
  POST /api/users
```
```
{
  "name": "Fulano de Tal",               // user name
  "dob": "1994-10-12",                    // date of birth
  "address": "Casa do Fulano, 2",                // user address
  "description": "O fulano é um cara legal",            // user description 
}
```

#### Atualiza um usuário

```http
  PATCH /api/users/${id}
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id`      | `string` | **Obrigatório**. O ID do usuário que você quer |


#### Exclui um usuário
```http
  DELETE /api/users/${id}
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id`      | `string` | **Obrigatório**. O ID do usuário que você quer |




## Stack utilizada

**Back-end:** Node JS

**Frameworks:** Fastify e Prisma

**Languages:** JavaScript e TypeScript

