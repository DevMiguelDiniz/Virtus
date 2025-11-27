# 📘 Guia Completo do Makefile - Sistema Virtus

## 📋 Índice

1. [O que é Make?](#o-que-é-make)
2. [Instalação do Make](#instalação-do-make)
   - [Windows](#windows)
   - [macOS](#macos)
   - [Ubuntu/Debian](#ubuntudebian)
3. [Comandos Principais](#comandos-principais)
4. [Exemplos de Uso](#exemplos-de-uso)
5. [Troubleshooting](#troubleshooting)

---

## 🤔 O que é Make?

**Make** é uma ferramenta de automação de build que permite criar "atalhos" para comandos complexos. No nosso projeto, usamos o Makefile para simplificar os comandos Docker.

### Antes do Make:
```bash
docker-compose up -d
docker-compose logs -f backend
docker exec -it virtus-backend sh
```

### Com Make:
```bash
make up
make logs-backend
make shell-backend
```

**Muito mais simples! 😎**

---

## 💻 Instalação do Make

### 🪟 Windows

#### Opção 1: Chocolatey (Recomendado)

1. **Instalar Chocolatey** (se ainda não tiver):
   - Abra o PowerShell como Administrador
   - Execute:
   ```powershell
   Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
   ```

2. **Instalar Make**:
   ```powershell
   choco install make
   ```

3. **Verificar instalação**:
   ```powershell
   make --version
   ```

#### Opção 2: Git Bash

Se você já tem o Git instalado, o Make vem incluído!

1. **Baixar Git para Windows**:
   - Acesse: https://git-scm.com/download/win
   - Baixe e instale

2. **Usar Git Bash**:
   - Abra o Git Bash (vem com o Git)
   - O Make já está disponível!

3. **Verificar**:
   ```bash
   make --version
   ```

#### Opção 3: WSL (Windows Subsystem for Linux)

1. **Instalar WSL**:
   ```powershell
   wsl --install
   ```

2. **Abrir Ubuntu no WSL** e seguir instruções do Ubuntu abaixo

#### Opção 4: Download Manual

1. **Baixar Make para Windows**:
   - Acesse: https://gnuwin32.sourceforge.net/packages/make.htm
   - Baixe o instalador (Complete package, except sources)

2. **Instalar e adicionar ao PATH**:
   - Instale em `C:\Program Files (x86)\GnuWin32`
   - Adicione ao PATH: `C:\Program Files (x86)\GnuWin32\bin`

3. **Verificar**:
   ```cmd
   make --version
   ```

---

### 🍎 macOS

#### Opção 1: Xcode Command Line Tools (Recomendado)

O Make já vem incluído nas ferramentas de linha de comando do Xcode!

1. **Instalar Xcode Command Line Tools**:
   ```bash
   xcode-select --install
   ```

2. **Aceitar a licença** (se solicitado):
   ```bash
   sudo xcodebuild -license accept
   ```

3. **Verificar instalação**:
   ```bash
   make --version
   ```

#### Opção 2: Homebrew

1. **Instalar Homebrew** (se ainda não tiver):
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Instalar Make**:
   ```bash
   brew install make
   ```

3. **Verificar**:
   ```bash
   make --version
   ```

---

### 🐧 Ubuntu/Debian

#### Instalação via APT

1. **Atualizar pacotes**:
   ```bash
   sudo apt update
   ```

2. **Instalar make**:
   ```bash
   sudo apt install make
   ```

3. **Verificar instalação**:
   ```bash
   make --version
   ```

#### Instalação do build-essential (Completo)

Para ter todas as ferramentas de build:

```bash
sudo apt update
sudo apt install build-essential
```

Isso instala:
- make
- gcc
- g++
- e outras ferramentas de desenvolvimento

---

### ✅ Verificar Instalação

Em qualquer sistema operacional, execute:

```bash
make --version
```

**Saída esperada:**
```
GNU Make 4.x
Built for x86_64-...
Copyright (C) ...
```

Se você ver isso, está tudo certo! 🎉

---

## 🚀 Comandos Principais

### 📖 Ajuda

```bash
make help
```

Mostra todos os comandos disponíveis com descrições.

---

### 🐳 Comandos Docker Básicos

#### Subir o projeto
```bash
make up
```
Inicia todos os containers em background.

#### Parar o projeto
```bash
make down
```
Para e remove todos os containers.

#### Reiniciar
```bash
make restart
```
Reinicia todos os containers.

#### Ver status
```bash
make ps
# ou
make status
```
Mostra status de todos os containers.

---

### 🔨 Build e Rebuild

#### Reconstruir tudo
```bash
make build
```
Reconstrói todas as imagens Docker do zero.

#### Reconstruir e subir
```bash
make rebuild
```
Reconstrói as imagens e já sobe os containers.

#### Reconstruir apenas backend
```bash
make build-backend
```

#### Reconstruir apenas frontend
```bash
make build-frontend
```

---

### 📜 Logs

#### Ver todos os logs
```bash
make logs
```
Mostra logs de todos os containers em tempo real.

#### Ver logs do backend
```bash
make logs-backend
```

#### Ver logs do frontend
```bash
make logs-frontend
```

#### Ver logs do banco
```bash
make logs-db
```

**Dica:** Pressione `Ctrl+C` para sair dos logs.

---

### 🖥️ Acessar Containers

#### Shell do backend
```bash
make shell-backend
```
Abre um terminal dentro do container do backend.

#### Shell do frontend
```bash
make shell-frontend
```

#### PostgreSQL (psql)
```bash
make shell-db
```
Abre o cliente psql conectado no banco.

**Para sair:** Digite `exit` ou `\q` (no psql)

---

### 🗄️ Banco de Dados

#### Criar backup
```bash
make db-backup
```
Cria um backup do banco em `backups/backup-YYYYMMDD-HHMMSS.sql`

#### Restaurar backup
```bash
make db-restore FILE=backups/backup-20250130-143000.sql
```
Restaura um backup específico.

#### Resetar banco (CUIDADO!)
```bash
make db-reset
```
⚠️ **ATENÇÃO:** Apaga TODOS os dados do banco!

---

### 🧹 Limpeza

#### Limpar containers e volumes
```bash
make clean
```
Remove containers e volumes do projeto.

#### Limpeza completa
```bash
make clean-all
```
Remove containers, volumes E imagens.

#### Limpar sistema Docker
```bash
make prune
```
Remove todos os recursos Docker não utilizados (global).

---

### 🌱 Desenvolvimento

#### Modo desenvolvimento (com logs)
```bash
make dev
```
Sobe os containers e mostra logs em tempo real.

#### Apenas backend + banco
```bash
make dev-backend
```
Útil para desenvolver o backend sem o frontend.

#### Apenas frontend
```bash
make dev-frontend
```

---

### 🧪 Testes

#### Testar serviços
```bash
make test
```
Verifica se todos os serviços estão respondendo.

#### Ver saúde dos containers
```bash
make health
```

#### Testar conectividade
```bash
make ping
```

---

### 👥 Usuários de Teste

#### Criar usuários de teste
```bash
make seed
```

Cria automaticamente:
- **Admin:** admin / admin123
- **Professor:** professor / prof123
- **Aluno:** aluno / aluno123

---

### 🎯 Instalação Completa

#### Primeira execução
```bash
make install
# ou
make first-run
```

Executa automaticamente:
1. Build das imagens
2. Sobe os containers
3. Cria usuários de teste

**Perfeito para começar! 🚀**

---

### ℹ️ Informações

#### Ver informações do projeto
```bash
make info
```
Mostra URLs, usuários de teste e documentação.

#### Ver URLs dos serviços
```bash
make urls
```

---

## 💡 Exemplos de Uso

### Exemplo 1: Primeira vez usando o projeto

```bash
# 1. Clone o repositório
git clone <repo-url>
cd Código

# 2. Instale tudo de uma vez
make install

# 3. Aguarde ~2 minutos
# 4. Acesse http://localhost:3000
# 5. Login: admin / admin123
```

### Exemplo 2: Desenvolvimento do backend

```bash
# Subir apenas backend + banco
make dev-backend

# Em outro terminal, ver logs
make logs-backend

# Fazer alterações no código...

# Reconstruir apenas o backend
make build-backend
docker-compose up -d backend
```

### Exemplo 3: Resetar ambiente

```bash
# Parar tudo
make down

# Limpar completamente
make clean-all

# Recomeçar do zero
make install
```

### Exemplo 4: Backup e restore

```bash
# Criar backup antes de mudanças importantes
make db-backup

# Fazer alterações...

# Se algo deu errado, restaurar
make db-restore FILE=backups/backup-20250130-143000.sql
```

### Exemplo 5: Ver o que está acontecendo

```bash
# Ver status
make ps

# Ver recursos sendo usados
make stats

# Ver logs em tempo real
make logs

# Testar se tudo está funcionando
make test
```

### Exemplo 6: Deploy em produção

```bash
# 1. No servidor, fazer build otimizado
make build

# 2. Subir em background
make up

# 3. Criar usuários
make seed

# 4. Verificar saúde
make health
make test

# 5. Monitorar logs
make logs
```

---

## 🔧 Troubleshooting

### Problema: "make: command not found"

**Windows:**
```powershell
# Instale via Chocolatey
choco install make

# Ou use Git Bash
```

**macOS:**
```bash
# Instale Xcode Command Line Tools
xcode-select --install
```

**Ubuntu:**
```bash
# Instale make
sudo apt install make
```

---

### Problema: Comandos não funcionam no Windows PowerShell

**Solução 1:** Use Git Bash
- Abra Git Bash em vez do PowerShell

**Solução 2:** Use WSL
```powershell
wsl
cd /mnt/c/Virtus/Código
make up
```

---

### Problema: "docker-compose: command not found"

**Solução:** Instale Docker Desktop
- Windows/Mac: https://www.docker.com/products/docker-desktop
- Ubuntu: https://docs.docker.com/engine/install/ubuntu/

---

### Problema: Permissão negada (Permission denied)

**Linux/Mac:**
```bash
# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER

# Fazer logout e login novamente
```

---

### Problema: Porta já em uso

**Erro:**
```
Error: port is already allocated
```

**Solução:**

**Windows:**
```powershell
# Ver o que está usando a porta
netstat -ano | findstr :8080

# Matar o processo
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
# Ver o que está usando a porta
lsof -i :8080

# Matar o processo
kill -9 <PID>
```

**Ou mudar a porta:**
```yaml
# docker-compose.yml
ports:
  - "8081:8080"  # Muda para porta 8081
```

---

### Problema: Make funciona mas comandos falham

**Verifique se Docker está rodando:**

```bash
docker --version
docker-compose --version
docker ps
```

Se não funcionar, inicie o Docker Desktop.

---

### Problema: Cores não aparecem no Windows

**Solução:** Use Git Bash ou Windows Terminal
- Git Bash suporta cores ANSI
- Windows Terminal também suporta

---

## 📚 Recursos Adicionais

### Documentação Oficial
- [GNU Make Manual](https://www.gnu.org/software/make/manual/)
- [Makefile Tutorial](https://makefiletutorial.com/)

### Documentação do Projeto
- [README.md](./README.md) - Documentação principal
- [DOCKER_README.md](./DOCKER_README.md) - Guia Docker completo
- [ADMIN_README.md](./ADMIN_README.md) - Documentação Admin Backend
- [ADMIN_FRONTEND_README.md](./ADMIN_FRONTEND_README.md) - Documentação Admin Frontend

---

## 🎯 Comandos Mais Usados

### Top 10 comandos que você vai usar:

1. `make help` - Ver todos os comandos
2. `make up` - Subir o projeto
3. `make down` - Parar o projeto
4. `make logs` - Ver logs
5. `make restart` - Reiniciar
6. `make ps` - Ver status
7. `make seed` - Criar usuários de teste
8. `make test` - Testar serviços
9. `make db-backup` - Criar backup
10. `make clean` - Limpar tudo

---

## 🎓 Dicas Avançadas

### Criar seus próprios comandos

Edite o `Makefile` e adicione:

```makefile
meu-comando: ## Descrição do comando
	@echo "Executando meu comando..."
	docker-compose ps
	@echo "Pronto!"
```

### Combinar comandos

```bash
# Limpar e reinstalar
make clean && make install

# Rebuild e ver logs
make rebuild && make logs
```

### Usar variáveis

```bash
# Restaurar backup específico
make db-restore FILE=meu-backup.sql
```

### Executar comandos customizados

```bash
# Executar comando no backend
docker-compose exec backend bash -c "java -version"

# Executar comando no banco
docker-compose exec postgres psql -U postgres -c "SELECT version();"
```

---

## ✅ Checklist de Instalação

- [ ] Make instalado (`make --version`)
- [ ] Docker instalado (`docker --version`)
- [ ] Docker Compose instalado (`docker-compose --version`)
- [ ] Clone do repositório
- [ ] Executar `make install`
- [ ] Acessar http://localhost:3000
- [ ] Login com usuários de teste

---

## 🎉 Pronto!

Agora você está pronto para usar o Makefile!

**Comando essencial:**
```bash
make help
```

Mostra todos os comandos disponíveis.

**Boa sorte! 🚀**

---

## 📞 Suporte

Se tiver problemas:

1. ✅ Verifique se Docker está rodando: `docker ps`
2. ✅ Verifique se Make está instalado: `make --version`
3. ✅ Execute: `make test` para diagnosticar
4. ✅ Veja logs: `make logs`
5. ✅ Consulte: [DOCKER_README.md](./DOCKER_README.md)
