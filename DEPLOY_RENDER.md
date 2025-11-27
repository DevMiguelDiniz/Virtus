# Guia de Deploy do Backend no Render

Este guia explica como fazer o deploy do backend Spring Boot no Render usando Docker.

## 📋 Pré-requisitos

1. Conta no Render (https://render.com)
2. Banco de dados PostgreSQL configurado
3. Repositório Git conectado ao Render

---

## 🗄️ Passo 1: Configurar Banco de Dados PostgreSQL

### Opção A: PostgreSQL no Render (Recomendado)

1. No dashboard do Render, clique em **"New +"** → **"PostgreSQL"**
2. Configure:
   - **Name:** `virtus-db`
   - **Database:** `studentcurrency`
   - **User:** `studentcurrency`
   - **Region:** Escolha a mais próxima
3. Clique em **"Create Database"**
4. Após criar, vá em **"Info"** e copie:
   - ✅ **Internal Database URL** (para conectar o backend - mais rápida)
   - 📋 Exemplo: `postgresql://user:pass@dpg-xxxxx-a:5432/studentcurrency`

### Opção B: PostgreSQL Externo (Azure, AWS, etc.)

- Use a URL JDBC fornecida pelo seu provedor
- Formato: `jdbc:postgresql://host:5432/database`

---

## 🚀 Passo 2: Deploy do Backend

### 2.1. Criar Web Service

1. No dashboard do Render, clique em **"New +"** → **"Web Service"**
2. Conecte seu repositório Git do GitHub/GitLab
3. Selecione o repositório `Virtus`

### 2.2. Configurações Básicas

```
Name: virtus-backend
Region: Same as Database (escolha a mesma região do banco)
Branch: main
Runtime: Docker
```

### 2.3. Configurações Docker

**IMPORTANTE:** Configure exatamente assim:

```
Dockerfile Path: ./Dockerfile
Docker Context: ./codigo/backend/virtus
```

⚠️ **Atenção:** O `Docker Context` deve apontar para o diretório onde está o Dockerfile do backend!

### 2.4. Configurar Variáveis de Ambiente

Na seção **"Environment"**, adicione todas as variáveis abaixo:

#### 🔹 Database (Obrigatório)

```bash
SPRING_DATASOURCE_URL
```
- Se usando PostgreSQL do Render, converta a URL:
  - **Internal URL:** `postgresql://user:pass@dpg-xxxxx-a:5432/studentcurrency`
  - **Converta para:** `jdbc:postgresql://dpg-xxxxx-a:5432/studentcurrency`
  - ⚠️ Adicione `jdbc:` no início!

```bash
SPRING_DATASOURCE_USERNAME
```
- Usuário do banco (geralmente `studentcurrency`)

```bash
SPRING_DATASOURCE_PASSWORD
```
- Senha do banco (copie da página do PostgreSQL no Render)

#### 🔹 JPA/Hibernate

```bash
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_JPA_SHOW_SQL=false
SPRING_JPA_FORMAT_SQL=true
```

#### 🔹 JWT Security (Obrigatório)

```bash
JWT_SECRET
```
- 🔒 **Gere uma chave secreta forte!**
- Sugestão: use um gerador online ou:
  ```bash
  openssl rand -base64 64
  ```
- Exemplo: `8y/B?E(H+MbQeThWmZq4t7w!z$C&F)J@NcRfUjXn2r5u8x/A?D*G-KaPdSgVkYp3`

```bash
JWT_EXPIRATION=86400000
```
- 24 horas em milissegundos

#### 🔹 Server

```bash
SERVER_PORT=8080
```

#### 🔹 CORS (Obrigatório)

```bash
CORS_ALLOWED_ORIGINS
```
- URLs do seu frontend separadas por vírgula
- Exemplos:
  - Vercel: `https://seu-app.vercel.app`
  - Netlify: `https://seu-app.netlify.app`
  - Múltiplas: `https://app1.com,https://app2.com`
- ⚠️ **Sem barra final!** Use `https://app.com` não `https://app.com/`

#### 🔹 Application

```bash
APP_BASE_URL
```
- URL do frontend (usada para gerar links em emails)
- Exemplo: `https://seu-frontend.vercel.app`

#### 🔹 Logging (Opcional)

```bash
LOGGING_LEVEL_SECURITY=INFO
LOGGING_LEVEL_APP=INFO
```
- Para debug, use `DEBUG`

### 2.5. Criar e Deployar

1. Revise todas as configurações
2. Clique em **"Create Web Service"**
3. Aguarde o build e deploy (pode levar 5-10 minutos na primeira vez)

### 2.6. Obter URL do Backend

Após o deploy bem-sucedido:
- Copie a URL no topo da página
- Exemplo: `https://virtus-backend.onrender.com`
- 📋 **Use esta URL no frontend** (`NEXT_PUBLIC_API_URL`)

---

## ✅ Passo 3: Testar o Backend

### Teste de Health Check

Acesse no navegador:
```
https://seu-backend.onrender.com/api/auth/login
```

Se retornar erro 405 (Method Not Allowed), está funcionando! ✅
(Erro 405 é esperado pois não enviamos POST)

### Teste com cURL

```bash
curl -X POST https://seu-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login":"teste@email.com","senha":"senha123"}'
```

---

## 🔧 Troubleshooting

### ❌ Build falha: "No sources to compile"

**Solução:** Verifique o **Docker Context**
- Deve ser: `./codigo/backend/virtus`
- ⚠️ Não deixe em branco!

### ❌ ClassNotFoundException: VirtusApplication

**Causa:** Docker Context incorreto ou pom.xml sem mainClass

**Solução:**
1. Confirme Docker Context: `./codigo/backend/virtus`
2. O pom.xml já foi corrigido com a mainClass

### ❌ Backend inicia mas retorna erro 500

**Causa:** Banco de dados não conecta

**Solução:**
1. Verifique `SPRING_DATASOURCE_URL` - deve começar com `jdbc:postgresql://`
2. Teste credenciais (username e password)
3. Se usando Render DB, use a **Internal Database URL** (mais rápida)

### ❌ CORS Error no Frontend

**Causa:** Frontend não está na lista de origens permitidas

**Solução:**
1. Adicione a URL **exata** do frontend em `CORS_ALLOWED_ORIGINS`
2. Não inclua barra final: ✅ `https://app.com` ❌ `https://app.com/`
3. Para múltiplos domínios, separe por vírgula sem espaços

### 🐌 Backend demora muito para responder

**Causa:** Plano Free do Render "adormece" após 15 minutos

**Comportamento:**
- Primeira requisição após inatividade: 30-60 segundos
- Próximas requisições: rápidas

**Soluções:**
- Upgrade para plano pago (backend sempre ativo)
- Implemente um "keep-alive" ping

---

## 📝 Checklist Final

Antes de considerar o deploy concluído, verifique:

- ✅ Backend deployado com sucesso no Render
- ✅ URL do backend acessível (ex: `https://virtus-backend.onrender.com`)
- ✅ Todas as variáveis de ambiente configuradas
- ✅ CORS configurado com URL do frontend
- ✅ JWT_SECRET único e seguro configurado
- ✅ Banco de dados PostgreSQL conectado
- ✅ Logs não mostram erros críticos
- ✅ Teste de login funcionando

---

## 📊 Resumo de Configuração

| Campo | Valor |
|-------|-------|
| **Runtime** | Docker |
| **Dockerfile Path** | `./Dockerfile` |
| **Docker Context** | `./codigo/backend/virtus` |
| **Port** | 8080 |

### Variáveis Obrigatórias:
- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `JWT_SECRET`
- `CORS_ALLOWED_ORIGINS`
- `APP_BASE_URL`

---

## 🔗 Próximos Passos

1. **Configure o Frontend:**
   - Adicione `NEXT_PUBLIC_API_URL=https://seu-backend.onrender.com`

2. **Teste Integração Completa:**
   - Cadastro de usuários
   - Login e autenticação
   - Todas as funcionalidades

3. **Segurança (Produção):**
   - Use senhas fortes
   - Configure SSL/HTTPS (Render fornece automaticamente)
   - Monitore logs regularmente

4. **Opcional:**
   - Configure domínio customizado
   - Configure alertas de monitoramento
   - Implemente backups do banco

---

## 📚 Recursos

- [Render Docs - Docker](https://render.com/docs/docker)
- [Render Docs - PostgreSQL](https://render.com/docs/databases)
- [Spring Boot + Docker](https://spring.io/guides/gs/spring-boot-docker/)

---

**🎉 Pronto! Seu backend está no ar!**

Qualquer dúvida, consulte os logs no dashboard do Render.
