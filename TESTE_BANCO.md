# 🔍 Teste para Verificar o Banco de Dados

## Passo 1: Verificar se as colunas existem

Vá no Supabase SQL Editor e execute:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'firefighters' 
ORDER BY column_name;
```

**Resultado esperado:** Você deve ver estas colunas:
- bio
- qualifications
- experience_years
- phone
- instagram
- linkedin

## Passo 2: Ver os dados atuais

```sql
SELECT * FROM firefighters LIMIT 1;
```

Isso mostra todos os dados de um bombeiro.

## Passo 3: Testar update manual

```sql
-- Substitua 'SEU_USER_ID' pelo seu user_id real
UPDATE firefighters 
SET bio = 'Teste de bio', phone = '11999999999'
WHERE user_id = 'SEU_USER_ID';
```

## Passo 4: Verificar políticas RLS

```sql
SELECT * FROM firefighters WHERE user_id = auth.uid();
```

Se não retornar nada, o problema é de permissão RLS.
