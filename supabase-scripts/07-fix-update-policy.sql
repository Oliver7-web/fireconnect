-- =====================================================
-- CORRIGIR POLÍTICA DE UPDATE PARA FIREFIGHTERS
-- =====================================================

-- Remover políticas antigas de UPDATE
DROP POLICY IF EXISTS "Usuários podem atualizar próprio perfil" ON firefighters;
DROP POLICY IF EXISTS "Users can update own firefighter profile" ON firefighters;
DROP POLICY IF EXISTS "Firefighters podem atualizar próprio perfil" ON firefighters;
DROP POLICY IF EXISTS "Bombeiros podem atualizar próprio perfil" ON firefighters;

-- Criar política correta para UPDATE
CREATE POLICY "Bombeiros podem atualizar próprio perfil"
ON firefighters FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Verificar políticas ativas
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'firefighters';
