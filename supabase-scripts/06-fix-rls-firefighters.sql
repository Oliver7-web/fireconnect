-- =====================================================
-- CORRIGIR POLÍTICAS RLS PARA FIREFIGHTERS
-- =====================================================

-- Remover políticas antigas que podem estar bloqueando
DROP POLICY IF EXISTS "Usuários podem atualizar próprio perfil" ON firefighters;
DROP POLICY IF EXISTS "Users can update own firefighter profile" ON firefighters;
DROP POLICY IF EXISTS "Firefighters podem atualizar próprio perfil" ON firefighters;

-- Criar política correta para UPDATE
CREATE POLICY "Bombeiros podem atualizar próprio perfil"
ON firefighters FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Verificar se a política de SELECT existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'firefighters' 
    AND policyname LIKE '%SELECT%'
  ) THEN
    CREATE POLICY "Todos podem ver bombeiros"
    ON firefighters FOR SELECT
    USING (true);
  END IF;
END $$;

-- Verificar políticas ativas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'firefighters';
