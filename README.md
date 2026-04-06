# 🔥 FireConnect

Rede social profissional para conectar bombeiros civis a empresas.

## 🎯 Sobre o Projeto

FireConnect é uma plataforma moderna e responsiva que facilita a conexão entre bombeiros civis e empresas que precisam de seus serviços. Com design inspirado em aplicativos como Uber, LinkedIn e Instagram, oferece uma experiência intuitiva e eficiente.

## ✨ Funcionalidades

### 🔐 Autenticação
- Login com email/senha
- Cadastro diferenciado (Bombeiro ou Empresa)
- Integração com Supabase Auth

### 🏠 Dashboard
- Feed com bombeiros disponíveis
- Cards modernos com informações essenciais
- Sistema de status (disponível/ocupado)
- Banner promocional Premium

### 👨‍🚒 Perfil do Bombeiro
- Foto de perfil
- Sistema de avaliações (estrelas)
- Localização
- Especialidades
- Certificados para download
- Botões de ação (Contratar/Mensagem)

### 🔎 Busca e Filtros
- Busca por nome ou localização
- Filtros por:
  - Cidade
  - Avaliação mínima
  - Disponibilidade
- Interface moderna com sliders

### 💬 Chat em Tempo Real
- Lista de conversas
- Interface estilo WhatsApp
- Suporte para texto, imagens e documentos
- Indicador de mensagens não lidas
- Integração com Supabase Realtime

### 📅 Agenda/Disponibilidade
- Calendário interativo
- Marcação de dias disponíveis
- Toggle de status geral
- Visualização mensal

### ⭐ Sistema de Avaliações
- Avaliações com estrelas (1-5)
- Comentários
- Histórico de avaliações

### 👑 Premium
- Destaque nas buscas
- Selo de verificado
- Estatísticas avançadas
- Tela de upgrade

## 🎨 Design

### Cores
- **Vermelho Principal**: #E53935
- **Preto**: #121212
- **Branco**: #FFFFFF

### Características
- Design moderno com cards e sombras suaves
- Totalmente responsivo (mobile-first)
- Animações suaves
- Ícones do Lucide React

## 🚀 Tecnologias

- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Supabase** - Backend (Auth, Database, Realtime)
- **Lucide React** - Ícones

## 📦 Instalação

1. Clone o repositório:
```bash
git clone <seu-repositorio>
cd fireconnect
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
Edite o arquivo `.env.local` com suas credenciais do Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
```

4. Execute o projeto:
```bash
npm run dev
```

5. Acesse no navegador:
```
http://localhost:3000
```

## 🗄️ Estrutura do Banco de Dados (Supabase)

### Tabelas Necessárias

#### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('firefighter', 'company')),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### firefighters
```sql
CREATE TABLE firefighters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  photo_url TEXT,
  location TEXT NOT NULL,
  description TEXT,
  rating DECIMAL DEFAULT 0,
  available BOOLEAN DEFAULT true,
  specialties TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### companies
```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  location TEXT NOT NULL,
  contracts_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### messages
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES users(id),
  receiver_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  type TEXT CHECK (type IN ('text', 'image', 'document')),
  file_url TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### reviews
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  firefighter_id UUID REFERENCES firefighters(id),
  company_id UUID REFERENCES companies(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### availability
```sql
CREATE TABLE availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  firefighter_id UUID REFERENCES firefighters(id),
  date DATE NOT NULL,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 📱 Páginas

- `/` - Landing page
- `/login` - Login
- `/register` - Cadastro
- `/dashboard` - Dashboard principal
- `/search` - Busca de bombeiros
- `/firefighter/[id]` - Perfil do bombeiro
- `/chat` - Lista de conversas
- `/chat/[id]` - Conversa específica
- `/availability` - Agenda/Disponibilidade
- `/profile` - Perfil do usuário

## 🔧 Próximos Passos

1. **Integrar Supabase Auth**
   - Implementar login/registro real
   - Gerenciar sessões
   - Proteger rotas

2. **Conectar ao Banco de Dados**
   - Buscar dados reais
   - Implementar CRUD completo
   - Adicionar paginação

3. **Implementar Chat em Tempo Real**
   - Usar Supabase Realtime
   - Notificações de mensagens
   - Upload de arquivos

4. **Sistema de Pagamento**
   - Integrar gateway de pagamento
   - Gerenciar assinaturas Premium

5. **Notificações Push**
   - Alertas de novas mensagens
   - Notificações de contratação

6. **Testes**
   - Testes unitários
   - Testes de integração
   - Testes E2E

## 📄 Licença

Este projeto está sob a licença MIT.

## 👥 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

---

Desenvolvido com ❤️ e 🔥
