# ⚡ Comandos Úteis - FireConnect

Referência rápida de comandos para desenvolvimento.

---

## 🚀 Desenvolvimento

### Iniciar servidor de desenvolvimento
```bash
npm run dev
```
Acesse: http://localhost:3000

### Build de produção
```bash
npm run build
```

### Iniciar em modo produção
```bash
npm start
```

### Verificar erros de lint
```bash
npm run lint
```

### Corrigir erros de lint automaticamente
```bash
npm run lint -- --fix
```

---

## 📦 Gerenciamento de Pacotes

### Instalar dependências
```bash
npm install
```

### Adicionar nova dependência
```bash
npm install nome-do-pacote
```

### Adicionar dependência de desenvolvimento
```bash
npm install -D nome-do-pacote
```

### Remover dependência
```bash
npm uninstall nome-do-pacote
```

### Atualizar dependências
```bash
npm update
```

### Verificar pacotes desatualizados
```bash
npm outdated
```

### Limpar cache e reinstalar
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 🔍 TypeScript

### Verificar tipos sem compilar
```bash
npx tsc --noEmit
```

### Verificar tipos em modo watch
```bash
npx tsc --noEmit --watch
```

### Gerar declarações de tipos
```bash
npx tsc --declaration --emitDeclarationOnly
```

---

## 🎨 Tailwind CSS

### Gerar arquivo de configuração
```bash
npx tailwindcss init
```

### Build CSS manualmente
```bash
npx tailwindcss -i ./app/globals.css -o ./dist/output.css
```

### Build CSS em modo watch
```bash
npx tailwindcss -i ./app/globals.css -o ./dist/output.css --watch
```

---

## 🗄️ Supabase

### Instalar Supabase CLI
```bash
npm install -g supabase
```

### Login no Supabase
```bash
supabase login
```

### Inicializar projeto local
```bash
supabase init
```

### Iniciar Supabase local
```bash
supabase start
```

### Parar Supabase local
```bash
supabase stop
```

### Gerar tipos TypeScript do banco
```bash
supabase gen types typescript --project-id seu-projeto > types/supabase.ts
```

### Aplicar migrations
```bash
supabase db push
```

### Criar nova migration
```bash
supabase migration new nome-da-migration
```

---

## 🧪 Testes (Quando implementados)

### Rodar todos os testes
```bash
npm test
```

### Rodar testes em modo watch
```bash
npm test -- --watch
```

### Rodar testes com coverage
```bash
npm test -- --coverage
```

### Rodar teste específico
```bash
npm test -- nome-do-arquivo
```

---

## 📊 Análise e Debug

### Analisar bundle size
```bash
npm run build
# Verificar output no terminal
```

### Verificar performance com Lighthouse
```bash
npm install -g lighthouse
lighthouse http://localhost:3000 --view
```

### Debug com Node Inspector
```bash
NODE_OPTIONS='--inspect' npm run dev
```

---

## 🔧 Git

### Inicializar repositório
```bash
git init
```

### Adicionar arquivos
```bash
git add .
```

### Commit
```bash
git commit -m "Mensagem do commit"
```

### Push para GitHub
```bash
git push origin main
```

### Criar nova branch
```bash
git checkout -b nome-da-branch
```

### Mudar de branch
```bash
git checkout nome-da-branch
```

### Ver status
```bash
git status
```

### Ver histórico
```bash
git log --oneline
```

---

## 🚀 Deploy

### Deploy na Vercel (CLI)
```bash
npm install -g vercel
vercel
```

### Deploy de produção na Vercel
```bash
vercel --prod
```

### Build e preview local
```bash
npm run build
npm start
```

---

## 🧹 Limpeza

### Limpar cache do Next.js
```bash
rm -rf .next
```

### Limpar node_modules
```bash
rm -rf node_modules
```

### Limpar tudo e reinstalar
```bash
rm -rf .next node_modules package-lock.json
npm install
```

### Limpar cache do npm
```bash
npm cache clean --force
```

---

## 📱 Desenvolvimento Mobile

### Testar em dispositivo móvel (mesma rede)
```bash
npm run dev
# Acesse: http://seu-ip-local:3000
```

### Descobrir seu IP local (Windows)
```bash
ipconfig
```

### Descobrir seu IP local (Mac/Linux)
```bash
ifconfig
```

---

## 🔐 Variáveis de Ambiente

### Criar arquivo .env.local
```bash
echo "NEXT_PUBLIC_SUPABASE_URL=sua_url" > .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave" >> .env.local
```

### Verificar variáveis carregadas
```bash
# No código:
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
```

---

## 📦 Scripts Personalizados

Adicione ao `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "format": "prettier --write .",
    "clean": "rm -rf .next node_modules",
    "reinstall": "npm run clean && npm install"
  }
}
```

---

## 🐛 Troubleshooting

### Porta 3000 em uso
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill
```

### Erro de permissão (Mac/Linux)
```bash
sudo npm install
```

### Erro de módulo não encontrado
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build falha
```bash
# Limpar e tentar novamente
rm -rf .next
npm run build
```

---

## 📚 Comandos de Documentação

### Gerar documentação de tipos
```bash
npx typedoc --out docs types/
```

### Servir documentação localmente
```bash
npx http-server docs
```

---

## 🔄 Atualização de Dependências

### Atualizar Next.js
```bash
npm install next@latest react@latest react-dom@latest
```

### Atualizar Tailwind
```bash
npm install -D tailwindcss@latest
```

### Atualizar Supabase
```bash
npm install @supabase/supabase-js@latest
```

### Atualizar todas as dependências (cuidado!)
```bash
npm update --save
```

---

## 🎯 Comandos Rápidos

### Setup inicial completo
```bash
npm install && npm run dev
```

### Limpar e reiniciar
```bash
rm -rf .next node_modules && npm install && npm run dev
```

### Build e testar produção
```bash
npm run build && npm start
```

### Verificar tudo antes de commit
```bash
npm run lint && npm run type-check && npm run build
```

---

## 💡 Dicas

### Usar variáveis de ambiente em desenvolvimento
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Rodar múltiplos comandos
```bash
npm run lint && npm run build
```

### Rodar comando em background (Linux/Mac)
```bash
npm run dev &
```

### Ver logs em tempo real
```bash
npm run dev | tee dev.log
```

---

## 🔗 Links Úteis

- Next.js Docs: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs
- Tailwind Docs: https://tailwindcss.com/docs
- TypeScript Docs: https://www.typescriptlang.org/docs

---

**Salve este arquivo para referência rápida durante o desenvolvimento!** ⚡
