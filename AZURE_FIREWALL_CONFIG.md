# Guia: Configurar Firewall Azure PostgreSQL para Render

## 🎯 Objetivo
Permitir que o Render conecte ao seu Azure PostgreSQL `student-currency`

---

## 📋 Passo a Passo Completo

### 1️⃣ Acessar o Azure Portal

1. Acesse: https://portal.azure.com
2. Faça login com sua conta Microsoft

### 2️⃣ Encontrar o PostgreSQL

**Via busca (mais rápido):**
- No topo da página, na barra de busca
- Digite: `student-currency`
- Clique no recurso PostgreSQL que aparecer

**Via menu:**
- Menu lateral → "All resources" ou "Todos os recursos"
- Procure: `student-currency`
- Tipo: Azure Database for PostgreSQL
- Clique no recurso

### 3️⃣ Abrir Configurações de Rede

No menu lateral esquerdo do recurso PostgreSQL, procure por:

**Nomes possíveis (dependendo da versão):**
- **"Networking"** (versão mais nova - Flexible Server)
- **"Connection security"** (versão antiga - Single Server)
- **"Rede"** (se estiver em português)

**Clique na opção que você encontrar**

### 4️⃣ Configurar Firewall

#### Se aparecer "Networking":

1. Encontre a seção **"Firewall rules"**

2. Clique em **"+ Add firewall rule"**

3. Preencha:
   ```
   Rule name: allow-render
   Start IP address: 0.0.0.0
   End IP address: 255.255.255.255
   ```

4. Marque a opção (se disponível):
   ```
   ☑️ Allow public access from any Azure service within Azure to this server
   ```

5. Clique em **"Save"** (no topo da página)

#### Se aparecer "Connection security":

1. Na seção **"Firewall rules"**

2. Clique em **"+ Add firewall rule"** ou **"Add client IP"**

3. Preencha:
   ```
   Rule name: allow-render
   Start IP: 0.0.0.0
   End IP: 255.255.255.255
   ```

4. Configure o switch:
   ```
   Allow access to Azure services: ON (verde)
   ```

5. Verifique:
   ```
   Enforce SSL connection: ENABLED (deve estar habilitado)
   ```

6. Clique em **"Save"** (no topo)

### 5️⃣ Verificar SSL

Na mesma página ou em "SSL settings":

- Certifique-se que **SSL** está **habilitado**
- Se não estiver, habilite e salve

### 6️⃣ Aguardar Aplicação

- Após salvar, aguarde **1-2 minutos**
- O Azure precisa aplicar as configurações

---

## ✅ Checklist de Verificação

Após configurar, confirme:

- [ ] Regra de firewall criada com IPs 0.0.0.0 - 255.255.255.255
- [ ] "Allow access to Azure services" está ON/habilitado
- [ ] SSL/TLS enforcement está ENABLED
- [ ] Clicou em "Save"
- [ ] Aguardou 1-2 minutos

---

## 🔍 Onde Encontrar Cada Opção

### Estrutura do Menu (Azure Database for PostgreSQL):

```
student-currency (seu recurso PostgreSQL)
├── Overview
├── Activity log
├── Access control (IAM)
├── ...
├── 🌐 Networking (OU Connection security) ← AQUI!
│   ├── Firewall rules ← CONFIGURAR AQUI
│   ├── Virtual network rules
│   └── SSL settings
├── Security
├── Monitoring
└── Settings
```

---

## 🚨 Troubleshooting

### Não encontro "Networking" ou "Connection security"

**Possíveis nomes alternativos:**
- "Rede" (português)
- "Segurança de conexão" (português)
- Em "Settings" → "Networking"
- Em "Security" → "Networking"

### Não consigo adicionar regra de firewall

**Verifique:**
1. Você tem permissões de administrador no Azure?
2. O recurso é realmente um PostgreSQL?
3. Tente usar a busca do portal: "firewall rules student-currency"

### SSL já está habilitado?

**Perfeito!** Mantenha habilitado. É obrigatório para segurança.

---

## 🔐 Segurança: IPs Específicos do Render (Opcional)

Para maior segurança, ao invés de `0.0.0.0-255.255.255.255`, use IPs específicos do Render.

**IPs do Render por região:**
Consulte: https://render.com/docs/static-outbound-ip-addresses

Adicione uma regra para cada IP do Render.

---

## 📞 Precisa de Ajuda?

Se ainda tiver problemas:

1. Verifique se está no recurso correto (`student-currency`)
2. Confirme que é um Azure Database for PostgreSQL
3. Tente acessar via busca: "firewall student-currency"
4. Verifique suas permissões de acesso no Azure

---

## ✨ Próximos Passos

Após configurar o firewall no Azure:

1. ✅ Volte ao Render
2. ✅ Configure as variáveis de ambiente (veja RENDER_ENV_CONFIG.md)
3. ✅ Faça deploy
4. ✅ Verifique os logs para confirmar conexão bem-sucedida

---

**Data:** 2025-11-27
**Recurso:** student-currency.postgres.database.azure.com
**Porta:** 5432
**Banco:** studentcurrency
