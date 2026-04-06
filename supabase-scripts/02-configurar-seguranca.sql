-- ============================================
-- SCRIPT 2: CONFIGURAR SEGURANÇA (RLS)
-- Execute este script depois do Script 1
-- ============================================

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

CREATE POLICY "Todos podem ver certificados"
ON certificates FOR SELECT
USING (true);

-- Políticas para usuários autenticados
CREATE POLICY "Usuários podem atualizar próprio perfil bombeiro"
ON firefighters FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar próprio perfil empresa"
ON companies FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem ver suas mensagens"
ON messages FOR SELECT
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Usuários podem enviar mensagens"
ON messages FOR INSERT
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Usuários podem atualizar mensagens recebidas"
ON messages FOR UPDATE
USING (auth.uid() = receiver_id);

CREATE POLICY "Usuários podem ver disponibilidade"
ON availability FOR SELECT
USING (true);

CREATE POLICY "Usuários podem gerenciar própria disponibilidade"
ON availability FOR ALL
USING (
  firefighter_id IN (
    SELECT id FROM firefighters WHERE user_id = auth.uid()
  )
);

-- Mensagem de sucesso
SELECT 'Segurança configurada com sucesso!' as status;
