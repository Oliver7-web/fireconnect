-- ============================================
-- SCRIPT 4: CONFIGURAR STORAGE
-- Execute este script depois de criar os buckets
-- ============================================

-- Políticas para avatars (público)
CREATE POLICY "Avatares são públicos"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Usuários podem fazer upload de avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Usuários podem atualizar próprio avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Usuários podem deletar próprio avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Políticas para certificados
CREATE POLICY "Usuários veem próprios certificados"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'certificates' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Usuários podem fazer upload de certificados"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'certificates' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Usuários podem deletar próprios certificados"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'certificates' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Políticas para arquivos de chat
CREATE POLICY "Usuários veem arquivos de chat"
ON storage.objects FOR SELECT
USING (bucket_id = 'chat-files');

CREATE POLICY "Usuários podem fazer upload em chat"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'chat-files' AND auth.role() = 'authenticated');

-- Mensagem de sucesso
SELECT 'Storage configurado com sucesso!' as status;
