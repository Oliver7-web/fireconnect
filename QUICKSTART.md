# ⚡ Guia Rápido - FireConnect

## 🚀 Início Rápido (5 minutos)

### 1. Instalar Dependências
```bash
cd fireconnect
npm install
```

### 2. Configurar Supabase (Básico)
Edite `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-aqui
```

### 3. Executar
```bash
npm run dev
```

### 4. Acessar
Abra: http://localhost:3000

## 🎯 Testando a Interface

### Navegação Disponível:
1. **Landing Page** (`/`) - Página inicial com botões de entrada
2. **Login** (`/login`) - Tela de login
3. **Cadastro** (`/register`) - Escolha entre Bombeiro ou Empresa
4. **Dashboard** (`/dashboard`) - Feed com bombeiros disponíveis
5. **Busca** (`/search`) - Busca com filtros avançados
6. **Perfil Bombeiro** (`/firefighter/1`) - Perfil completo
7. **Chat** (`/chat`) - Lista de conversas
8. **Agenda** (`/availability`) - Calendário de disponibilidade
9. **Perfil** (`/profile`) - Perfil do usuário

### Dados Mock
O app já vem com dados de exemplo para você testar todas as funcionalidades sem precisar configurar o banco de dados.

## 📱 Testando Responsividade

### Desktop
- Navegação no topo
- Grid de 3 colunas
- Hover effects

### Mobile
- Navegação na parte inferior
- Layout em coluna única
- Touch-friendly

**Dica**: Use as DevTools do navegador (F12) para testar diferentes tamanhos de tela.

## 🎨 Personalizando

### Cores
Edite `tailwind.config.ts`:
```typescript
colors: {
  primary: '#E53935',  // Mude para sua cor
  dark: '#121212',
  light: '#FFFFFF',
}
```

### Logo
Substitua o ícone `Flame` em:
- `app/page.tsx`
- `app/login/page.tsx`
- `app/register/page.tsx`
- `components/Navbar.tsx`

## 🔌 Próximos Passos

### Para Desenvolvimento Completo:
1. Siga o **SETUP.md** para configurar o Supabase completo
2. Implemente autenticação real
3. Conecte ao banco de dados
4. Adicione chat em tempo real

### Para Deploy:
1. **Vercel** (Recomendado):
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Netlify**:
   ```bash
   npm run build
   # Upload da pasta .next
   ```

## 🐛 Problemas Comuns

### Erro: "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erro: "Port 3000 already in use"
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill
```

### Estilos não aparecem
```bash
npm run dev
# Limpe o cache do navegador (Ctrl+Shift+R)
```

## 📚 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar produção
npm start

# Lint
npm run lint

# Verificar tipos TypeScript
npx tsc --noEmit
```

## 💡 Dicas

1. **Hot Reload**: O Next.js recarrega automaticamente ao salvar arquivos
2. **Erros**: Verifique o terminal e o console do navegador
3. **TypeScript**: Use Ctrl+Space para autocompletar
4. **Tailwind**: Use a extensão "Tailwind CSS IntelliSense" no VS Code

## 🎓 Aprendendo Mais

- **Next.js**: https://nextjs.org/learn
- **React**: https://react.dev/learn
- **Tailwind**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs

## ✅ Checklist de Funcionalidades

Interface:
- [x] Landing page
- [x] Login/Cadastro
- [x] Dashboard
- [x] Busca com filtros
- [x] Perfil do bombeiro
- [x] Chat (UI)
- [x] Calendário de disponibilidade
- [x] Perfil do usuário
- [x] Sistema de avaliações
- [x] Banner Premium
- [x] Navegação responsiva

Backend (A implementar):
- [ ] Autenticação real
- [ ] CRUD de dados
- [ ] Chat em tempo real
- [ ] Upload de arquivos
- [ ] Sistema de pagamento
- [ ] Notificações

## 🆘 Precisa de Ajuda?

1. Verifique os arquivos de documentação:
   - `README.md` - Visão geral
   - `SETUP.md` - Configuração completa
   - `ESTRUTURA.md` - Arquitetura do projeto

2. Consulte os comentários no código

3. Revise os tipos em `types/index.ts`

---

**Pronto para começar!** 🔥
