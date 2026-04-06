# 🚀 Guia de Deploy - FireConnect

## Opções de Deploy

### 1. Vercel (Recomendado) ⭐

A Vercel é a plataforma oficial do Next.js e oferece deploy gratuito.

#### Passo a Passo:

1. **Criar conta na Vercel**
   - Acesse: https://vercel.com
   - Faça login com GitHub

2. **Instalar Vercel CLI** (opcional)
   ```bash
   npm install -g vercel
   ```

3. **Deploy via CLI**
   ```bash
   cd fireconnect
   vercel
   ```

4. **Deploy via GitHub**
   - Faça push do código para o GitHub
   - Na Vercel, clique em "New Project"
   - Importe seu repositório
   - Configure as variáveis de ambiente
   - Clique em "Deploy"

5. **Configurar Variáveis de Ambiente**
   - No dashboard da Vercel, vá em "Settings" > "Environment Variables"
   - Adicione:
     ```
     NEXT_PUBLIC_SUPABASE_URL=sua_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave
     ```

6. **Domínio Personalizado** (opcional)
   - Vá em "Settings" > "Domains"
   - Adicione seu domínio customizado

#### Vantagens:
- ✅ Deploy automático a cada push
- ✅ Preview de branches
- ✅ SSL gratuito
- ✅ CDN global
- ✅ Otimização automática

---

### 2. Netlify

#### Passo a Passo:

1. **Criar conta**
   - Acesse: https://netlify.com

2. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

3. **Configurar Next.js**
   - Instale o plugin:
     ```bash
     npm install -D @netlify/plugin-nextjs
     ```
   
   - Crie `netlify.toml`:
     ```toml
     [[plugins]]
       package = "@netlify/plugin-nextjs"
     ```

4. **Deploy**
   - Conecte seu repositório GitHub
   - Configure variáveis de ambiente
   - Deploy!

---

### 3. Railway

#### Passo a Passo:

1. **Criar conta**
   - Acesse: https://railway.app

2. **Novo Projeto**
   - Clique em "New Project"
   - Selecione "Deploy from GitHub repo"

3. **Configurar**
   - Railway detecta Next.js automaticamente
   - Adicione variáveis de ambiente

4. **Deploy**
   - Railway faz deploy automaticamente

---

### 4. DigitalOcean App Platform

#### Passo a Passo:

1. **Criar conta**
   - Acesse: https://www.digitalocean.com

2. **Criar App**
   - Vá em "Apps" > "Create App"
   - Conecte GitHub

3. **Configurar**
   ```
   Build Command: npm run build
   Run Command: npm start
   ```

4. **Variáveis de Ambiente**
   - Adicione as variáveis do Supabase

---

### 5. AWS Amplify

#### Passo a Passo:

1. **Console AWS**
   - Acesse AWS Amplify Console

2. **Conectar Repositório**
   - Conecte GitHub/GitLab/Bitbucket

3. **Build Settings**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

---

## 📋 Checklist Pré-Deploy

### Código
- [ ] Remover console.logs desnecessários
- [ ] Verificar erros com `npm run lint`
- [ ] Testar build local: `npm run build`
- [ ] Verificar tipos TypeScript: `npx tsc --noEmit`

### Supabase
- [ ] Configurar Row Level Security (RLS)
- [ ] Criar índices no banco de dados
- [ ] Configurar políticas de storage
- [ ] Testar autenticação

### Segurança
- [ ] Variáveis de ambiente configuradas
- [ ] Secrets não commitados no Git
- [ ] CORS configurado no Supabase
- [ ] Rate limiting (se necessário)

### Performance
- [ ] Imagens otimizadas
- [ ] Lazy loading implementado
- [ ] Cache configurado
- [ ] Bundle size verificado

### SEO (opcional)
- [ ] Meta tags configuradas
- [ ] sitemap.xml
- [ ] robots.txt
- [ ] Open Graph tags

---

## 🔧 Configurações de Produção

### next.config.ts

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Otimizações de produção
  reactStrictMode: true,
  
  // Compressão
  compress: true,
  
  // Imagens
  images: {
    domains: ['seu-projeto.supabase.co'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Headers de segurança
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ];
  }
};

export default nextConfig;
```

---

## 🌐 Domínio Personalizado

### Configurar DNS

1. **Comprar domínio** (Registro.br, GoDaddy, Namecheap, etc.)

2. **Configurar DNS**
   
   Para Vercel:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **Adicionar na plataforma**
   - Vá nas configurações de domínio
   - Adicione seu domínio
   - Aguarde propagação (até 48h)

---

## 📊 Monitoramento

### Vercel Analytics
```bash
npm install @vercel/analytics
```

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Google Analytics
```typescript
// app/layout.tsx
<Script
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
  `}
</Script>
```

---

## 🐛 Troubleshooting

### Build Falha

**Erro: "Module not found"**
```bash
# Limpar cache
rm -rf .next node_modules
npm install
npm run build
```

**Erro: "Type error"**
```bash
# Verificar tipos
npx tsc --noEmit
# Corrigir erros e tentar novamente
```

### Deploy Lento

1. Verificar tamanho do bundle:
   ```bash
   npm run build
   # Verificar output
   ```

2. Otimizar imports:
   ```typescript
   // ❌ Ruim
   import { Button } from 'library';
   
   // ✅ Bom
   import Button from 'library/Button';
   ```

### Variáveis de Ambiente Não Funcionam

1. Verificar prefixo `NEXT_PUBLIC_`
2. Rebuild após adicionar variáveis
3. Verificar se estão no `.env.local` (dev) e na plataforma (prod)

---

## 📈 Otimizações Pós-Deploy

### 1. CDN
- Usar Cloudflare (gratuito)
- Configurar cache headers

### 2. Lighthouse Score
```bash
# Instalar
npm install -g lighthouse

# Rodar
lighthouse https://seu-site.com --view
```

Metas:
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

### 3. Compressão de Imagens
- Usar Next.js Image component
- Converter para WebP/AVIF
- Lazy loading

### 4. Code Splitting
- Dynamic imports
- Route-based splitting (automático no Next.js)

---

## 🔒 Segurança em Produção

### Headers de Segurança
Já configurados no `next.config.ts` acima.

### HTTPS
- Automático na Vercel/Netlify
- Let's Encrypt para servidores próprios

### Rate Limiting
Implementar no Supabase ou usar Cloudflare.

### Backup
- Backup automático do Supabase
- Backup do código no GitHub

---

## 💰 Custos Estimados

### Gratuito (Hobby)
- Vercel: Grátis
- Supabase: Grátis (500MB database, 1GB storage)
- Domínio: ~R$ 40/ano

### Produção (Pequeno)
- Vercel Pro: $20/mês
- Supabase Pro: $25/mês
- Domínio: ~R$ 40/ano
- **Total: ~$45/mês**

### Produção (Médio)
- Vercel Team: $100/mês
- Supabase Team: $599/mês
- CDN: $50/mês
- **Total: ~$750/mês**

---

## ✅ Checklist Final

Antes de ir para produção:

- [ ] Build local funciona
- [ ] Testes passam
- [ ] Variáveis de ambiente configuradas
- [ ] Domínio configurado
- [ ] SSL ativo
- [ ] Analytics configurado
- [ ] Backup configurado
- [ ] Monitoramento ativo
- [ ] Documentação atualizada
- [ ] Equipe treinada

---

**Seu FireConnect está pronto para o mundo!** 🔥🚀
