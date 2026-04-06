-- Script para verificar se as colunas foram criadas corretamente

-- Verificar colunas da tabela firefighters
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'firefighters' 
AND column_name IN ('bio', 'qualifications', 'experience_years', 'phone', 'instagram', 'linkedin')
ORDER BY column_name;

-- Verificar se a tabela followers existe
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'followers'
);

-- Ver um exemplo de dados de um bombeiro
SELECT id, name, bio, qualifications, experience_years, phone, instagram, linkedin
FROM firefighters
LIMIT 1;
