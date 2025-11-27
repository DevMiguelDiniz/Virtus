# 💰 Sistema de Moeda Estudantil Virtus

Sistema completo de gerenciamento de moedas virtuais para reconhecimento e recompensa de desempenho acadêmico.

---

## 🎯 Sobre o Projeto

O **Virtus** é uma plataforma que permite:
- 👨‍🏫 **Professores** transferirem moedas para alunos como reconhecimento
- 🎓 **Alunos** acumularem moedas e trocarem por vantagens
- 🏢 **Empresas** parceiras oferecerem vantagens e benefícios
- 👤 **Administradores** gerenciarem o sistema de moedas

---

## 🚀 Início Rápido com Docker

### Pré-requisitos
- Docker Desktop instalado
- Make instalado (opcional, mas recomendado)

### Opção 1: Com Makefile (Recomendado)

```bash
# Clone o repositório
cd H:\Virtus\Código

# Instale tudo automaticamente
make install

# Aguarde ~2 minutos e acesse:
# Frontend: http://localhost:3000
# Backend: http://localhost:8080
```

📘 **[Guia completo do Makefile](./MAKEFILE_GUIDE.md)** - Instalação e comandos

### Opção 2: Sem Makefile

```bash
# Clone o repositório
cd H:\Virtus\Código

# Suba todos os serviços
docker-compose up -d

# Aguarde ~2 minutos e acesse:
# Frontend: http://localhost:3000
# Backend: http://localhost:8080
```

📖 **[Documentação completa do Docker](./DOCKER_README.md)**

### Comandos Úteis

Com Make:
```bash
make help        # Ver todos os comandos
make up          # Subir containers
make down        # Parar containers
make logs        # Ver logs
make seed        # Criar usuários de teste
```

Sem Make:
```bash
docker-compose up -d      # Subir
docker-compose down       # Parar
docker-compose logs -f    # Ver logs
```

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────┐
│                   Frontend                       │
│              Next.js 15 + React 18               │
│         TypeScript + Tailwind CSS                │
│                 Port: 3000                       │
└──────────────────┬──────────────────────────────┘
                   │ HTTP/REST
┌──────────────────▼──────────────────────────────┐
│                   Backend                        │
│              Spring Boot 3.5.6                   │
│          Java 21 + Maven + JWT                   │
│                 Port: 8080                       │
└──────────────────┬──────────────────────────────┘
                   │ JDBC
┌──────────────────▼──────────────────────────────┐
│                  Database                        │
│              PostgreSQL 16                       │
│                 Port: 5432                       │
└──────────────────────────────────────────────────┘
```

---

## 👥 Tipos de Usuário

### 🎓 Aluno
- Visualizar saldo de moedas
- Consultar extrato de transações
- Trocar moedas por vantagens
- Visualizar histórico de resgates

### 👨‍🏫 Professor
- Transferir moedas para alunos
- Consultar extrato de transferências
- Visualizar saldo disponível
- Adicionar motivo nas transferências

### 🏢 Empresa
- Cadastrar vantagens
- Gerenciar vantagens oferecidas
- Visualizar resgates
- Validar códigos de resgate

### 👤 Admin
- Adicionar moedas a alunos
- Remover moedas de alunos
- Adicionar moedas a professores
- Remover moedas de professores
- Gerenciar sistema completo

---

## 🛠️ Tecnologias

### Backend
- **Java 21** - Linguagem
- **Spring Boot 3.5.6** - Framework
- **Spring Security** - Autenticação/Autorização
- **JWT** - Tokens de autenticação
- **Spring Data JPA** - ORM
- **PostgreSQL** - Banco de dados
- **Maven** - Gerenciador de dependências
- **Lombok** - Redução de boilerplate

### Frontend
- **Next.js 15** - Framework React
- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Radix UI** - Componentes acessíveis
- **Lucide React** - Ícones

### DevOps
- **Docker** - Containerização
- **Docker Compose** - Orquestração
- **Git** - Controle de versão

---

## 📁 Estrutura do Projeto

```
H:\Virtus\Código/
├── backend/
│   └── virtus/
│       ├── src/
│       │   └── main/
│       │       └── java/com/currencySystem/virtus/
│       │           ├── config/          # Configurações (Security, CORS)
│       │           ├── controller/      # REST Controllers
│       │           ├── dto/            # Data Transfer Objects
│       │           ├── model/          # Entidades JPA
│       │           ├── repository/     # Repositórios JPA
│       │           ├── security/       # JWT, Filters
│       │           └── service/        # Lógica de negócio
│       ├── Dockerfile
│       └── pom.xml
│
├── frontend/
│   ├── app/                    # Páginas Next.js
│   ├── components/             # Componentes React
│   │   ├── admin/             # Componentes do Admin
│   │   ├── dashboards/        # Dashboards por tipo
│   │   ├── headers/           # Cabeçalhos
│   │   ├── sections/          # Seções reutilizáveis
│   │   └── ui/                # Componentes base (Radix)
│   ├── shared/
│   │   ├── interfaces/        # Tipos TypeScript
│   │   └── services/          # Serviços de API
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml          # Orquestração Docker
├── .env.example               # Variáveis de ambiente
├── README.md                  # Este arquivo
├── DOCKER_README.md           # Documentação Docker
├── ADMIN_README.md            # Documentação Admin Backend
└── ADMIN_FRONTEND_README.md   # Documentação Admin Frontend
```

---

## 🔐 Autenticação e Segurança

### JWT (JSON Web Tokens)
- Tokens com validade de 24 horas
- Algoritmo HS256
- Armazenados no localStorage do navegador

### Roles e Permissões
```java
@PreAuthorize("hasRole('ALUNO')")    // Apenas alunos
@PreAuthorize("hasRole('PROFESSOR')") // Apenas professores
@PreAuthorize("hasRole('EMPRESA')")   // Apenas empresas
@PreAuthorize("hasRole('ADMIN')")     // Apenas admins
```

### Senhas
- Criptografadas com BCrypt
- Validação de força mínima (6 caracteres)

---

## 📡 API Endpoints

### Autenticação
```
POST /api/auth/login           # Login (público)
```

### Alunos
```
POST   /api/alunos/cadastro                    # Cadastrar (público)
GET    /api/alunos/{id}                        # Buscar perfil
GET    /api/alunos/{id}/saldo                  # Consultar saldo
GET    /api/alunos/{id}/extrato                # Consultar extrato
POST   /api/alunos/{id}/resgatar-vantagem      # Resgatar vantagem
GET    /api/alunos/{id}/resgates               # Listar resgates
```

### Professores
```
POST   /api/professores/cadastro               # Cadastrar (público)
GET    /api/professores/{id}                   # Buscar perfil
GET    /api/professores/{id}/saldo             # Consultar saldo
GET    /api/professores/{id}/extrato           # Consultar extrato
POST   /api/professores/{id}/enviar-moedas     # Transferir moedas
```

### Empresas
```
POST   /api/empresas/cadastro                  # Cadastrar (público)
GET    /api/empresas/{id}                      # Buscar perfil
POST   /api/empresas/{id}/vantagens            # Criar vantagem
GET    /api/empresas/{id}/vantagens            # Listar vantagens
GET    /api/empresas/{id}/resgates             # Listar resgates
POST   /api/empresas/{id}/validar-resgate      # Validar código
```


📖 **[Documentação completa da API Admin](./ADMIN_README.md)**

---

## 🎨 Interface do Usuário

### Design System
- **Cores primárias:** `#268c90` (verde-azulado), `#6ed3d8` (ciano)
- **Fonte:** System fonts
- **Componentes:** Radix UI (acessível por padrão)
- **Ícones:** Lucide React
- **Responsivo:** Mobile-first

### Páginas Principais
- `/login` - Página de login
- `/cadastro` - Cadastro de usuários
- `/home` - Dashboard (varia por tipo de usuário)
- `/perfil` - Perfil do usuário
- `/extrato` - Histórico de transações
- `/enviar-moedas` - Transferir moedas (professor)
- `/admin/gerenciar-alunos` - Gerenciar alunos (admin)
- `/admin/gerenciar-professores` - Gerenciar professores (admin)

---

## 💾 Banco de Dados

### Tabelas Principais
- `usuarios` - Tabela base (herança JOINED)
- `alunos` - Dados específicos de alunos
- `professores` - Dados específicos de professores
- `empresas` - Dados específicos de empresas
- `admins` - Dados específicos de admins
- `transacoes` - Transferências de moedas
- `vantagens` - Benefícios oferecidos
- `resgates_vantagens` - Histórico de resgates

### Diagrama ER (Simplificado)
```
┌──────────┐       ┌─────────────┐       ┌─────────┐
│ Usuario  │◄──────┤   Aluno     │──────►│Transacao│
│   (PK)   │       │   (FK)      │       │         │
└─────┬────┘       └─────────────┘       └────┬────┘
      │                                        │
      │            ┌─────────────┐             │
      └────────────┤  Professor  │─────────────┘
                   │   (FK)      │
                   └─────────────┘
```

---

## 🧪 Testando o Sistema

### 1. Criar usuários de teste

```bash
# Admin
curl -X POST http://localhost:8080/api/admins/cadastro \
  -H "Content-Type: application/json" \
  -d '{"login":"admin","senha":"admin123","nome":"Admin","email":"admin@virtus.com","cpf":"12345678900"}'

# Professor
curl -X POST http://localhost:8080/api/professores/cadastro \
  -H "Content-Type: application/json" \
  -d '{"login":"prof","senha":"prof123","nome":"Prof João","cpf":"11122233344","departamento":"TI"}'

# Aluno
curl -X POST http://localhost:8080/api/alunos/cadastro \
  -H "Content-Type: application/json" \
  -d '{"login":"aluno","senha":"aluno123","nome":"Maria Silva","email":"maria@email.com","cpf":"99988877766","rg":"123456","endereco":"Rua A, 123"}'
```

### 2. Fazer login e obter token

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login":"admin","senha":"admin123"}'
```

### 3. Usar o sistema

Acesse http://localhost:3000 e faça login com:
- **Admin:** admin / admin123
- **Professor:** prof / prof123
- **Aluno:** aluno / aluno123

---

## 🐛 Troubleshooting

### Backend não inicia
```bash
# Ver logs
make logs-backend
# ou
docker-compose logs backend

# Verificar status
make ps
```

### Frontend não carrega
```bash
# Reconstruir frontend
make build-frontend
docker-compose up -d frontend

# Verificar logs
make logs-frontend
```

### Erro de conexão com banco
```bash
# Verificar se PostgreSQL está rodando
make shell-db
# ou
docker exec -it virtus-postgres pg_isready -U postgres

# Ver logs do banco
make logs-db
```

### Testar tudo de uma vez
```bash
make test
```

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto é licenciado sob a licença MIT.

---

## 👨‍💻 Autores

- Sistema desenvolvido para gerenciamento acadêmico
- Implementação completa: Backend + Frontend + Docker

---

## 🎉 Status do Projeto

✅ **Projeto Completo e Funcional!**

- ✅ Backend Spring Boot funcionando
- ✅ Frontend Next.js funcionando
- ✅ Banco de dados PostgreSQL configurado
- ✅ Sistema de autenticação JWT
- ✅ CRUD completo para todos os tipos de usuário
- ✅ Sistema de transferência de moedas
- ✅ Sistema de resgate de vantagens
- ✅ Painel administrativo completo
- ✅ Dockerizado e pronto para deploy

**Pronto para produção! 🚀**
