# ==============================================================================
# Makefile - Sistema de Moeda Estudantil Virtus
# ==============================================================================

.PHONY: help
.DEFAULT_GOAL := help

# Colors
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

# ==============================================================================
# HELP
# ==============================================================================

help: ## Mostra esta mensagem de ajuda
	@echo "$(BLUE)═══════════════════════════════════════════════════════════════$(NC)"
	@echo "$(GREEN)  Sistema de Moeda Estudantil Virtus - Comandos Make$(NC)"
	@echo "$(BLUE)═══════════════════════════════════════════════════════════════$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(YELLOW)%-25s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(BLUE)═══════════════════════════════════════════════════════════════$(NC)"

# ==============================================================================
# DOCKER - COMANDOS PRINCIPAIS
# ==============================================================================

up: ## Sobe todos os containers em background
	@echo "$(GREEN)🚀 Subindo containers...$(NC)"
	docker-compose up -d
	@echo "$(GREEN)✅ Containers iniciados!$(NC)"
	@echo "$(YELLOW)Frontend: http://localhost:3000$(NC)"
	@echo "$(YELLOW)Backend:  http://localhost:8080$(NC)"

down: ## Para e remove todos os containers
	@echo "$(RED)🛑 Parando containers...$(NC)"
	docker-compose down
	@echo "$(GREEN)✅ Containers parados!$(NC)"

restart: ## Reinicia todos os containers
	@echo "$(YELLOW)🔄 Reiniciando containers...$(NC)"
	@$(MAKE) down
	@$(MAKE) up
	@echo "$(GREEN)✅ Containers reiniciados!$(NC)"

stop: ## Para os containers sem removê-los
	@echo "$(YELLOW)⏸️  Parando containers...$(NC)"
	docker-compose stop
	@echo "$(GREEN)✅ Containers parados!$(NC)"

start: ## Inicia containers já existentes
	@echo "$(GREEN)▶️  Iniciando containers...$(NC)"
	docker-compose start
	@echo "$(GREEN)✅ Containers iniciados!$(NC)"

# ==============================================================================
# DOCKER - BUILD E REBUILD
# ==============================================================================

build: ## Reconstrói todas as imagens
	@echo "$(BLUE)🔨 Reconstruindo todas as imagens...$(NC)"
	docker-compose build --no-cache
	@echo "$(GREEN)✅ Imagens reconstruídas!$(NC)"

rebuild: ## Reconstrói e sobe os containers
	@echo "$(BLUE)🔨 Reconstruindo e subindo containers...$(NC)"
	docker-compose up -d --build
	@echo "$(GREEN)✅ Containers reconstruídos e iniciados!$(NC)"

build-backend: ## Reconstrói apenas o backend
	@echo "$(BLUE)🔨 Reconstruindo backend...$(NC)"
	docker-compose build --no-cache backend
	@echo "$(GREEN)✅ Backend reconstruído!$(NC)"

build-frontend: ## Reconstrói apenas o frontend
	@echo "$(BLUE)🔨 Reconstruindo frontend...$(NC)"
	docker-compose build --no-cache frontend
	@echo "$(GREEN)✅ Frontend reconstruído!$(NC)"

# ==============================================================================
# LOGS
# ==============================================================================

logs: ## Mostra logs de todos os containers (follow)
	docker-compose logs -f

logs-backend: ## Mostra logs do backend
	docker-compose logs -f backend

logs-frontend: ## Mostra logs do frontend
	docker-compose logs -f frontend

# logs-db removido - banco PostgreSQL está no Azure (externo)

# ==============================================================================
# STATUS E INFORMAÇÕES
# ==============================================================================

ps: ## Lista status dos containers
	@echo "$(BLUE)📊 Status dos containers:$(NC)"
	docker-compose ps

status: ps ## Alias para ps

stats: ## Mostra uso de recursos dos containers
	@echo "$(BLUE)📈 Uso de recursos:$(NC)"
	docker stats --no-stream

# ==============================================================================
# ACESSO AOS CONTAINERS
# ==============================================================================

shell-backend: ## Abre shell no container do backend
	@echo "$(BLUE)🐚 Abrindo shell do backend...$(NC)"
	docker exec -it virtus-backend sh

shell-frontend: ## Abre shell no container do frontend
	@echo "$(BLUE)🐚 Abrindo shell do frontend...$(NC)"
	docker exec -it virtus-frontend sh

# shell-db removido - banco PostgreSQL está no Azure (use ferramentas Azure ou cliente psql local)

# ==============================================================================
# BANCO DE DADOS
# ==============================================================================
# NOTA: O banco PostgreSQL está hospedado no Azure (externo ao Docker)
# Use ferramentas do Azure ou cliente psql local para gerenciar o banco

db-info: ## Mostra informações sobre conexão com banco Azure
	@echo "$(BLUE)📊 Informações do Banco de Dados:$(NC)"
	@echo "$(YELLOW)Banco: Azure PostgreSQL (externo)$(NC)"
	@echo "$(YELLOW)Gerenciamento: Use Azure Portal ou cliente psql local$(NC)"
	@echo ""
	@echo "$(YELLOW)Variáveis de ambiente (.env):$(NC)"
	@cat .env | grep -E "(SPRING_DATASOURCE_URL|POSTGRES_USER)" || echo "$(RED)Arquivo .env não encontrado$(NC)"

# ==============================================================================
# LIMPEZA
# ==============================================================================

clean: ## Remove containers, volumes e imagens do projeto
	@echo "$(YELLOW)🧹 Limpando containers e volumes...$(NC)"
	docker-compose down -v
	@echo "$(GREEN)✅ Limpeza concluída!$(NC)"

clean-all: ## Remove tudo incluindo imagens
	@echo "$(RED)🧹 Limpeza completa...$(NC)"
	docker-compose down -v --rmi all
	@echo "$(GREEN)✅ Limpeza completa concluída!$(NC)"

prune: ## Remove todos os recursos Docker não utilizados
	@echo "$(YELLOW)🧹 Removendo recursos não utilizados...$(NC)"
	docker system prune -a -f
	docker volume prune -f
	@echo "$(GREEN)✅ Sistema limpo!$(NC)"

# ==============================================================================
# DESENVOLVIMENTO
# ==============================================================================

dev: ## Sobe containers e mostra logs (desenvolvimento)
	@echo "$(GREEN)🚀 Modo desenvolvimento...$(NC)"
	docker-compose up

dev-backend: ## Inicia apenas backend + db e mostra logs
	@echo "$(GREEN)🚀 Iniciando backend em modo desenvolvimento...$(NC)"
	docker-compose up postgres backend

dev-frontend: ## Inicia apenas frontend e mostra logs
	@echo "$(GREEN)🚀 Iniciando frontend em modo desenvolvimento...$(NC)"
	docker-compose up frontend

# ==============================================================================
# TESTES E VALIDAÇÃO
# ==============================================================================

test: ## Testa se os serviços estão respondendo
	@echo "$(BLUE)🧪 Testando serviços...$(NC)"
	@echo -n "$(YELLOW)Backend:    $(NC)"
	@curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/actuator/health | grep -q "200" && echo "$(GREEN)✅$(NC)" || echo "$(RED)❌$(NC)"
	@echo -n "$(YELLOW)Frontend:   $(NC)"
	@curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200" && echo "$(GREEN)✅$(NC)" || echo "$(RED)❌$(NC)"
	@echo "$(YELLOW)PostgreSQL: Azure (externo) - verifique no Azure Portal$(NC)"

health: ## Verifica saúde dos containers
	@echo "$(BLUE)🏥 Verificando saúde dos containers...$(NC)"
	@docker-compose ps

ping: ## Testa conectividade com os serviços
	@echo "$(BLUE)🏓 Testando conectividade...$(NC)"
	@echo "Frontend:"
	@curl -s http://localhost:3000 > /dev/null && echo "$(GREEN)✅ OK$(NC)" || echo "$(RED)❌ FALHOU$(NC)"
	@echo "Backend:"
	@curl -s http://localhost:8080/actuator/health && echo "" || echo "$(RED)❌ FALHOU$(NC)"

# ==============================================================================
# USUÁRIOS DE TESTE
# ==============================================================================

seed: ## Cria usuários de teste no sistema
	@echo "$(BLUE)🌱 Criando usuários de teste...$(NC)"
	@echo "$(YELLOW)Aguarde os containers iniciarem (30s)...$(NC)"
	@sleep 30
	@echo "$(YELLOW)Criando Admin...$(NC)"
	@curl -s -X POST http://localhost:8080/api/admins/cadastro \
		-H "Content-Type: application/json" \
		-d '{"login":"admin","senha":"admin123","nome":"Administrador do Sistema","email":"admin@virtus.com","cpf":"12345678900"}' \
		&& echo "$(GREEN)✅ Admin criado$(NC)" || echo "$(RED)❌ Erro ao criar admin$(NC)"
	@echo "$(YELLOW)Criando Professor...$(NC)"
	@curl -s -X POST http://localhost:8080/api/professores/cadastro \
		-H "Content-Type: application/json" \
		-d '{"login":"professor","senha":"prof123","nome":"Prof. João Silva","cpf":"11122233344","departamento":"Computação"}' \
		&& echo "$(GREEN)✅ Professor criado$(NC)" || echo "$(RED)❌ Erro ao criar professor$(NC)"
	@echo "$(YELLOW)Criando Aluno...$(NC)"
	@curl -s -X POST http://localhost:8080/api/alunos/cadastro \
		-H "Content-Type: application/json" \
		-d '{"login":"aluno","senha":"aluno123","nome":"Maria Santos","email":"maria@email.com","cpf":"99988877766","rg":"123456","endereco":"Rua A, 123"}' \
		&& echo "$(GREEN)✅ Aluno criado$(NC)" || echo "$(RED)❌ Erro ao criar aluno$(NC)"
	@echo ""
	@echo "$(GREEN)✅ Usuários de teste criados!$(NC)"
	@echo "$(BLUE)═══════════════════════════════════════════$(NC)"
	@echo "$(YELLOW)Admin:     $(NC)admin / admin123"
	@echo "$(YELLOW)Professor: $(NC)professor / prof123"
	@echo "$(YELLOW)Aluno:     $(NC)aluno / aluno123"
	@echo "$(BLUE)═══════════════════════════════════════════$(NC)"

# ==============================================================================
# INSTALAÇÃO E SETUP
# ==============================================================================

install: ## Instala o projeto (build + up + seed)
	@echo "$(BLUE)📦 Instalando projeto...$(NC)"
	@$(MAKE) build
	@$(MAKE) up
	@$(MAKE) seed
	@echo "$(GREEN)✅ Projeto instalado com sucesso!$(NC)"
	@echo "$(YELLOW)Acesse: http://localhost:3000$(NC)"

setup: install ## Alias para install

first-run: install ## Primeira execução do projeto

# ==============================================================================
# INFORMAÇÕES
# ==============================================================================

info: ## Mostra informações do projeto
	@echo "$(BLUE)═══════════════════════════════════════════════════════════════$(NC)"
	@echo "$(GREEN)  Sistema de Moeda Estudantil Virtus$(NC)"
	@echo "$(BLUE)═══════════════════════════════════════════════════════════════$(NC)"
	@echo ""
	@echo "$(YELLOW)📦 Serviços Docker:$(NC)"
	@echo "  Frontend:   http://localhost:3000"
	@echo "  Backend:    http://localhost:8080"
	@echo ""
	@echo "$(YELLOW)🗄️  Banco de Dados:$(NC)"
	@echo "  PostgreSQL: Azure (externo ao Docker)"
	@echo ""
	@echo "$(YELLOW)👥 Usuários de teste:$(NC)"
	@echo "  Admin:      admin / admin123"
	@echo "  Professor:  professor / prof123"
	@echo "  Aluno:      aluno / aluno123"
	@echo ""
	@echo "$(YELLOW)📚 Documentação:$(NC)"
	@echo "  README.md"
	@echo "  DOCKER_README.md"
	@echo "  MAKEFILE_GUIDE.md"
	@echo "  ENV_GUIDE.md"
	@echo ""
	@echo "$(BLUE)═══════════════════════════════════════════════════════════════$(NC)"

urls: ## Mostra URLs dos serviços
	@echo "$(BLUE)🌐 URLs dos serviços:$(NC)"
	@echo "Frontend:   $(GREEN)http://localhost:3000$(NC)"
	@echo "Backend:    $(GREEN)http://localhost:8080$(NC)"
	@echo "PostgreSQL: $(YELLOW)Azure (externo)$(NC)"

# ==============================================================================
# VARIÁVEIS DE AMBIENTE
# ==============================================================================

env-setup: ## Copia .env.example para .env
	@if [ -f .env ]; then \
		echo "$(YELLOW)⚠️  Arquivo .env já existe$(NC)"; \
		echo "$(YELLOW)Para sobrescrever, execute: make env-reset$(NC)"; \
	else \
		cp .env.example .env; \
		echo "$(GREEN)✅ Arquivo .env criado!$(NC)"; \
		echo "$(YELLOW)Edite o arquivo .env conforme necessário$(NC)"; \
	fi

env-reset: ## Reseta .env para valores padrão
	@echo "$(YELLOW)⚠️  Resetando arquivo .env...$(NC)"
	cp .env.example .env
	@echo "$(GREEN)✅ Arquivo .env resetado!$(NC)"

env-show: ## Mostra variáveis de ambiente
	@echo "$(BLUE)🔧 Variáveis de ambiente (.env):$(NC)"
	@cat .env | grep -v "^#" | grep -v "^$$"

env-validate: ## Valida se .env existe
	@if [ ! -f .env ]; then \
		echo "$(RED)❌ Arquivo .env não encontrado!$(NC)"; \
		echo "$(YELLOW)Execute: make env-setup$(NC)"; \
		exit 1; \
	else \
		echo "$(GREEN)✅ Arquivo .env encontrado$(NC)"; \
	fi

env-edit: ## Abre .env para edição
	@if [ ! -f .env ]; then \
		echo "$(RED)❌ Arquivo .env não encontrado!$(NC)"; \
		echo "$(YELLOW)Execute primeiro: make env-setup$(NC)"; \
		exit 1; \
	fi
	@echo "$(BLUE)📝 Abrindo .env para edição...$(NC)"
	@nano .env || vim .env || code .env || notepad .env
