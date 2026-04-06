-- =====================================================
-- SISTEMA DE ADMINISTRAÇÃO
-- =====================================================

-- 1. Adicionar campos de admin e verificação nas tabelas
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS banned_reason TEXT,
ADD COLUMN IF NOT EXISTS banned_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE firefighters
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;

ALTER TABLE companies
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;

-- 2. Criar tabela de logs de ações administrativas
CREATE TABLE IF NOT EXISTS admin_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL, -- 'ban', 'unban', 'verify', 'unverify', 'delete'
  target_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Criar índices
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin ON admin_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_target ON admin_logs(target_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created ON admin_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users(is_admin);
CREATE INDEX IF NOT EXISTS idx_users_is_banned ON users(is_banned);

-- 4. Habilitar RLS
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- 5. Políticas de segurança para admin_logs

-- Apenas admins podem ver logs
CREATE POLICY "Apenas admins podem ver logs"
ON admin_logs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.is_admin = true
  )
);

-- Apenas admins podem criar logs
CREATE POLICY "Apenas admins podem criar logs"
ON admin_logs FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.is_admin = true
  )
);

-- 6. Criar o SuperADM
-- IMPORTANTE: Execute este comando e guarde bem o email e senha!
-- Email: superadm@fireconnect.com
-- Senha: SuperADM@2026 (MUDE DEPOIS!)

-- Primeiro, crie o usuário no Auth do Supabase manualmente:
-- 1. Vá em Authentication > Users
-- 2. Clique em "Add user"
-- 3. Email: superadm@fireconnect.com
-- 4. Senha: SuperADM@2026
-- 5. Copie o ID do usuário criado

-- Depois, execute este comando substituindo 'USER_ID_AQUI' pelo ID real:
/*
INSERT INTO users (id, email, type, is_admin, is_verified, created_at)
VALUES (
  'USER_ID_AQUI', -- Substitua pelo ID do usuário criado no Auth
  'superadm@fireconnect.com',
  'firefighter',
  true,
  true,
  NOW()
);

INSERT INTO firefighters (user_id, name, location, description, available, rating, specialties, is_verified, created_at)
VALUES (
  'USER_ID_AQUI', -- Mesmo ID
  'Super Administrador',
  'FireConnect HQ',
  '🛡️ Administrador da plataforma FireConnect',
  false,
  5.0,
  ARRAY['Administração'],
  true,
  NOW()
);
*/

-- 7. Função para verificar se usuário é admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT is_admin FROM users WHERE id = user_id;
$$ LANGUAGE SQL STABLE;

-- 8. Função para banir usuário
CREATE OR REPLACE FUNCTION ban_user(
  target_user_id UUID,
  reason TEXT,
  admin_user_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Verificar se quem está banindo é admin
  IF NOT is_admin(admin_user_id) THEN
    RAISE EXCEPTION 'Apenas administradores podem banir usuários';
  END IF;
  
  -- Banir usuário
  UPDATE users 
  SET is_banned = true, 
      banned_reason = reason,
      banned_at = NOW()
  WHERE id = target_user_id;
  
  -- Registrar log
  INSERT INTO admin_logs (admin_id, action, target_user_id, reason)
  VALUES (admin_user_id, 'ban', target_user_id, reason);
  
  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- 9. Função para desbanir usuário
CREATE OR REPLACE FUNCTION unban_user(
  target_user_id UUID,
  admin_user_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
  IF NOT is_admin(admin_user_id) THEN
    RAISE EXCEPTION 'Apenas administradores podem desbanir usuários';
  END IF;
  
  UPDATE users 
  SET is_banned = false, 
      banned_reason = NULL,
      banned_at = NULL
  WHERE id = target_user_id;
  
  INSERT INTO admin_logs (admin_id, action, target_user_id)
  VALUES (admin_user_id, 'unban', target_user_id);
  
  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- 10. Função para verificar usuário
CREATE OR REPLACE FUNCTION verify_user(
  target_user_id UUID,
  admin_user_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
  IF NOT is_admin(admin_user_id) THEN
    RAISE EXCEPTION 'Apenas administradores podem verificar usuários';
  END IF;
  
  -- Verificar na tabela users
  UPDATE users SET is_verified = true WHERE id = target_user_id;
  
  -- Verificar na tabela firefighters ou companies
  UPDATE firefighters SET is_verified = true WHERE user_id = target_user_id;
  UPDATE companies SET is_verified = true WHERE user_id = target_user_id;
  
  INSERT INTO admin_logs (admin_id, action, target_user_id)
  VALUES (admin_user_id, 'verify', target_user_id);
  
  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Verificar resultado
SELECT 'Tabelas criadas com sucesso!' as status;
SELECT 'Agora crie o usuário SuperADM no Auth e execute os INSERTs acima' as proximo_passo;
