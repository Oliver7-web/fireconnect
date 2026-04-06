-- ============================================
-- SCRIPT 1: CRIAR TABELAS
-- Execute este script primeiro no SQL Editor
-- ============================================

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

-- Mensagem de sucesso
SELECT 'Tabelas criadas com sucesso!' as status;
