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

-- 4. Função para verificar se bloqueio temporal expirou
CREATE OR REPLACE FUNCTION check_temp_ban_expired()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_temp_banned = true AND NEW.temp_ban_until < NOW() THEN
    NEW.is_temp_banned = false;
    NEW.temp_ban_until = NULL;
    NEW.temp_ban_reason = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Criar trigger para verificar expiração automaticamente
DROP TRIGGER IF EXISTS check_temp_ban_trigger ON users;
CREATE TRIGGER check_temp_ban_trigger
  BEFORE SELECT ON users
  FOR EACH ROW
  EXECUTE FUNCTION check_temp_ban_expired();

SELECT 'Sistema de bloqueio temporal criado com sucesso!' as status;
