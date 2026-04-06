# ⚡ Deploy Rápido na Netlify (5 minutos)

## 🎯 VERSÃO RESUMIDA

### 1️⃣ Preparar Projeto (1 min)

Os arquivos já estão prontos:
- ✅ `netlify.toml` criado
- ✅ `next.config.ts` atualizado
- ✅ `.gitignore` configurado

### 2️⃣ Subir para GitHub (2 min)

```bash
# Na pasta fireconnect, execute:

git init
git add .
git commit -m "Deploy FireConnect"
git remote add origin https://github.com/SEU_USUARIO/fireconnect.git
git branch -M main
git push -u origin main
```

**IMPORTANTE:** Substitua `SEU_USUARIO` pelo seu usuário do GitHub!

### 3️⃣ Deploy na Netlify (2 min)

1. Acesse: https://app.netlify.com
2. Clique em "Add new site" → "Import an existing project"
3. Escolha "GitHub" e selecione o repositório `fireconnect`
4. **Adicione as variáveis de ambiente:**
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://kuusbirjvjpryqlazloc.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1dXNiaXJqdmpwcnlxbGF6bG9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0MTY4ODYsImV4cCI6MjA5MDk5Mjg4Nn0.88ark12vIel0bw6AZdiqjdP61nY88uE4iqY2DqeOQVc
   ```
5. Clique em "Deploy site"
6. Aguarde 2-5 minutos

### 4️⃣ Configurar Supabase (30 seg)

1. Acesse: https://supabase.com/dashboard
2. Vá em "Authentication" → "URL Configuration"
3. Adicione sua URL Netlify em "Site URL" e "Redirect URLs"

---

## ✅ PRONTO!

Seu site estará no ar em:
```
https://seu-site.netlify.app
```

---

## 📋 CHECKLIST

- [ ] Código no GitHub
- [ ] Site na Netlify
- [ ] Variáveis de ambiente configuradas
- [ ] Supabase configurado
- [ ] Site funcionando

---

## 🔄 Para Atualizar

```bash
git add .
git commit -m "Atualização"
git push
```

A Netlify fará deploy automático!

---

**Para guia completo, veja:** `DEPLOY_NETLIFY.md`
