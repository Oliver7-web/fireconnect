-- =====================================================
-- SISTEMA DE SEGUIDORES E MELHORIAS NO PERFIL
-- =====================================================

-- 1. Adicionar novos campos na tabela firefighters
ALTER TABLE firefighters 
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS qualifications TEXT[],
ADD COLUMN IF NOT EXISTS experience_years INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS instagram VARCHAR(100),
ADD COLUMN IF NOT EXISTS linkedin VARCHAR(100);

-- 2. Criar tabela de seguidores
CREATE TABLE IF NOT EXISTS followers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID NOT NULL REFERENCES firefighters(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES firefighters(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- 3. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_followers_follower ON followers(follower_id);
CREATE INDEX IF NOT EXISTS idx_followers_following ON followers(following_id);
CREATE INDEX IF NOT EXISTS idx_followers_created ON followers(created_at DESC);

-- 4. Habilitar RLS (Row Level Security)
ALTER TABLE followers ENABLE ROW LEVEL SECURITY;

-- 5. Políticas de segurança para followers

-- Qualquer um pode ver os seguidores
CREATE POLICY "Followers são públicos"
ON followers FOR SELECT
USING (true);

-- Usuários autenticados podem seguir outros
CREATE POLICY "Usuários podem seguir outros"
ON followers FOR INSERT
WITH CHECK (auth.uid() IN (
  SELECT user_id FROM firefighters WHERE id = follower_id
));

-- Usuários podem deixar de seguir
CREATE POLICY "Usuários podem deixar de seguir"
ON followers FOR DELETE
USING (auth.uid() IN (
  SELECT user_id FROM firefighters WHERE id = follower_id
));

-- 6. Função para contar seguidores
CREATE OR REPLACE FUNCTION count_followers(firefighter_id UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER
  FROM followers
  WHERE following_id = firefighter_id;
$$ LANGUAGE SQL STABLE;

-- 7. Função para contar seguindo
CREATE OR REPLACE FUNCTION count_following(firefighter_id UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER
  FROM followers
  WHERE follower_id = firefighter_id;
$$ LANGUAGE SQL STABLE;

-- 8. Função para verificar se está seguindo
CREATE OR REPLACE FUNCTION is_following(follower_firefighter_id UUID, following_firefighter_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS(
    SELECT 1
    FROM followers
    WHERE follower_id = follower_firefighter_id
    AND following_id = following_firefighter_id
  );
$$ LANGUAGE SQL STABLE;

-- 9. Atualizar dados de exemplo (opcional)
UPDATE firefighters
SET 
  bio = 'Bombeiro civil profissional com experiência em eventos corporativos e industriais. Certificado pelo Corpo de Bombeiros e sempre pronto para garantir a segurança.',
  qualifications = ARRAY['NR-23', 'Primeiros Socorros', 'Combate a Incêndio', 'Resgate em Altura'],
  experience_years = 5,
  phone = '(11) 98765-4321'
WHERE id IN (
  SELECT id FROM firefighters WHERE bio IS NULL LIMIT 3
);

-- =====================================================
-- COMANDOS ÚTEIS PARA TESTAR
-- =====================================================

-- Ver todos os seguidores de um bombeiro
-- SELECT * FROM followers WHERE following_id = 'ID_DO_BOMBEIRO';

-- Ver quem um bombeiro está seguindo
-- SELECT * FROM followers WHERE follower_id = 'ID_DO_BOMBEIRO';

-- Contar seguidores
-- SELECT count_followers('ID_DO_BOMBEIRO');

-- Verificar se está seguindo
-- SELECT is_following('ID_SEGUIDOR', 'ID_SEGUINDO');
