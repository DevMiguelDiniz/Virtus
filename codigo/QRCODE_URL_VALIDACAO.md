# 📱 QR Code com URL de Validação

## 🎯 Objetivo

Transformar o QR Code de um simples código de texto para uma **URL completa** que redireciona para uma página de validação, simulando como seria um resgate real em um estabelecimento parceiro.

---

## 🔄 O Que Mudou?

### ❌ Antes
- QR Code continha apenas o código do resgate: `RES-1699999999-1234`
- Era apenas informativo, sem funcionalidade prática

### ✅ Agora
- QR Code contém uma URL completa: `http://localhost:3000/validar-resgate/123`
- Ao escanear, o usuário é levado para uma página interativa
- Estabelecimentos podem validar o resgate diretamente pela interface

---

## 🏗️ Arquitetura da Solução

### Backend

#### 1. **Configuração de URL Base**
```properties
# application.properties
app.base-url=http://localhost:3000
```

A URL base é configurável via environment variable, permitindo diferentes URLs para dev/staging/produção.

#### 2. **AppProperties.java** (Novo)
```java
@ConfigurationProperties(prefix = "app")
public class AppProperties {
    private String baseUrl;

    public String getResgateValidationUrl(Long resgateId) {
        return baseUrl + "/validar-resgate/" + resgateId;
    }
}
```

Centraliza a geração de URLs da aplicação.

#### 3. **EmailJSService.java** (Modificado)
```java
// Gera URL de validação
String resgateUrl = appProperties.getResgateValidationUrl(resgate.getId());

// Gera QR Code com a URL (não mais com o código)
String qrCodeBase64 = qrCodeService.generateQRCodeBase64(resgateUrl);

// Adiciona URL nos dados do email
templateParams.put("resgate_url", resgateUrl);
```

Agora o QR Code aponta para uma URL navegável ao invés de texto estático.

#### 4. **ResgateController.java** (Novo)
```java
@RestController
@RequestMapping("/api/resgates")
public class ResgateController {

    @GetMapping("/{id}")
    public ResponseEntity<ResgateVantagemResponse> buscarResgate(@PathVariable Long id)

    @PostMapping("/{id}/validar")
    public ResponseEntity<ResgateVantagemResponse> validarResgate(@PathVariable Long id)
}
```

**Endpoints públicos** (sem autenticação) para:
- Buscar detalhes do resgate
- Validar e marcar como utilizado

#### 5. **ResgateService.java** (Novo)
```java
@Service
public class ResgateService {

    public ResgateVantagemResponse buscarResgate(Long resgateId)

    public ResgateVantagemResponse validarResgate(Long resgateId) {
        // Valida se já foi usado
        // Marca como utilizado
        // Envia email de confirmação
    }
}
```

Lógica de negócio separada do controller de alunos.

#### 6. **SecurityConfig.java** (Modificado)
```java
.requestMatchers("/api/resgates/**").permitAll()
```

Permite acesso público aos endpoints de validação.

---

### Frontend

#### 1. **resgate.service.ts** (Novo)
```typescript
export async function buscarResgate(resgateId: number): Promise<ResgateDetalhes>
export async function validarResgate(resgateId: number): Promise<ResgateDetalhes>
```

Service para comunicação com os novos endpoints de resgate.

#### 2. **app/validar-resgate/[id]/page.tsx** (Novo)
Página dinâmica Next.js que:
- Recebe o ID do resgate via URL
- Busca informações do resgate
- Exibe detalhes da vantagem e aluno
- Permite validar o resgate com um botão
- Mostra status (disponível/utilizado)
- Exibe mensagens de sucesso/erro

**Features da Página:**
- ✅ Design profissional e responsivo
- ✅ Loading states
- ✅ Error handling
- ✅ Status badge (Disponível/Utilizado)
- ✅ Botão desabilitado após validação
- ✅ Confirmação visual de sucesso
- ✅ Informações completas do resgate
- ✅ Instruções de uso

---

## 🔐 Segurança

### Considerações Implementadas

1. **Endpoints Públicos**: Necessário para estabelecimentos validarem sem login
2. **Validação por ID**: Usar ID numérico sequencial pode ser um risco
3. **Proteção contra Reutilização**: Resgate só pode ser validado uma vez
4. **Auditoria**: Todas ações são logadas

### ⚠️ Melhorias de Segurança Recomendadas

Para produção, considere:

1. **Token de Validação**: Adicionar token único ao invés de ID
   ```
   http://localhost:3000/validar-resgate/abc123-xyz789-def456
   ```

2. **API Key para Estabelecimentos**: Requerer chave de autenticação
   ```java
   @PostMapping("/{id}/validar")
   public ResponseEntity<?> validarResgate(
       @PathVariable Long id,
       @RequestHeader("X-API-Key") String apiKey
   )
   ```

3. **Rate Limiting**: Prevenir tentativas de força bruta

4. **HTTPS Obrigatório**: Apenas URLs HTTPS em produção

---

## 📊 Fluxo Completo

```
┌─────────────────────────────────────────────────────────────────┐
│  FLUXO DE RESGATE COM QR CODE URL                               │
└─────────────────────────────────────────────────────────────────┘

1. Aluno resgata vantagem no app
   ↓
2. Backend cria ResgateVantagem no banco
   ID: 123
   Código: RES-1699999999-1234
   ↓
3. Backend gera URL de validação
   URL: http://localhost:3000/validar-resgate/123
   ↓
4. Backend gera QR Code com a URL
   QR Code → [URL completa em Base64]
   ↓
5. Backend envia email com QR Code
   EmailJS → Aluno recebe email
   ↓
6. Aluno apresenta QR Code no estabelecimento
   ↓
7. Estabelecimento escaneia QR Code
   ↓
8. Browser abre: /validar-resgate/123
   ↓
9. Frontend busca dados do resgate
   GET /api/resgates/123
   ↓
10. Estabelecimento vê detalhes e clica "Validar"
    ↓
11. Frontend envia validação
    POST /api/resgates/123/validar
    ↓
12. Backend marca como utilizado
    utilizado = true
    ↓
13. Backend envia email de confirmação ao aluno
    EmailJS → "Seu resgate foi validado!"
    ↓
14. Frontend mostra sucesso
    ✓ Resgate validado com sucesso!
```

---

## 🧪 Como Testar

### 1. Configurar Environment

**Backend:**
```properties
# application.properties
app.base-url=http://localhost:3000
```

**Frontend:**
```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### 2. Iniciar Serviços

```bash
# Backend
cd backend/virtus
mvn spring-boot:run

# Frontend
cd frontend
npm run dev
```

### 3. Fluxo de Teste

1. **Login como aluno** no frontend
2. **Acesse "Trocar Vantagens"**
3. **Resgatar uma vantagem**
4. **Verificar email** (se EmailJS configurado)
5. **Copiar URL do log do backend**
   ```
   INFO: URL de validação gerada: http://localhost:3000/validar-resgate/123
   ```
6. **Abrir URL no browser**
7. **Ver detalhes do resgate**
8. **Clicar em "Validar Resgate"**
9. **Confirmar sucesso**
10. **Tentar validar novamente** (deve mostrar erro)

### 4. Testar QR Code

Opção 1: **Usar app de câmera do celular**
- Abrir email no computador
- Escanear QR Code com celular
- Será redirecionado para a página

Opção 2: **Gerar QR Code manualmente**
- Usar site: https://www.qr-code-generator.com/
- Inserir URL: `http://localhost:3000/validar-resgate/123`
- Escanear com celular

---

## 📱 Demonstração Visual

### Email com QR Code
```
┌─────────────────────────────────┐
│  ✓ Resgate Realizado!          │
├─────────────────────────────────┤
│                                 │
│  Desconto 20% na Cantina        │
│                                 │
│     ┌───────────────┐           │
│     │               │           │
│     │   QR CODE     │           │
│     │   [████████]  │           │
│     │               │           │
│     └───────────────┘           │
│                                 │
│  Código: RES-1699999999-1234    │
│  URL: localhost:3000/.../123    │
│                                 │
│  📋 Como usar:                  │
│  1. Apresente este QR Code      │
│  2. Estabelecimento valida      │
│  3. Aproveite sua vantagem!     │
└─────────────────────────────────┘
```

### Página de Validação
```
┌─────────────────────────────────┐
│  Validação de Resgate           │
├─────────────────────────────────┤
│  ┌─────────────────────────┐   │
│  │ Código: RES-123...      │   │
│  │ Status: [Disponível]    │   │
│  ├─────────────────────────┤   │
│  │                         │   │
│  │ 🎁 Desconto 20%...      │   │
│  │    50 moedas            │   │
│  │                         │   │
│  │ Aluno: João Silva       │   │
│  │ Data: 13/11/2025 14:30  │   │
│  │                         │   │
│  │  [✓ Validar Resgate]    │   │
│  │  [  Voltar         ]    │   │
│  └─────────────────────────┘   │
└─────────────────────────────────┘
```

---

## 📝 Template EmailJS Atualizado

Adicione a URL no template para que apareça no email:

```html
<div class="instructions">
    <h3>📋 Como utilizar seu resgate:</h3>
    <ul>
        <li>Apresente este QR Code no estabelecimento</li>
        <li>Ou acesse diretamente: <a href="{{resgate_url}}">{{resgate_url}}</a></li>
        <li>O estabelecimento irá validar seu código</li>
        <li>Este código pode ser usado apenas uma vez</li>
    </ul>
</div>
```

E adicione a variável no EmailJS:
- `{{resgate_url}}` - URL completa de validação

---

## 🚀 Deploy em Produção

### 1. Configurar URL Base

**Desenvolvimento:**
```properties
app.base-url=http://localhost:3000
```

**Produção:**
```properties
app.base-url=https://virtus.com.br
```

**Via Environment Variable:**
```bash
export APP_BASE_URL=https://virtus.com.br
```

### 2. HTTPS Obrigatório

Sempre use HTTPS em produção para:
- Segurança do QR Code
- Proteção de dados sensíveis
- Confiança do usuário

### 3. Configurar CORS

Certifique-se que o frontend em produção está na lista de CORS:

```java
configuration.setAllowedOrigins(List.of(
    "http://localhost:3000",
    "https://virtus.com.br"
));
```

---

## 💡 Casos de Uso

### 1. Cantina Universitária
- Aluno resgata desconto
- Apresenta QR Code na cantina
- Atendente escaneia com tablet
- Sistema valida e aplica desconto

### 2. Livraria Parceira
- Aluno resgata vale-livro
- Vai até a livraria
- Vendedor escaneia QR Code
- Sistema confirma validade
- Aluno escolhe livro grátis

### 3. Estabelecimento Externo
- Resgate de voucher
- Estabelecimento sem app próprio
- Usa apenas câmera do celular
- Acessa página web
- Valida com um clique

---

## 🔍 Troubleshooting

### QR Code não abre página

**Problema**: QR Code não está redirecionando
**Solução**:
- Verificar se `app.base-url` está correto
- Confirmar que URL está completa no log
- Testar URL manualmente no browser

### Erro 404 ao acessar /validar-resgate

**Problema**: Página não encontrada
**Solução**:
- Verificar se arquivo está em `frontend/app/validar-resgate/[id]/page.tsx`
- Reiniciar servidor Next.js
- Verificar console do navegador

### Erro ao validar resgate

**Problema**: "Resgate já foi utilizado"
**Solução**: Normal, resgate só pode ser validado uma vez

**Problema**: "Resgate não encontrado"
**Solução**:
- Verificar se ID existe no banco
- Confirmar endpoint /api/resgates/{id}
- Verificar SecurityConfig permite acesso público

### CORS Error

**Problema**: Blocked by CORS policy
**Solução**:
```java
configuration.setAllowedOrigins(List.of(
    "http://localhost:3000"  // Adicionar origem do frontend
));
```

---

## 📄 Arquivos Criados/Modificados

### Backend (Java Spring Boot)

**Novos:**
- `config/AppProperties.java` - Configurações da aplicação
- `controller/ResgateController.java` - Endpoints públicos de validação
- `service/ResgateService.java` - Lógica de negócio de validação

**Modificados:**
- `service/EmailJSService.java` - Gera URL ao invés de código
- `config/SecurityConfig.java` - Permite acesso público a /api/resgates/**
- `resources/application.properties` - Adiciona app.base-url

### Frontend (Next.js/React)

**Novos:**
- `shared/services/resgate.service.ts` - Service para API de resgates
- `app/validar-resgate/[id]/page.tsx` - Página de validação

---

## 🎉 Conclusão

O sistema agora simula perfeitamente como seria um resgate no mundo real!

**Vantagens:**
- ✅ QR Code funcional e interativo
- ✅ Interface amigável para estabelecimentos
- ✅ Validação em tempo real
- ✅ Prevenção de fraudes (uso único)
- ✅ Notificações automáticas
- ✅ Sem necessidade de app adicional
- ✅ Funciona em qualquer dispositivo com câmera

**Próximas Melhorias:**
- [ ] Dashboard para estabelecimentos parceiros
- [ ] Estatísticas de resgates validados
- [ ] Sistema de API Keys para estabelecimentos
- [ ] QR Code com token criptografado
- [ ] Rate limiting nos endpoints públicos
- [ ] Histórico de validações com geolocalização
