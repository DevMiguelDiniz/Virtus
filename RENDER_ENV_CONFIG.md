# Configuração de Variáveis de Ambiente - Render

## ✅ Variáveis para o Backend no Render

Copie estas variáveis exatamente como estão para a seção **Environment** do seu Web Service no Render:

### Database (Azure PostgreSQL)
```
SPRING_DATASOURCE_URL=jdbc:postgresql://student-currency.postgres.database.azure.com:5432/studentcurrency?sslmode=require
SPRING_DATASOURCE_USERNAME=studentcurrency@student-currency
SPRING_DATASOURCE_PASSWORD=aramuni123$
```

### JPA/Hibernate
```
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_JPA_SHOW_SQL=false
SPRING_JPA_FORMAT_SQL=true
```

### JWT Security
```
JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
JWT_EXPIRATION=86400000
```

### Server
```
SERVER_PORT=8080
```

### CORS e Application (ATUALIZE com suas URLs!)
```
CORS_ALLOWED_ORIGINS=https://seu-frontend.vercel.app
APP_BASE_URL=https://seu-frontend.vercel.app
```

### Logging
```
LOGGING_LEVEL_SECURITY=INFO
LOGGING_LEVEL_APP=INFO
```

---

## 🔥 Configuração do Firewall no Azure

**OBRIGATÓRIO:** Configure o firewall do Azure PostgreSQL para permitir conexões do Render.

### Opção 1: Permitir Todas as Conexões (Para Teste)

1. Azure Portal → PostgreSQL → `student-currency`
2. **Connection security** ou **Networking**
3. Firewall rules → Add rule:
   - Name: `allow-all`
   - Start IP: `0.0.0.0`
   - End IP: `255.255.255.255`
4. Enable **"Allow access to Azure services"**: ON
5. **Save**

### Opção 2: IPs Específicos do Render (Mais Seguro)

Consulte os IPs do Render em: https://render.com/docs/static-outbound-ip-addresses

---

## ⚠️ Pontos Críticos:

1. ✅ URL deve incluir `?sslmode=require`
2. ✅ Username deve ser `studentcurrency@student-currency` (formato Azure)
3. ✅ Firewall do Azure deve permitir conexões do Render
4. ✅ Atualize `CORS_ALLOWED_ORIGINS` com a URL real do frontend
5. ✅ Atualize `APP_BASE_URL` com a URL real do frontend

---

## 🧪 Testar Conexão

Após configurar, o backend deve iniciar com sucesso. Verifique os logs:

✅ **Sucesso:**
```
HikariPool-1 - Starting...
HikariPool-1 - Start completed
Started VirtusApplication in X.XXX seconds
```

❌ **Ainda com erro:**
- Verifique firewall do Azure
- Confirme que SSL está habilitado no Azure
- Verifique se o username está no formato `user@servidor`
