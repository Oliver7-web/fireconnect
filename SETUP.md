# 🚀 Guia de Configuração do FireConnect

## Passo 1: Configurar o Supabase

### 1.1 Criar Projeto no Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta ou faça login
3. Clique em "New Project"
4. Preencha os dados:
   - Nome: FireConnect
   - Database Password: (escolha uma senha forte)
   - Region: (escolha a mais próxima)

### 1.2 Obter Credenciais
1. No dashboard do projeto, vá em "Settings" > "API"
2. Copie:
   - `Project URL` → NEXT_PUBLIC_SUPABASE_URL
   - `anon public` key → NEXT_PUBLIC_SUPABASE_ANON_KEY

### 1.3 Configurar Variáveis de Ambiente
Edite o arquivo `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-aqui
```

## Passo 2: Criar Tabelas no Banco de Dados

### 2.1 Acessar SQL Editor
1. No Supabase, vá em "SQL Editor"
2. Clique em "New Query"

### 2.2 Executar Scripts SQL

Execute os seguintes comandos em ordem:

```sql
-- Habilitar extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de usuários
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('firefighter', 'company')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de bombeiros
CREATE TABLE firefighters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  photo_url TEXT,
  location TEXT NOT NULL,
  description TEXT,
  rating DECIMAL DEFAULT 0,
  available BOOLEAN DEFAULT true,
  specialties TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de empresas
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  location TEXT NOT NULL,
  contracts_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de certificados
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  firefighter_id UUID REFERENCES firefighters(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  issued_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de mensagens
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  type TEXT CHECK (type IN ('text', 'image', 'document')),
  file_url TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de avaliações
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  firefighter_id UUID REFERENCES firefighters(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de disponibilidade
CREATE TABLE availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  firefighter_id UUID REFERENCES firefighters(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(firefighter_id, date)
);

-- Índices para melhor performance
CREATE INDEX idx_firefighters_location ON firefighters(location);
CREATE INDEX idx_firefighters_available ON firefighters(available);
CREATE INDEX idx_firefighters_rating ON firefighters(rating DESC);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);
```

## Passo 3: Configurar Row Level Security (RLS)

```sql
-- Habilitar RLS em todas as tabelas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE firefighters ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;

-- Políticas para usuários autenticados
CREATE POLICY "Users can view all profiles" ON firefighters FOR SELECT USING (true);
CREATE POLICY "Users can view all companies" ON companies FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON firefighters FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can view messages" ON messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
```

## Passo 4: Configurar Storage (para fotos e documentos)

### 4.1 Criar Buckets
1. No Supabase, vá em "Storage"
2. Crie os seguintes buckets:
   - `avatars` (público)
   - `certificates` (privado)
   - `chat-files` (privado)

### 4.2 Configurar Políticas de Storage

```sql
-- Políticas para avatars (público)
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Políticas para certificados
CREATE POLICY "Users can view their own certificates"
ON storage.objects FOR SELECT
USING (bucket_id = 'certificates' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own certificates"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'certificates' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## Passo 5: Configurar Autenticação

### 5.1 Habilitar Provedores
1. No Supabase, vá em "Authentication" > "Providers"
2. Habilite "Email"
3. Configure as opções:
   - Enable email confirmations: Sim/Não (conforme preferência)
   - Enable email change confirmations: Sim

### 5.2 Configurar Email Templates (opcional)
1. Vá em "Authentication" > "Email Templates"
2. Personalize os templates de:
   - Confirmação de email
   - Recuperação de senha
   - Mudança de email

## Passo 6: Inserir Dados de Teste

```sql
-- Inserir usuários de teste
INSERT INTO users (id, email, type) VALUES
('11111111-1111-1111-1111-111111111111', 'carlos@bombeiro.com', 'firefighter'),
('22222222-2222-2222-2222-222222222222', 'ana@bombeiro.com', 'firefighter'),
('33333333-3333-3333-3333-333333333333', 'empresa@abc.com', 'company');

-- Inserir bombeiros de teste
INSERT INTO firefighters (user_id, name, location, description, rating, available, specialties) VALUES
('11111111-1111-1111-1111-111111111111', 'Carlos Silva', 'São Paulo, SP', 'Bombeiro civil com 10 anos de experiência', 4.8, true, ARRAY['Combate a incêndio', 'Primeiros socorros']),
('22222222-2222-2222-2222-222222222222', 'Ana Santos', 'Rio de Janeiro, RJ', 'Especialista em resgate', 4.9, true, ARRAY['Resgate', 'Salvamento']);

-- Inserir empresa de teste
INSERT INTO companies (user_id, name, location, description, contracts_count) VALUES
('33333333-3333-3333-3333-333333333333', 'Empresa ABC', 'São Paulo, SP', 'Empresa de eventos corporativos', 15);
```

## Passo 7: Testar a Aplicação

1. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

2. Acesse: `http://localhost:3000`

3. Teste as funcionalidades:
   - ✅ Cadastro de usuário
   - ✅ Login
   - ✅ Visualização do dashboard
   - ✅ Busca de bombeiros
   - ✅ Visualização de perfil
   - ✅ Chat (após implementar Realtime)

## Passo 8: Implementar Funcionalidades Reais

### 8.1 Autenticação Real
Edite `app/login/page.tsx` e `app/register/page.tsx` para usar:
```typescript
import { supabase } from '@/lib/supabase';

// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password
});

// Registro
const { data, error } = await supabase.auth.signUp({
  email,
  password
});
```

### 8.2 Buscar Dados Reais
Substitua os dados mock por queries reais:
```typescript
const { data: firefighters, error } = await supabase
  .from('firefighters')
  .select('*')
  .eq('available', true)
  .order('rating', { ascending: false });
```

### 8.3 Chat em Tempo Real
```typescript
const channel = supabase
  .channel('messages')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'messages' },
    (payload) => {
      // Atualizar UI com nova mensagem
    }
  )
  .subscribe();
```

## 🎉 Pronto!

Seu FireConnect está configurado e pronto para uso!

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do Supabase
2. Confira as variáveis de ambiente
3. Revise as políticas de RLS
4. Consulte a documentação do Supabase: https://supabase.com/docs
