-- =====================================================
-- LIMPAR TODOS OS DADOS DO SISTEMA
-- =====================================================

-- 1. Desabilitar RLS temporariamente
ALTER TABLE followers DISABLE ROW LEVEL SECURITY;
ALTER TABLE firefighters DISABLE ROW LEVEL SECURITY;
ALTER TABLE companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE certificates DISABLE ROW LEVEL SECURITY;
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE availability DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 2. Deletar todos os dados (em ordem por causa das foreign keys)
TRUNCATE TABLE followers CASCADE;
TRUNCATE TABLE availability CASCADE;
TRUNCATE TABLE messages CASCADE;
TRUNCATE TABLE reviews CASCADE;
TRUNCATE TABLE certificates CASCADE;
TRUNCATE TABLE firefighters CASCADE;
TRUNCATE TABLE companies CASCADE;
TRUNCATE TABLE users CASCADE;

-- 3. Reabilitar RLS
ALTER TABLE followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE firefighters ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 4. Verificar que está tudo vazio
SELECT 'users' as tabela, COUNT(*) as total FROM users
UNION ALL
SELECT 'firefighters' as tabela, COUNT(*) as total FROM firefighters
UNION ALL
SELECT 'companies' as tabela, COUNT(*) as total FROM companies
UNION ALL
SELECT 'followers' as tabela, COUNT(*) as total FROM followers;

-- Pronto! Agora você pode criar uma conta nova do zero.
