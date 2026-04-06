# 📁 Estrutura do Projeto FireConnect

## Visão Geral da Arquitetura

```
fireconnect/
├── app/                          # Páginas e rotas (App Router)
│   ├── page.tsx                  # Landing page
│   ├── layout.tsx                # Layout principal
│   ├── globals.css               # Estilos globais
│   ├── login/
│   │   └── page.tsx              # Página de login
│   ├── register/
│   │   └── page.tsx              # Página de cadastro
│   ├── dashboard/
│   │   └── page.tsx              # Dashboard principal
│   ├── search/
│   │   └── page.tsx              # Busca de bombeiros
│   ├── firefighter/
│   │   └── [id]/
│   │       └── page.tsx          # Perfil do bombeiro
│   ├── chat/
│   │   ├── page.tsx              # Lista de conversas
│   │   └── [id]/
│   │       └── page.tsx          # Conversa específica
│   ├── availability/
│   │   └── page.tsx              # Agenda/Disponibilidade
│   └── profile/
│       └── page.tsx              # Perfil do usuário
│
├── components/                   # Componentes reutilizáveis
│   ├── Navbar.tsx                # Barra de navegação
│   └── FirefighterCard.tsx       # Card de bombeiro
│
├── lib/                          # Bibliotecas e utilitários
│   └── supabase.ts               # Cliente Supabase
│
├── types/                        # Definições TypeScript
│   └── index.ts                  # Tipos e interfaces
│
├── public/                       # Arquivos estáticos
│   └── placeholder-avatar.png    # Avatar placeholder
│
├── .env.local                    # Variáveis de ambiente
├── tailwind.config.ts            # Configuração Tailwind
├── tsconfig.json                 # Configuração TypeScript
├── next.config.ts                # Configuração Next.js
├── package.json                  # Dependências
├── README.md                     # Documentação principal
├── SETUP.md                      # Guia de configuração
└── ESTRUTURA.md                  # Este arquivo
```

## 📄 Descrição dos Arquivos Principais

### Configuração

- **`.env.local`**: Variáveis de ambiente (URLs e chaves do Supabase)
- **`tailwind.config.ts`**: Cores personalizadas e configurações do Tailwind
- **`next.config.ts`**: Configurações do Next.js
- **`tsconfig.json`**: Configurações do TypeScript

### Páginas (app/)

#### Autenticação
- **`app/page.tsx`**: Landing page com botões de login/cadastro
- **`app/login/page.tsx`**: Formulário de login
- **`app/register/page.tsx`**: Formulário de cadastro com seleção de tipo (Bombeiro/Empresa)

#### Dashboard e Navegação
- **`app/dashboard/page.tsx`**: Feed principal com bombeiros disponíveis e banner Premium
- **`app/search/page.tsx`**: Busca avançada com filtros (cidade, avaliação, disponibilidade)

#### Perfis
- **`app/firefighter/[id]/page.tsx`**: Perfil completo do bombeiro com:
  - Informações pessoais
  - Especialidades
  - Certificados
  - Avaliações
  - Botões de ação (Contratar/Mensagem)

- **`app/profile/page.tsx`**: Perfil do usuário logado com:
  - Edição de informações
  - Estatísticas
  - Upgrade para Premium
  - Logout

#### Comunicação
- **`app/chat/page.tsx`**: Lista de conversas com busca
- **`app/chat/[id]/page.tsx`**: Interface de chat estilo WhatsApp

#### Agenda
- **`app/availability/page.tsx`**: Calendário interativo para marcar disponibilidade

### Componentes (components/)

- **`Navbar.tsx`**: Navegação responsiva (bottom bar mobile, top bar desktop)
- **`FirefighterCard.tsx`**: Card reutilizável para exibir bombeiros

### Biblioteca (lib/)

- **`supabase.ts`**: Cliente configurado do Supabase para autenticação, database e realtime

### Tipos (types/)

- **`index.ts`**: Interfaces TypeScript para:
  - User
  - Firefighter
  - Company
  - Message
  - Certificate
  - Review
  - Availability

### Estilos (app/globals.css)

Classes utilitárias customizadas:
- `.card`: Card com sombra
- `.btn-primary`: Botão vermelho principal
- `.btn-secondary`: Botão cinza secundário
- `.input-field`: Campo de input estilizado

## 🎨 Sistema de Design

### Cores
```css
primary: #E53935   /* Vermelho principal */
dark: #121212      /* Preto */
light: #FFFFFF     /* Branco */
```

### Componentes Visuais
- Cards com `rounded-xl` e `shadow-md`
- Botões com `rounded-lg` e transições suaves
- Inputs com `rounded-lg` e focus ring
- Avatares circulares
- Badges de status (disponível/ocupado)
- Sistema de estrelas para avaliações

## 🔄 Fluxo de Navegação

```
Landing (/) 
    ↓
Login/Register (/login, /register)
    ↓
Dashboard (/dashboard) ← Navbar
    ├→ Search (/search)
    ├→ Firefighter Profile (/firefighter/[id])
    ├→ Chat List (/chat)
    │   └→ Chat Conversation (/chat/[id])
    ├→ Availability (/availability)
    └→ Profile (/profile)
```

## 🔌 Integrações

### Supabase
- **Auth**: Login, registro, sessões
- **Database**: PostgreSQL com queries
- **Realtime**: Chat em tempo real
- **Storage**: Upload de fotos e documentos

### Lucide React
Ícones utilizados:
- `Flame`: Logo
- `Home`, `Search`, `MessageCircle`, `Calendar`, `User`: Navegação
- `MapPin`, `Star`, `Download`, `Send`: Ações
- `Crown`: Premium
- E muitos outros...

## 📱 Responsividade

### Mobile First
- Bottom navigation bar
- Cards em coluna única
- Formulários full-width
- Touch-friendly (botões grandes)

### Desktop
- Top navigation bar
- Grid de 2-3 colunas
- Sidebar para chat
- Hover effects

## 🚀 Próximas Implementações

### Fase 1: Backend Real
- [ ] Integrar Supabase Auth
- [ ] Conectar queries ao banco
- [ ] Implementar upload de arquivos

### Fase 2: Funcionalidades Avançadas
- [ ] Chat em tempo real
- [ ] Notificações push
- [ ] Sistema de pagamento Premium
- [ ] Geolocalização

### Fase 3: Otimizações
- [ ] Server-side rendering
- [ ] Caching de dados
- [ ] Lazy loading de imagens
- [ ] PWA (Progressive Web App)

### Fase 4: Testes
- [ ] Testes unitários (Jest)
- [ ] Testes de integração
- [ ] Testes E2E (Playwright)

## 📊 Métricas de Performance

### Objetivos
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Lighthouse Score: > 90

### Otimizações Aplicadas
- Next.js App Router (SSR/SSG)
- Tailwind CSS (CSS otimizado)
- Lazy loading de componentes
- Imagens otimizadas

## 🔒 Segurança

### Implementado
- TypeScript para type safety
- Variáveis de ambiente para secrets
- Validação de formulários

### A Implementar
- Row Level Security (RLS) no Supabase
- Rate limiting
- CSRF protection
- XSS prevention
- Input sanitization

## 📚 Recursos Adicionais

- [Documentação Next.js](https://nextjs.org/docs)
- [Documentação Supabase](https://supabase.com/docs)
- [Documentação Tailwind](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev)
