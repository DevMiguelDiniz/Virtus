# Sistema de Moedas Estudantil - Virtus

Sistema de gerenciamento de moedas virtuais para instituições de ensino, com Spring Boot, Spring Security e autenticação JWT.

## Tecnologias Utilizadas

- **Java 21**
- **Spring Boot 3.5.6**
- **Spring Security** - Autenticação e autorização
- **JWT (JSON Web Token)** - Autenticação stateless
- **Spring Data JPA** - Persistência de dados
- **PostgreSQL** - Banco de dados
- **Lombok** - Redução de boilerplate
- **Maven** - Gerenciamento de dependências

## Funcionalidades Principais

### Autenticação e Autorização
- Autenticação JWT
- Controle de acesso baseado em roles (ALUNO, PROFESSOR)
- Proteção de endpoints com Spring Security

### Alunos
- Cadastro e autenticação
- Consulta de saldo de moedas
- Consulta de extrato de transações
- Resgate de vantagens usando moedas
- Visualização de resgates realizados

### Professores
- Cadastro e autenticação
- Consulta de saldo de moedas (1000 moedas por semestre)
- Envio de moedas para alunos com motivo
- Consulta de extrato de transferências
- Crédito de moedas semestrais

### Vantagens
- Listagem de vantagens disponíveis
- Filtro por empresa
- Resgate por alunos

## Estrutura do Projeto

```
src/main/java/com/currencySystem/virtus/
├── config/              # Configurações (Security)
├── controller/          # Controllers REST
├── dto/                 # Data Transfer Objects
├── exception/           # Tratamento de exceções
├── model/              # Entidades JPA
├── repository/         # Repositories
├── security/           # JWT Service e Filtros
└── service/            # Lógica de negócio
```

## Modelo de Dados

### Hierarquia de Usuários
- **Usuario (abstrata)**: Classe base para Aluno e Professor
- **Aluno**: Estudante que recebe e gasta moedas
- **Professor**: Docente que distribui moedas aos alunos

### Entidades Principais
- **Transacao**: Registro de transferências entre professor e aluno
- **Vantagem**: Benefícios que podem ser resgatados com moedas
- **ResgateVantagem**: Registro de resgates de vantagens
- **Empresa**: Empresas parceiras que oferecem vantagens

## Configuração

### Banco de Dados

1. Crie um banco de dados PostgreSQL:
```sql
CREATE DATABASE virtus_db;
```

2. Configure as credenciais em `application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/virtus_db
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
```

### JWT Secret

O `jwt.secret` no `application.properties` deve ser uma string Base64. Você pode gerar uma nova:
```bash
openssl rand -base64 64
```

## Executando o Projeto

```bash
# Compilar
mvn clean install

# Executar
mvn spring-boot:run
```

A aplicação estará disponível em: `http://localhost:8080`

## API Endpoints

### Autenticação
```http
POST /api/auth/login
Content-Type: application/json

{
  "login": "usuario",
  "senha": "senha123"
}
```

### Alunos

#### Cadastro
```http
POST /api/alunos/cadastro
Content-Type: application/json

{
  "login": "aluno1",
  "senha": "senha123",
  "nome": "João Silva",
  "email": "joao@email.com",
  "cpf": "12345678901",
  "rg": "123456789",
  "endereco": "Rua Exemplo, 123"
}
```

#### Consultar Saldo
```http
GET /api/alunos/{id}/saldo
Authorization: Bearer {token}
```

#### Consultar Extrato
```http
GET /api/alunos/{id}/extrato
Authorization: Bearer {token}
```

#### Resgatar Vantagem
```http
POST /api/alunos/{id}/resgatar-vantagem
Authorization: Bearer {token}
Content-Type: application/json

{
  "vantagemId": 1
}
```

### Professores

#### Cadastro
```http
POST /api/professores/cadastro
Content-Type: application/json

{
  "login": "prof1",
  "senha": "senha123",
  "nome": "Maria Santos",
  "cpf": "98765432100",
  "departamento": "Ciência da Computação"
}
```

#### Enviar Moedas para Aluno
```http
POST /api/professores/{id}/enviar-moedas
Authorization: Bearer {token}
Content-Type: application/json

{
  "alunoId": 1,
  "valor": 50,
  "motivo": "Participação em projeto de pesquisa"
}
```

#### Consultar Extrato
```http
GET /api/professores/{id}/extrato
Authorization: Bearer {token}
```

#### Consultar Saldo
```http
GET /api/professores/{id}/saldo
Authorization: Bearer {token}
```

### Vantagens

#### Listar Todas
```http
GET /api/vantagens
Authorization: Bearer {token}
```

#### Listar Ativas
```http
GET /api/vantagens/ativas
Authorization: Bearer {token}
```

## Segurança

### Roles e Permissões

- **ROLE_ALUNO**:
  - Acesso aos endpoints `/api/alunos/**`
  - Pode visualizar apenas seus próprios dados
  - Pode resgatar vantagens

- **ROLE_PROFESSOR**:
  - Acesso aos endpoints `/api/professores/**`
  - Pode visualizar apenas seus próprios dados
  - Pode enviar moedas para alunos

- **Autenticado**:
  - Acesso aos endpoints `/api/vantagens/**`

### Headers de Autenticação

Após o login, use o token JWT no header:
```
Authorization: Bearer {seu_token_jwt}
```

## Validações e Regras de Negócio

1. **Professor**:
   - Recebe 1000 moedas por semestre
   - Só pode enviar moedas se tiver saldo suficiente
   - Não pode enviar valores negativos ou zero

2. **Aluno**:
   - Começa com 0 moedas
   - Só pode resgatar vantagens se tiver saldo suficiente
   - Recebe notificação por email ao receber moedas

3. **Vantagens**:
   - Só podem ser resgatadas se estiverem ativas
   - Custo em moedas é fixo

## Tratamento de Erros

A API retorna erros padronizados:

```json
{
  "status": 400,
  "message": "Mensagem de erro",
  "timestamp": "2025-10-15T10:30:00"
}
```

Códigos de status HTTP:
- `200 OK` - Sucesso
- `201 Created` - Recurso criado
- `400 Bad Request` - Erro de validação
- `401 Unauthorized` - Não autenticado
- `403 Forbidden` - Sem permissão
- `404 Not Found` - Recurso não encontrado
- `409 Conflict` - Conflito de estado
- `500 Internal Server Error` - Erro do servidor

## Desenvolvimento

### Compilar sem executar testes
```bash
mvn clean install -DskipTests
```

### Executar apenas os testes
```bash
mvn test
```

## Próximos Passos

- [ ] Implementar testes unitários e de integração
- [ ] Adicionar paginação nas listagens
- [ ] Implementar sistema de notificações por email
- [ ] Adicionar dashboard administrativo
- [ ] Implementar sistema de relatórios
- [ ] Adicionar documentação Swagger/OpenAPI

## Licença

Este projeto foi desenvolvido para fins educacionais.
