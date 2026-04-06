-- ============================================
-- SCRIPT 3: INSERIR DADOS DE TESTE
-- Execute este script depois do Script 2
-- ============================================

-- Inserir usuários de teste
INSERT INTO users (id, email, type) VALUES
('11111111-1111-1111-1111-111111111111', 'carlos@bombeiro.com', 'firefighter'),
('22222222-2222-2222-2222-222222222222', 'ana@bombeiro.com', 'firefighter'),
('33333333-3333-3333-3333-333333333333', 'pedro@bombeiro.com', 'firefighter'),
('44444444-4444-4444-4444-444444444444', 'empresa@abc.com', 'company');

-- Inserir bombeiros de teste
INSERT INTO firefighters (user_id, name, location, description, rating, available, specialties) VALUES
('11111111-1111-1111-1111-111111111111', 'Carlos Silva', 'São Paulo, SP', 'Bombeiro civil com 10 anos de experiência em combate a incêndios e salvamento. Certificado pelo Corpo de Bombeiros.', 4.8, true, ARRAY['Combate a incêndio', 'Primeiros socorros', 'Resgate em altura']),
('22222222-2222-2222-2222-222222222222', 'Ana Santos', 'Rio de Janeiro, RJ', 'Especialista em resgate e salvamento com certificação internacional. Experiência em grandes eventos.', 4.9, true, ARRAY['Resgate', 'Salvamento', 'Primeiros socorros']),
('33333333-3333-3333-3333-333333333333', 'Pedro Costa', 'Belo Horizonte, MG', 'Bombeiro profissional certificado com foco em prevenção e treinamento corporativo.', 4.7, false, ARRAY['Prevenção', 'Inspeção', 'Treinamento']);

-- Inserir empresa de teste
INSERT INTO companies (user_id, name, location, description, contracts_count) VALUES
('44444444-4444-4444-4444-444444444444', 'Empresa ABC Ltda', 'São Paulo, SP', 'Empresa de eventos corporativos e industriais. Contratamos bombeiros civis para nossos eventos.', 15);

-- Inserir certificados de teste
INSERT INTO certificates (firefighter_id, name, file_url, issued_date)
SELECT id, 'Certificado de Bombeiro Civil', 'https://exemplo.com/cert1.pdf', '2020-01-15'
FROM firefighters WHERE name = 'Carlos Silva';

INSERT INTO certificates (firefighter_id, name, file_url, issued_date)
SELECT id, 'Primeiros Socorros Avançados', 'https://exemplo.com/cert2.pdf', '2021-06-20'
FROM firefighters WHERE name = 'Carlos Silva';

INSERT INTO certificates (firefighter_id, name, file_url, issued_date)
SELECT id, 'Resgate em Altura', 'https://exemplo.com/cert3.pdf', '2019-03-10'
FROM firefighters WHERE name = 'Ana Santos';

-- Inserir avaliações de teste
INSERT INTO reviews (firefighter_id, company_id, rating, comment, created_at)
SELECT 
  f.id,
  c.id,
  5,
  'Excelente profissional, muito competente e dedicado! Recomendo fortemente.',
  NOW() - INTERVAL '10 days'
FROM firefighters f, companies c
WHERE f.name = 'Carlos Silva' AND c.name = 'Empresa ABC Ltda';

INSERT INTO reviews (firefighter_id, company_id, rating, comment, created_at)
SELECT 
  f.id,
  c.id,
  4,
  'Ótimo trabalho, pontual e profissional. Voltaremos a contratar.',
  NOW() - INTERVAL '30 days'
FROM firefighters f, companies c
WHERE f.name = 'Carlos Silva' AND c.name = 'Empresa ABC Ltda';

INSERT INTO reviews (firefighter_id, company_id, rating, comment, created_at)
SELECT 
  f.id,
  c.id,
  5,
  'Profissional excepcional! Muito preparada e atenciosa.',
  NOW() - INTERVAL '5 days'
FROM firefighters f, companies c
WHERE f.name = 'Ana Santos' AND c.name = 'Empresa ABC Ltda';

-- Mensagem de sucesso
SELECT 'Dados de teste inseridos com sucesso!' as status;
SELECT COUNT(*) as total_bombeiros FROM firefighters;
SELECT COUNT(*) as total_empresas FROM companies;
SELECT COUNT(*) as total_avaliacoes FROM reviews;
