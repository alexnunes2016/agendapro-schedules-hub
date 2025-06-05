
# AgendoPro SaaS - Multi-Tenant Scheduling Platform

Uma plataforma SaaS robusta e escalável para agendamento multi-tenant, desenvolvida com React, TypeScript, Supabase e Tailwind CSS.

## 🚀 Funcionalidades Principais

### Multi-Tenancy
- **Isolamento completo de dados** entre organizações
- **Subdominios personalizados** para cada tenant
- **Configurações independentes** por organização
- **Switching between tenants** para usuários com múltiplas organizações

### Sistema de Autenticação e Autorização
- **JWT Authentication** via Supabase
- **Role-Based Access Control (RBAC)** com 4 níveis:
  - `super_admin`: Acesso total ao sistema
  - `tenant_admin`: Administrador da organização
  - `professional`: Profissional prestador de serviços
  - `client`: Cliente final
- **Permission-based authorization** granular
- **Multi-factor authentication** (opcional)

### Gestão de Agendamentos
- **Calendários múltiplos** por organização
- **Agendamento online** para clientes
- **Conflito de horários** automático
- **Notificações** via email e WhatsApp
- **Prontuários médicos** integrados

### Painel de Administração
- **Dashboard do Super Admin** com métricas do sistema
- **Gestão de tenants** e usuários
- **Relatórios financeiros** e de uso
- **Monitoramento de sistema** em tempo real

## 🏗️ Arquitetura

### Frontend
- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para estilização
- **Shadcn/UI** para componentes
- **React Router** para roteamento
- **TanStack Query** para cache e sincronização

### Backend
- **Supabase** como Backend-as-a-Service
- **PostgreSQL** com Row Level Security (RLS)
- **Edge Functions** para lógica customizada
- **Real-time subscriptions** para atualizações live

### Segurança
- **Row Level Security (RLS)** no banco de dados
- **JWT tokens** seguros
- **Rate limiting** nas APIs
- **Input validation** e sanitização
- **CORS** configurado adequadamente

## 🛠️ Tecnologias Utilizadas

### Core
- React 18.3.1
- TypeScript 5.x
- Vite 5.x
- Node.js 18+

### UI/UX
- Tailwind CSS 3.x
- Shadcn/UI
- Lucide React (ícones)
- Radix UI (componentes primitivos)

### Backend & Database
- Supabase
- PostgreSQL 15+
- Edge Functions (Deno)

### Testing
- Jest
- React Testing Library
- Playwright (E2E)

### DevOps & Deployment
- Vercel/Netlify (Frontend)
- Supabase (Backend)
- GitHub Actions (CI/CD)

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Conta no Supabase

### Clone e Instalação
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/agendopro-saas.git
cd agendopro-saas

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
```

### Configuração do Supabase
1. Crie um novo projeto no [Supabase](https://supabase.com)
2. Execute as migrations do banco de dados
3. Configure as políticas RLS
4. Adicione as credenciais no arquivo `.env.local`

### Executar o Projeto
```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais

#### `tenants`
- Dados das organizações
- Configurações de plano e limites
- Personalização visual

#### `tenant_users`
- Relacionamento usuário-organização
- Roles e permissões
- Status de ativação

#### `profiles`
- Perfis de usuário
- Informações pessoais
- Configurações

#### `appointments`
- Agendamentos
- Status e metadados
- Relacionamentos com serviços

#### `services`
- Serviços oferecidos
- Preços e durações
- Configurações

#### `calendars`
- Calendários organizacionais
- Horários de funcionamento
- Disponibilidade

### Row Level Security (RLS)

Todas as tabelas implementam RLS para garantir isolamento de dados:

```sql
-- Exemplo: Política para appointments
CREATE POLICY "tenant_isolation" ON appointments
FOR ALL TO authenticated
USING (
  tenant_id IN (
    SELECT tenant_id FROM tenant_users 
    WHERE user_id = auth.uid() AND is_active = true
  )
);
```

## 🔐 Sistema de Permissões

### Roles Disponíveis

1. **Super Admin**
   - Acesso total ao sistema
   - Gestão de todos os tenants
   - Relatórios globais

2. **Tenant Admin**
   - Gestão da organização
   - Configurações e usuários
   - Relatórios organizacionais

3. **Professional**
   - Gestão de agendamentos
   - Clientes e serviços
   - Calendário pessoal

4. **Client**
   - Agendamentos próprios
   - Perfil pessoal
   - Histórico

### Implementação

```typescript
// Hook para verificação de permissões
const { hasPermission, userRole } = useTenantAuth();

// Verificação de role
if (userRole === 'super_admin') {
  // Acesso liberado
}

// Verificação de permissão específica
if (hasPermission('appointments.create')) {
  // Pode criar agendamentos
}
```

## 🧪 Testes

### Tipos de Teste

1. **Unit Tests**: Componentes e funções isoladas
2. **Integration Tests**: Fluxos completos
3. **E2E Tests**: Jornadas do usuário
4. **API Tests**: Endpoints e segurança

### Executar Testes

```bash
# Todos os testes
npm test

# Testes em modo watch
npm run test:watch

# Testes E2E
npm run test:e2e

# Coverage
npm run test:coverage
```

### Suíte de Testes Automatizada

O projeto inclui uma suíte de testes automatizada acessível via `/test-suite`:

- **Authentication Tests**: Login, logout, registros
- **Multi-Tenant Tests**: Isolamento, switching
- **Appointment Tests**: CRUD e conflitos
- **API Tests**: Rate limiting, validação

## 📊 Monitoramento e Analytics

### Métricas Coletadas

- **Usuários**: Registros, ativações, churn
- **Tenants**: Criação, upgrades, downgrades
- **Agendamentos**: Volume, conversão
- **Performance**: Tempo de resposta, erros

### Dashboard Super Admin

- Métricas em tempo real
- Gráficos de crescimento
- Distribuição de planos
- Health check do sistema

## 🚀 Deploy

### Frontend (Vercel)
```bash
# Conecte seu repositório ao Vercel
# Configure as variáveis de ambiente
# Deploy automático via GitHub
```

### Backend (Supabase)
```bash
# Migrations são aplicadas automaticamente
# Edge Functions deployadas via CLI
supabase functions deploy
```

### Variáveis de Ambiente

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key

# Optional
VITE_RESEND_API_KEY=your_resend_key
VITE_STRIPE_PUBLIC_KEY=your_stripe_key
```

## 📈 Escalabilidade

### Arquitetura Escalável

- **Serverless Functions**: Auto-scaling
- **CDN**: Assets otimizados
- **Database Pooling**: Conexões eficientes
- **Caching**: Redis para performance

### Limites por Plano

| Plano | Usuários | Agendamentos/mês | Storage |
|-------|----------|------------------|---------|
| Free | 3 | 100 | 100MB |
| Starter | 10 | 500 | 1GB |
| Professional | 50 | 2000 | 5GB |
| Enterprise | Ilimitado | Ilimitado | 50GB |

## 🔒 Segurança

### Práticas Implementadas

- **Input Validation**: Sanitização completa
- **SQL Injection**: Proteção via ORM
- **XSS**: Content Security Policy
- **CSRF**: Tokens seguros
- **Rate Limiting**: Proteção contra abuse
- **Audit Logs**: Rastreabilidade completa

### Compliance

- **LGPD**: Conformidade com dados pessoais
- **GDPR**: Para usuários europeus
- **SOC 2**: Controles de segurança
- **ISO 27001**: Gestão de segurança

## 🤝 Contribuição

### Como Contribuir

1. Fork o projeto
2. Crie uma branch feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Add: nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

### Guidelines

- Siga os padrões de código estabelecidos
- Adicione testes para novas funcionalidades
- Mantenha a documentação atualizada
- Use commits semânticos

## 📄 API Documentation

### REST Endpoints

A documentação completa da API está disponível em `/api-docs` (Swagger UI).

### Principais Endpoints

```typescript
// Authentication
POST /auth/login
POST /auth/register
POST /auth/refresh
DELETE /auth/logout

// Tenants
GET /tenants
POST /tenants
PUT /tenants/:id
DELETE /tenants/:id

// Appointments
GET /appointments
POST /appointments
PUT /appointments/:id
DELETE /appointments/:id
```

### Rate Limiting

- **Authenticated Users**: 1000 requests/hour
- **Public Endpoints**: 100 requests/hour
- **Super Admin**: Unlimited

## 📞 Suporte

### Canais de Suporte

- **Email**: suporte@agendopro.com
- **Discord**: [Servidor da Comunidade]
- **GitHub Issues**: [Link para Issues]
- **Documentação**: [Link para Docs]

### SLA

- **Uptime**: 99.9%
- **Response Time**: < 500ms (p95)
- **Support Response**: < 24h

## 📅 Roadmap

### Q1 2024
- [ ] Integração com Google Calendar
- [ ] App mobile (React Native)
- [ ] Webhooks avançados
- [ ] Relatórios customizáveis

### Q2 2024
- [ ] Integração com Stripe
- [ ] Multi-idioma (i18n)
- [ ] API GraphQL
- [ ] Machine Learning (sugestões)

### Q3 2024
- [ ] White-label completo
- [ ] Marketplace de plugins
- [ ] Videoconferência integrada
- [ ] BI avançado

## 📜 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

## 👥 Equipe

- **Tech Lead**: [Seu Nome]
- **Frontend**: [Nome do Dev]
- **Backend**: [Nome do Dev]
- **DevOps**: [Nome do Dev]
- **QA**: [Nome do Tester]

---

**AgendoPro SaaS** - Transformando a gestão de agendamentos em uma experiência excepcional para empresas de todos os tamanhos.

Para mais informações, visite nossa [documentação completa](https://docs.agendopro.com) ou entre em contato conosco.
