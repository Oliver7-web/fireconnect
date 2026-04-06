# 🔥 Guia Passo a Passo - Conectar FireConnect ao Supabase

## ✅ PASSO 1: Criar Conta no Supabase

1. Acesse: https://supabase.com
2. Clique em "Start your project"
3. Faça login com GitHub (recomendado) ou email
4. Confirme seu email se necessário

---

## ✅ PASSO 2: Criar Novo Projeto

1. No dashboard, clique em "New Project"
2. Preencha:
   - **Name**: FireConnect
   - **Database Password**: Crie uma senha forte (ANOTE!)
   - **Region**: South America (São Paulo) - mais próximo do Brasil
   - **Pricing Plan**: Free (gratuito)
3. Clique em "Create new project"
4. Aguarde 2-3 minutos (o Supabase está criando seu banco)

---

## ✅ PASSO 3: Copiar Credenciais

1. Quando o projeto estiver pronto, vá em **Settings** (ícone de engrenagem)
2. Clique em **API**
3. Copie estas informações:

   **Project URL**:
   ```
   https://seu-projeto.supabase.co
   ```

   **anon public** (API Key):
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

---

## ✅ PASSO 4: Configurar Variáveis de Ambiente

1. Abra o arquivo `.env.local` na pasta `fireconnect`
2. Cole suas credenciais:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Salve o arquivo

---

## ✅ PASSO 5: Criar Tabelas no Banco de Dados

1. No Supabase, vá em **SQL Editor** (ícone de banco de dados)
2. Clique em **New Query**
3. Cole o script abaixo e clique em **RUN**:

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

-- Criar índices para melhor performance
CREATE INDEX idx_firefighters_location ON firefighters(location);
CREATE INDEX idx_firefighters_available ON firefighters(available);
CREATE INDEX idx_firefighters_rating ON firefighters(rating DESC);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);
```

4. Você deve ver: "Success. No rows returned"

---

## ✅ PASSO 6: Configurar Autenticação

1. Vá em **Authentication** > **Providers**
2. Certifique-se que **Email** está habilitado
3. Em **Email Auth**:
   - ✅ Enable email provider
   - ✅ Confirm email (opcional - desabilite para testes)
4. Clique em **Save**

---

## ✅ PASSO 7: Configurar Políticas de Segurança (RLS)

1. Volte ao **SQL Editor**
2. Crie uma **New Query**
3. Cole e execute:

```sql
-- Habilitar RLS em todas as tabelas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE firefighters ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;

-- Políticas para visualização pública
CREATE POLICY "Todos podem ver bombeiros"
ON firefighters FOR SELECT
USING (true);

CREATE POLICY "Todos podem ver empresas"
ON companies FOR SELECT
USING (true);

CREATE POLICY "Todos podem ver avaliações"
ON reviews FOR SELECT
USING (true);

-- Políticas para usuários autenticados
CREATE POLICY "Usuários podem atualizar próprio perfil"
ON firefighters FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem ver suas mensagens"
ON messages FOR SELECT
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Usuários podem enviar mensagens"
ON messages FOR INSERT
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Usuários podem ver própria disponibilidade"
ON availability FOR SELECT
USING (true);

CREATE POLICY "Usuários podem gerenciar própria disponibilidade"
ON availability FOR ALL
USING (
  firefighter_id IN (
    SELECT id FROM firefighters WHERE user_id = auth.uid()
  )
);
```

---

## ✅ PASSO 8: Criar Buckets de Storage

1. Vá em **Storage**
2. Clique em **Create a new bucket**
3. Crie 3 buckets:

   **Bucket 1: avatars**
   - Name: `avatars`
   - Public: ✅ Sim
   - Clique em **Create bucket**

   **Bucket 2: certificates**
   - Name: `certificates`
   - Public: ❌ Não
   - Clique em **Create bucket**

   **Bucket 3: chat-files**
   - Name: `chat-files`
   - Public: ❌ Não
   - Clique em **Create bucket**

---

## ✅ PASSO 9: Configurar Políticas de Storage

1. No **SQL Editor**, nova query:

```sql
-- Políticas para avatars (público)
CREATE POLICY "Avatares são públicos"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Usuários podem fazer upload de avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Usuários podem atualizar próprio avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Políticas para certificados
CREATE POLICY "Usuários veem próprios certificados"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'certificates' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Usuários podem fazer upload de certificados"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'certificates' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Políticas para arquivos de chat
CREATE POLICY "Usuários veem arquivos de chat"
ON storage.objects FOR SELECT
USING (bucket_id = 'chat-files');

CREATE POLICY "Usuários podem fazer upload em chat"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'chat-files');
```

---

## ✅ PASSO 10: Inserir Dados de Teste

1. No **SQL Editor**, nova query:

```sql
-- Inserir usuários de teste
INSERT INTO users (id, email, type) VALUES
('11111111-1111-1111-1111-111111111111', 'carlos@bombeiro.com', 'firefighter'),
('22222222-2222-2222-2222-222222222222', 'ana@bombeiro.com', 'firefighter'),
('33333333-3333-3333-3333-333333333333', 'pedro@bombeiro.com', 'firefighter'),
('44444444-4444-4444-4444-444444444444', 'empresa@abc.com', 'company');

-- Inserir bombeiros de teste
INSERT INTO firefighters (user_id, name, location, description, rating, available, specialties) VALUES
('11111111-1111-1111-1111-111111111111', 'Carlos Silva', 'São Paulo, SP', 'Bombeiro civil com 10 anos de experiência em combate a incêndios e salvamento.', 4.8, true, ARRAY['Combate a incêndio', 'Primeiros socorros', 'Resgate em altura']),
('22222222-2222-2222-2222-222222222222', 'Ana Santos', 'Rio de Janeiro, RJ', 'Especialista em resgate e salvamento com certificação internacional.', 4.9, true, ARRAY['Resgate', 'Salvamento', 'Primeiros socorros']),
('33333333-3333-3333-3333-333333333333', 'Pedro Costa', 'Belo Horizonte, MG', 'Bombeiro profissional certificado com foco em prevenção.', 4.7, false, ARRAY['Prevenção', 'Inspeção', 'Treinamento']);

-- Inserir empresa de teste
INSERT INTO companies (user_id, name, location, description, contracts_count) VALUES
('44444444-4444-4444-4444-444444444444', 'Empresa ABC Ltda', 'São Paulo, SP', 'Empresa de eventos corporativos e industriais.', 15);

-- Inserir certificados de teste
INSERT INTO certificates (firefighter_id, name, file_url, issued_date)
SELECT id, 'Certificado de Bombeiro Civil', 'https://exemplo.com/cert1.pdf', '2020-01-15'
FROM firefighters WHERE name = 'Carlos Silva';

INSERT INTO certificates (firefighter_id, name, file_url, issued_date)
SELECT id, 'Primeiros Socorros Avançados', 'https://exemplo.com/cert2.pdf', '2021-06-20'
FROM firefighters WHERE name = 'Carlos Silva';

-- Inserir avaliações de teste
INSERT INTO reviews (firefighter_id, company_id, rating, comment, created_at)
SELECT 
  f.id,
  c.id,
  5,
  'Excelente profissional, muito competente e dedicado!',
  NOW() - INTERVAL '10 days'
FROM firefighters f, companies c
WHERE f.name = 'Carlos Silva' AND c.name = 'Empresa ABC Ltda';

INSERT INTO reviews (firefighter_id, company_id, rating, comment, created_at)
SELECT 
  f.id,
  c.id,
  4,
  'Ótimo trabalho, recomendo!',
  NOW() - INTERVAL '30 days'
FROM firefighters f, companies c
WHERE f.name = 'Carlos Silva' AND c.name = 'Empresa ABC Ltda';
```

---

## ✅ PASSO 11: Verificar se Funcionou

1. Vá em **Table Editor**
2. Clique em cada tabela e veja se os dados aparecem:
   - ✅ users (4 registros)
   - ✅ firefighters (3 registros)
   - ✅ companies (1 registro)
   - ✅ certificates (2 registros)
   - ✅ reviews (2 registros)

---

## 🎉 PRONTO! Supabase Configurado!

Agora vamos integrar com o código...

