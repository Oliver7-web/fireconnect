# 🚀 Deploy FireConnect na Netlify (Grátis)

## 📋 Pré-requisitos

Antes de começar, você precisa:
- ✅ Conta no GitHub (gratuita)
- ✅ Conta na Netlify (gratuita)
- ✅ Projeto FireConnect funcionando localmente

---

## 🎯 PASSO A PASSO COMPLETO

### PARTE 1: Preparar o Projeto

#### 1.1 - Criar arquivo netlify.toml

Primeiro, vamos criar o arquivo de configuração da Netlify:

```bash
# Você está em: fireconnect/
```

Crie o arquivo `netlify.toml` na raiz do projeto com este conteúdo:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

#### 1.2 - Atualizar next.config.ts

Abra o arquivo `next.config.ts` e atualize para:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    domains: ['kuusbirjvjpryqlazloc.supabase.co'], // Seu domínio Supabase
  },
};

export default nextConfig;
```

#### 1.3 - Criar .gitignore (se não existir)

Certifique-se de que `.env.local` está no `.gitignore`:

```
# .gitignore
.next/
node_modules/
.env.local
.env*.local
.DS_Store
*.log
```

---

### PARTE 2: Subir para o GitHub

#### 2.1 - Criar repositório no GitHub

1. Acesse: https://github.com
2. Clique em "New repository" (botão verde)
3. Nome: `fireconnect`
4. Descrição: `FireConnect - Rede social para bombeiros civis`
5. Deixe como **Público** (necessário para Netlify grátis)
6. **NÃO** marque "Initialize with README"
7. Clique em "Create repository"

#### 2.2 - Inicializar Git localmente

Abra o terminal na pasta `fireconnect` e execute:

```bash
# Inicializar repositório Git
git init

# Adicionar todos os arquivos
git add .

# Fazer primeiro commit
git commit -m "Initial commit - FireConnect"

# Adicionar repositório remoto (substitua SEU_USUARIO)
git remote add origin https://github.com/SEU_USUARIO/fireconnect.git

# Enviar para GitHub
git branch -M main
git push -u origin main
```

**IMPORTANTE:** Substitua `SEU_USUARIO` pelo seu nome de usuário do GitHub!

---

### PARTE 3: Deploy na Netlify

#### 3.1 - Criar conta na Netlify

1. Acesse: https://www.netlify.com
2. Clique em "Sign up"
3. Escolha "Sign up with GitHub"
4. Autorize a Netlify a acessar sua conta GitHub

#### 3.2 - Importar projeto

1. No dashboard da Netlify, clique em "Add new site"
2. Escolha "Import an existing project"
3. Clique em "Deploy with GitHub"
4. Autorize a Netlify (se solicitado)
5. Procure e selecione o repositório `fireconnect`

#### 3.3 - Configurar build

Na tela de configuração:

**Build settings:**
- Build command: `npm run build`
- Publish directory: `.next`
- Functions directory: (deixe vazio)

**Clique em "Show advanced"** e adicione as variáveis de ambiente:

#### 3.4 - Adicionar Variáveis de Ambiente

Clique em "Add environment variables" e adicione:

```
NEXT_PUBLIC_SUPABASE_URL = https://kuusbirjvjpryqlazloc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1dXNiaXJqdmpwcnlxbGF6bG9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0MTY4ODYsImV4cCI6MjA5MDk5Mjg4Nn0.88ark12vIel0bw6AZdiqjdP61nY88uE4iqY2DqeOQVc
```

**IMPORTANTE:** Use suas próprias credenciais do Supabase!

#### 3.5 - Deploy!

1. Clique em "Deploy fireconnect"
2. Aguarde o build (2-5 minutos)
3. Quando terminar, você verá "Site is live" ✅

---

### PARTE 4: Configurar Domínio

#### 4.1 - URL Netlify (Grátis)

Sua URL será algo como:
```
https://fireconnect-abc123.netlify.app
```

#### 4.2 - Personalizar subdomínio (Grátis)

1. No dashboard do site, clique em "Domain settings"
2. Em "Custom domains", clique em "Options" → "Edit site name"
3. Escolha um nome: `fireconnect` (se disponível)
4. Sua URL será: `https://fireconnect.netlify.app`

#### 4.3 - Domínio próprio (Opcional - Pago)

Se você tem um domínio próprio:
1. Clique em "Add custom domain"
2. Digite seu domínio: `fireconnect.com`
3. Siga as instruções para configurar DNS

---

### PARTE 5: Configurar Supabase para Produção

#### 5.1 - Adicionar URL de produção no Supabase

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em "Authentication" → "URL Configuration"
4. Em "Site URL", adicione: `https://seu-site.netlify.app`
5. Em "Redirect URLs", adicione:
   ```
   https://seu-site.netlify.app/**
   https://seu-site.netlify.app/dashboard
   ```

#### 5.2 - Configurar CORS

1. No Supabase, vá em "Settings" → "API"
2. Em "CORS", adicione sua URL Netlify
3. Salve as alterações

---

## ✅ CHECKLIST FINAL

Antes de considerar concluído:

- [ ] Código no GitHub
- [ ] Site deployado na Netlify
- [ ] Variáveis de ambiente configuradas
- [ ] URL do Supabase atualizada
- [ ] Site acessível publicamente
- [ ] Login funcionando
- [ ] Cadastro funcionando
- [ ] Upload de imagens funcionando

---

## 🔧 COMANDOS ÚTEIS

### Atualizar o site (após mudanças)

```bash
# Fazer commit das mudanças
git add .
git commit -m "Descrição das mudanças"
git push

# A Netlify fará deploy automático!
```

### Ver logs de build

1. Acesse o dashboard da Netlify
2. Clique no seu site
3. Vá em "Deploys"
4. Clique no deploy mais recente
5. Veja os logs

---

## 🐛 PROBLEMAS COMUNS

### Erro: "Build failed"

**Solução:**
1. Verifique os logs de build na Netlify
2. Certifique-se de que `npm run build` funciona localmente
3. Verifique se todas as dependências estão no `package.json`

### Erro: "Page not found"

**Solução:**
1. Verifique se o `output: 'standalone'` está no `next.config.ts`
2. Verifique se o plugin Next.js está instalado na Netlify

### Erro: "Supabase connection failed"

**Solução:**
1. Verifique as variáveis de ambiente na Netlify
2. Certifique-se de que a URL do site está no Supabase
3. Verifique CORS no Supabase

### Erro: "Images not loading"

**Solução:**
1. Adicione o domínio Supabase em `next.config.ts`:
   ```typescript
   images: {
     domains: ['kuusbirjvjpryqlazloc.supabase.co'],
   }
   ```

---

## 💰 LIMITES DO PLANO GRÁTIS

### Netlify Free Tier:
- ✅ 100 GB de largura de banda/mês
- ✅ 300 minutos de build/mês
- ✅ Deploy automático do GitHub
- ✅ HTTPS grátis
- ✅ Subdomínio .netlify.app
- ❌ Sem domínio customizado (precisa pagar)

### Supabase Free Tier:
- ✅ 500 MB de banco de dados
- ✅ 1 GB de armazenamento de arquivos
- ✅ 50.000 usuários ativos/mês
- ✅ 2 GB de transferência/mês

**Isso é mais que suficiente para começar!**

---

## 🚀 PRÓXIMOS PASSOS

Após o deploy:

1. **Teste tudo:**
   - Cadastro de usuário
   - Login
   - Upload de fotos
   - Navegação entre páginas

2. **Compartilhe:**
   - Envie o link para amigos testarem
   - Peça feedback

3. **Monitore:**
   - Acompanhe os logs na Netlify
   - Verifique erros no Supabase

4. **Melhore:**
   - Adicione analytics (Google Analytics)
   - Configure SEO
   - Otimize imagens

---

## 📞 SUPORTE

### Documentação Oficial:
- Netlify: https://docs.netlify.com
- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs

### Comunidades:
- Netlify Community: https://answers.netlify.com
- Next.js Discord: https://nextjs.org/discord
- Supabase Discord: https://discord.supabase.com

---

## ✅ RESUMO RÁPIDO

```bash
# 1. Criar netlify.toml
# 2. Atualizar next.config.ts
# 3. Subir para GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/SEU_USUARIO/fireconnect.git
git push -u origin main

# 4. Conectar na Netlify
# - Importar do GitHub
# - Adicionar variáveis de ambiente
# - Deploy!

# 5. Configurar Supabase
# - Adicionar URL de produção
# - Configurar CORS

# 6. Testar!
```

---

**🎉 PARABÉNS! SEU SITE ESTÁ NO AR! 🎉**

Agora você tem o FireConnect rodando na internet, acessível para qualquer pessoa!

**URL:** https://seu-site.netlify.app
