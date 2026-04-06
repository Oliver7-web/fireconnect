-- =====================================================
-- SISTEMA DE BLOQUEIO TEMPORAL
-- =====================================================

-- 1. Adicionar campos para bloqueio temporal
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_temp_banned BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS temp_ban_until TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS temp_ban_reason TEXT;

-- 2. Função para bloqueio temporal
CREATE OR REPLACE FUNCTION temp_ban_user(
  target_user_id UUID,
  days INTEGER,
  reason TEXT,
  admin_user_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
  IF NOT is_admin(admin_user_id) THEN
    RAISE EXCEPTION 'Apenas administradores podem bloquear usuários';
  END IF;
  
  UPDATE users 
  SET is_temp_banned = true,
      temp_ban_until = NOW() + (days || ' days')::INTERVAL,
      temp_ban_reason = reason
  WHERE id = target_user_id;
  
  INSERT INTO admin_logs (admin_id, action, target_user_id, reason)
  VALUES (admin_user_id, 'temp_ban', target_user_id, reason || ' - ' || days || ' dias');
  
  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- 3. Função para remover bloqueio temporal
CREATE OR REPLACE FUNCTION remove_temp_ban(
  target_user_id UUID,
  admin_user_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
  IF NOT is_admin(admin_user_id) THEN
    RAISE EXCEPTION 'Apenas administradores podem desbloquear usuários';
  END IF;
  
  UPDATE users 
  SET is_temp_banned = false,
      temp_ban_until = NULL,
      temp_ban_reason = NULL
  WHERE id = target_user_id;
  
  INSERT INTO admin_logs (admin_id, action, target_user_id)
  VALUES (admin_user_id, 'remove_temp_ban', target_user_id);
  
  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- 4. Função para verificar se bloqueio temporal expirou (executada em consultas)
CREATE OR REPLACE FUNCTION check_and_update_temp_bans()
RETURNS void AS $$
BEGIN
  UPDATE users
  SET is_temp_banned = false,
      temp_ban_until = NULL,
      temp_ban_reason = NULL
  WHERE is_temp_banned = true 
    AND temp_ban_until < NOW();
END;
$$ LANGUAGE plpgsql;

-- 5. Não precisa de trigger, a verificação será feita na aplicação

SELECT 'Sistema de bloqueio temporal criado com sucesso!' as status;
