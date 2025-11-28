<div align="center">
  <img src="Documentação/Imagens/logo-virtus.png" alt="Virtus Logo" height="200"/>
</div>

## 📋 Descrição
Sistema de moeda estudantil desenvolvido no Laboratório de Desenvolvimento de Software, que permite a gestão de moedas de bonificação virtuais entre alunos e professores em ambiente acadêmico.

Virtus implementa um sistema de economia interna para instituições de ensino, onde professores podem distribuir moedas virtuais aos alunos como recompensa por participação, desempenho acadêmico e outras atividades. Os alunos podem acumular e trocar essas moedas por benefícios e vantagens oferecidas pela instituição ou empresas parceiras. 

## 📚 Documentação

### Diagrama de Casos de Uso
![Diagrama de Casos de Uso](Documentação/Diagramas/Diagrama%20de%20Casos%20de%20Uso.jpeg)

### Diagrama de Classes
![Diagrama de Classes](Documentação/Diagramas/Diagrama%20de%20Classes.png)

### Diagrama de Componentes
![Diagrama de Componentes](Documentação/Diagramas/Diagrama%20de%20Componentes.png)

### Diagrama de Entidade e Relacionamento
![Diagrama de Entidade e Relacionamento](Documentação/Diagramas/Diagrama%20de%20Entidade%20e%20Relacionamento.jpeg)

### Diagrama do Modelo Relacional
![Diagrama do Modelo Relacional](Documentação/Diagramas/Diagrama%20do%20Modelo%20Relacional.png)

### Diagramas de Sequência
![Diagrama de Sequência 1](Documentação/Diagramas/Diagrama%20de%20Sequência%201.jpeg)

![Diagrama de Sequência 2](Documentação/Diagramas/Diagrama%20de%20Sequência%202.jpeg)


### Histórias de Usuário
 [`Histórias de Usuário.pdf`](Documentação/Diagramas/Histórias%20de%20Usuário.pdf)

### Script do Banco de Dados PostgreSQL
[`script-postgresql.pdf`](Documentação/Scripts/script-postgresql.sql)

### Apresentação do Projeto - Primeira Versão
[`Apresentação Virtus.pdf`](Documentação/Apresentações/Apresentação%20Virtus.pdf)


## 🏗️ Arquitetura do Sistema

O **Virtus** foi desenvolvido com base na arquitetura **MVC (Model-View-Controller)**, que separa claramente as responsabilidades da aplicação, garantindo melhor organização, escalabilidade e manutenção do código.

- **Model (Modelo):** Responsável pela lógica de negócio, regras e comunicação com o banco de dados.  
- **View (Visão):** Camada de interface que exibe as informações ao usuário de forma amigável.  
- **Controller (Controlador):** Atua como intermediário entre a View e o Model, processando requisições e controlando o fluxo da aplicação.  

Além disso, adotamos o uso de **DTOs (Data Transfer Objects)** para otimizar a transferência de dados entre as camadas da aplicação. Essa prática aumenta a segurança, evitando a exposição desnecessária de entidades, e melhora a performance na comunicação entre back-end e front-end.

No front-end, foi utilizado o **App Router do Next.js**, que permite uma estrutura de rotas moderna e eficiente, com renderização híbrida (SSR e SSG), facilitando a criação de páginas dinâmicas e otimizadas para SEO.

---

## 🧩 Tecnologias Utilizadas

| Logo                                                                           | Tecnologia | Descrição |
|--------------------------------------------------------------------------------|-------------|-----------|
| <img src="Documentação/Imagens/spring.png" alt="Spring Boot" height="40"/>     | **Spring Boot** | Framework Java utilizado no back-end, responsável pela API REST, autenticação e integração com o banco de dados. |
| <img src="Documentação/Imagens/nextjs.png" alt="Next.js" height="40"/>         | **Next.js** | Framework React moderno usado no front-end, oferecendo renderização híbrida e excelente experiência do usuário. |
| <img src="Documentação/Imagens/postgreesql.png" alt="PostgreSQL" height="40"/> | **PostgreSQL** | Banco de dados relacional usado para armazenar e gerenciar as informações de alunos, professores e moedas. |



## 🚀 Como Rodar o Sistema

### Pré-requisitos

Antes de começar, certifique-se de ter instalado:
- **Java 17+** - [Download](https://www.oracle.com/java/technologies/downloads/#java17)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **PostgreSQL 12+** - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)

### 1️⃣ Clonar o Repositório

```bash
git clone <URL-DO-REPOSITORIO>
cd Virtus
```

### 2️⃣ Configurar o Banco de Dados PostgreSQL

#### Criar o banco de dados:
```bash
psql -U postgres
```

```sql
CREATE DATABASE student_currency;
CREATE USER virtus WITH PASSWORD 'sua_senha';
GRANT ALL PRIVILEGES ON DATABASE student_currency TO virtus;
\q
```

#### Importar o script do banco (opcional):
Se você quiser usar o script fornecido:
```bash
psql -U virtus -d student_currency -f Documentação/Scripts/script-postgresql.sql
```

### 3️⃣ Configurar as Variáveis de Ambiente (Backend)

Na raiz do projeto, crie um arquivo `.env`:

```env
# Banco de Dados
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/student_currency
SPRING_DATASOURCE_USERNAME=virtus
SPRING_DATASOURCE_PASSWORD=sua_senha
SPRING_DATASOURCE_DRIVER_CLASS_NAME=org.postgresql.Driver

# JPA/Hibernate
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_JPA_SHOW_SQL=false
SPRING_JPA_FORMAT_SQL=true

# JWT
JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRATION=86400000

# Server
SERVER_PORT=8080

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:4200

# Logging
LOGGING_LEVEL_APP=INFO
LOGGING_LEVEL_SECURITY=INFO

# Aplicação
APP_BASE_URL=http://localhost:3000
```

### 4️⃣ Executar o Backend (Spring Boot)

```bash
cd codigo/backend/virtus
mvn clean install
mvn spring-boot:run
```

O backend estará disponível em: **http://localhost:8080**

⚠️ **Nota:** O sistema criará automaticamente 12 instituições de ensino (6 de São Paulo e 6 de Belo Horizonte) na primeira execução.

### 5️⃣ Executar o Frontend (Next.js)

Em outro terminal:

```bash
cd codigo/frontend
npm install
npm run dev
```

O frontend estará disponível em: **http://localhost:3000**

### 6️⃣ Acessar a Aplicação

1. Abra o navegador e acesse: **http://localhost:3000**
2. Faça login ou crie uma nova conta
3. O sistema estará pronto para uso!

---

## 📋 Estrutura do Projeto

```
Virtus/
├── codigo/
│   ├── backend/
│   │   └── virtus/           # API REST Spring Boot
│   │       ├── src/
│   │       │   ├── main/java/com/currencySystem/virtus/
│   │       │   │   ├── controller/     # Controladores REST
│   │       │   │   ├── service/        # Lógica de negócio
│   │       │   │   ├── model/          # Entidades JPA
│   │       │   │   ├── repository/     # Acesso a dados
│   │       │   │   ├── config/         # Configurações
│   │       │   │   └── security/       # Autenticação JWT
│   │       │   └── resources/
│   │       │       └── application.properties
│   │       └── pom.xml
│   └── frontend/             # Aplicação Next.js
│       ├── src/
│       │   ├── app/          # Rotas e layouts
│       │   ├── components/   # Componentes React
│       │   └── styles/       # Estilos CSS
│       ├── package.json
│       └── next.config.js
├── Documentação/
│   ├── Diagramas/            # UML, ER, etc
│   ├── Scripts/              # SQL scripts
│   └── Apresentações/        # Slides do projeto
└── README.md
```

---

## 🔐 Segurança

- **Autenticação JWT** - Tokens seguros para autenticação
- **Senhas Criptografadas** - Usando bcrypt
- **CORS Configurado** - Apenas domínios autorizados
- **Variáveis de Ambiente** - Dados sensíveis não ficam no código

---

## 🐛 Troubleshooting

### Erro: "Connection refused" ao conectar com PostgreSQL
- Verifique se o PostgreSQL está rodando: `psql -U postgres`
- Confirme as credenciais no `.env`

### Erro: "Port 8080 already in use"
- Mude a porta no `.env`: `SERVER_PORT=8081`

### Erro: "Module not found" no frontend
- Limpe a cache do npm: `npm cache clean --force`
- Reinstale as dependências: `npm install`

### Erro ao compilar o Backend
- Verifique se o Java 17+ está instalado: `java -version`
- Limpe o cache Maven: `mvn clean`

---

## 📖 Documentação Adicional

- [API REST Documentation](codigo/backend/virtus/src/main/resources/api-docs.yml) *(em desenvolvimento)*
- [Guia de Contribuição](CONTRIBUTING.md) *(em desenvolvimento)*
- [Histórias de Usuário](Documentação/Diagramas/Histórias%20de%20Usuário.pdf)

---

## 👥 Equipe
Projeto desenvolvido pelos alunos:
- Bernardo de Resende Marcelino
- Flávio de Souza Júnior
- João Marcelo Carvalho Pereira Araújo
- Miguel Figueiredo Diniz

---

## 📄 Licença
Este projeto é fornecido como material educacional do Laboratório de Desenvolvimento de Software.
