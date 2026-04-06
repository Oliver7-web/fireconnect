# 🎨 Guia Visual das Telas - FireConnect

Este documento descreve visualmente cada tela do aplicativo.

---

## 🏠 Landing Page (`/`)

```
┌─────────────────────────────────────┐
│                                     │
│           🔥 (Ícone Chama)          │
│                                     │
│          FireConnect                │
│   Conectando bombeiros civis        │
│          a empresas                 │
│                                     │
│    ┌─────────┐  ┌─────────┐       │
│    │ Entrar  │  │Cadastrar│       │
│    └─────────┘  └─────────┘       │
│                                     │
└─────────────────────────────────────┘
Fundo: Gradiente vermelho
```

---

## 🔐 Login (`/login`)

```
┌─────────────────────────────────────┐
│         🔥 FireConnect              │
│      Entre na sua conta             │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 📧 Email                    │   │
│  │ seu@email.com               │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🔒 Senha                    │   │
│  │ ••••••••                    │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │         ENTRAR              │   │
│  └─────────────────────────────┘   │
│                                     │
│  Não tem conta? Cadastre-se         │
└─────────────────────────────────────┘
```

---

## 📝 Cadastro (`/register`)

```
┌─────────────────────────────────────┐
│         🔥 FireConnect              │
│        Crie sua conta               │
│                                     │
│  ┌──────────┐  ┌──────────┐        │
│  │👤Bombeiro│  │🏢Empresa │        │
│  └──────────┘  └──────────┘        │
│     (Ativo)     (Inativo)           │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Nome Completo               │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 📧 Email                    │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🔒 Senha                    │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │        CADASTRAR            │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

---

## 🏠 Dashboard (`/dashboard`)

```
┌─────────────────────────────────────┐
│ 🔥 FireConnect    🏠 🔍 💬 📅 👤  │ ← Navbar
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 👑 Seja Premium!            │   │
│  │ Destaque seu perfil         │   │
│  │ [Assinar Agora]             │   │
│  └─────────────────────────────┘   │
│                                     │
│  Bombeiros Disponíveis              │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 👤 Carlos Silva             │   │
│  │ 📍 São Paulo, SP            │   │
│  │ ⭐ 4.8  [Disponível]        │   │
│  │ [Ver Perfil] [💬]           │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 👤 Ana Santos               │   │
│  │ 📍 Rio de Janeiro, RJ       │   │
│  │ ⭐ 4.9  [Disponível]        │   │
│  │ [Ver Perfil] [💬]           │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

---

## 🔍 Busca (`/search`)

```
┌─────────────────────────────────────┐
│ 🔥 FireConnect    🏠 🔍 💬 📅 👤  │
├─────────────────────────────────────┤
│  Buscar Bombeiros                   │
│                                     │
│  ┌──────────────────────┐ ┌───┐    │
│  │ 🔍 Buscar...         │ │⚙️ │    │
│  └──────────────────────┘ └───┘    │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Filtros                     │   │
│  │ Cidade: [São Paulo]         │   │
│  │ Avaliação: ●────── 4.0      │   │
│  │ ☑ Apenas disponíveis        │   │
│  └─────────────────────────────┘   │
│                                     │
│  3 resultados encontrados           │
│                                     │
│  [Cards de bombeiros...]            │
│                                     │
└─────────────────────────────────────┘
```

---

## 👨‍🚒 Perfil do Bombeiro (`/firefighter/[id]`)

```
┌─────────────────────────────────────┐
│ ← Voltar                            │
├─────────────────────────────────────┤
│                                     │
│      ┌─────────┐                    │
│      │  Foto   │  Carlos Silva      │
│      │  Grande │  ⭐ 4.8 (15 aval.) │
│      └─────────┘  📍 São Paulo, SP  │
│                   [Disponível]      │
│                                     │
│  Bombeiro civil com 10 anos...      │
│                                     │
│  [Contratar] [💬 Mensagem]          │
│                                     │
├─────────────────────────────────────┤
│  🏆 Especialidades                  │
│  [Combate] [Primeiros Socorros]    │
│  [Resgate] [Prevenção]              │
├─────────────────────────────────────┤
│  📄 Certificados                    │
│  • Bombeiro Civil [⬇️]             │
│  • Primeiros Socorros [⬇️]         │
├─────────────────────────────────────┤
│  ⭐ Avaliações                      │
│  Empresa ABC  ⭐⭐⭐⭐⭐            │
│  "Excelente profissional!"          │
│                                     │
│  Indústria XYZ  ⭐⭐⭐⭐            │
│  "Ótimo trabalho!"                  │
└─────────────────────────────────────┘
```

---

## 💬 Lista de Conversas (`/chat`)

```
┌─────────────────────────────────────┐
│ 🔥 FireConnect    🏠 🔍 💬 📅 👤  │
├─────────────────────────────────────┤
│  Mensagens                          │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🔍 Buscar conversas...      │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 👤 Empresa ABC         [2]  │   │
│  │ Quando você pode começar?   │   │
│  │                       10:30 │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 👤 Indústria XYZ            │   │
│  │ Obrigado pelo trabalho!     │   │
│  │                       Ontem │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 👤 Carlos Silva        [1]  │   │
│  │ Estou disponível amanhã     │   │
│  │                       15/03 │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

---

## 💬 Chat Individual (`/chat/[id]`)

```
┌─────────────────────────────────────┐
│ ← 👤 Empresa ABC        [Online]    │
├─────────────────────────────────────┤
│                                     │
│              ┌──────────────────┐   │
│              │ Olá! Vi seu      │   │
│              │ perfil...        │   │
│              └──────────────────┘   │
│              10:00                  │
│                                     │
│  ┌──────────────────┐               │
│  │ Olá! Fico feliz  │               │
│  │ com o interesse  │               │
│  └──────────────────┘               │
│  10:05                              │
│                                     │
│              ┌──────────────────┐   │
│              │ Precisamos de um │   │
│              │ bombeiro civil   │   │
│              └──────────────────┘   │
│              10:10                  │
│                                     │
├─────────────────────────────────────┤
│ 📎 🖼️ [Digite mensagem...] [📤]    │
└─────────────────────────────────────┘
```

---

## 📅 Agenda (`/availability`)

```
┌─────────────────────────────────────┐
│ 🔥 FireConnect    🏠 🔍 💬 📅 👤  │
├─────────────────────────────────────┤
│  Minha Disponibilidade              │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  ◀  Março 2024  ▶           │   │
│  │                             │   │
│  │ Dom Seg Ter Qua Qui Sex Sáb │   │
│  │                  1   2   3  │   │
│  │  4   5   6   7   8   9  10  │   │
│  │ 11  12  13  14  15  16  17  │   │
│  │ 18  19  20  21  22  23  24  │   │
│  │ 25  26  27  28  29  30  31  │   │
│  │                             │   │
│  │ Dias selecionados: 5        │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │    SALVAR DISPONIBILIDADE   │   │
│  └─────────────────────────────┘   │
│                                     │
│  Status Atual                       │
│  ┌─────────────────────────────┐   │
│  │ Disponível  [●────────]     │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘

Legenda:
• Dias em vermelho = Selecionados
• Dia atual = Borda vermelha
• Clique para selecionar/desselecionar
```

---

## 👤 Perfil do Usuário (`/profile`)

```
┌─────────────────────────────────────┐
│ 🔥 FireConnect    🏠 🔍 💬 📅 👤  │
├─────────────────────────────────────┤
│                                     │
│         ┌─────────┐                 │
│         │  Foto   │ 📷              │
│         │  Avatar │                 │
│         └─────────┘                 │
│                                     │
│        Carlos Silva                 │
│        👑 Premium                   │
│                                     │
│        4.8        45                │
│      Avaliação  Trabalhos           │
│                                     │
├─────────────────────────────────────┤
│  Informações Pessoais      [✏️]    │
│                                     │
│  📧 carlos.silva@email.com          │
│  📱 (11) 98765-4321                 │
│  📍 São Paulo, SP                   │
│                                     │
│  Sobre mim:                         │
│  Bombeiro civil com 10 anos...      │
│                                     │
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐   │
│  │ 👑 Seja Premium             │   │
│  │ • Destaque nas buscas       │   │
│  │ • Selo verificado           │   │
│  │ • Estatísticas avançadas    │   │
│  │ [Assinar R$ 29,90/mês]      │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     🚪 Sair da Conta        │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

---

## 📱 Navegação (Mobile)

```
Bottom Navigation Bar:
┌─────────────────────────────────────┐
│  🏠     🔍     💬     📅     👤    │
│ Início Buscar Chat  Agenda Perfil  │
└─────────────────────────────────────┘
```

## 💻 Navegação (Desktop)

```
Top Navigation Bar:
┌─────────────────────────────────────┐
│ 🔥 FireConnect                      │
│              🏠 Início  🔍 Buscar   │
│              💬 Chat  📅 Agenda     │
│              👤 Perfil              │
└─────────────────────────────────────┘
```

---

## 🎨 Paleta de Cores

```
┌──────────┐ ┌──────────┐ ┌──────────┐
│          │ │          │ │          │
│ #E53935  │ │ #121212  │ │ #FFFFFF  │
│ Vermelho │ │  Preto   │ │  Branco  │
│          │ │          │ │          │
└──────────┘ └──────────┘ └──────────┘

Cores Secundárias:
┌──────────┐ ┌──────────┐ ┌──────────┐
│ #4CAF50  │ │ #FFC107  │ │ #F5F5F5  │
│  Verde   │ │ Amarelo  │ │  Cinza   │
│(Disponív)│ │(Premium) │ │  Claro   │
└──────────┘ └──────────┘ └──────────┘
```

---

## 🔤 Tipografia

```
Títulos Grandes:    32px - Bold
Títulos Médios:     24px - Bold
Títulos Pequenos:   18px - Semibold
Corpo de Texto:     16px - Regular
Texto Pequeno:      14px - Regular
Texto Muito Pequeno: 12px - Regular
```

---

## 📐 Espaçamentos

```
Padding Cards:      16px (p-4)
Margin entre Cards: 16px (gap-4)
Padding Botões:     12px 24px (px-6 py-3)
Border Radius:      
  - Cards: 16px (rounded-2xl)
  - Botões: 8px (rounded-lg)
  - Avatares: 50% (rounded-full)
```

---

## 🎭 Estados Visuais

### Botão Normal
```
┌─────────────┐
│   ENTRAR    │ ← Vermelho #E53935
└─────────────┘
```

### Botão Hover
```
┌─────────────┐
│   ENTRAR    │ ← Vermelho escuro #D32F2F
└─────────────┘
```

### Botão Ativo (Clique)
```
┌─────────────┐
│   ENTRAR    │ ← Escala 95%
└─────────────┘
```

### Input Focus
```
┌─────────────────┐
│ Digite aqui...  │ ← Borda vermelha
└─────────────────┘
```

---

## 📊 Componentes Especiais

### Card de Bombeiro
```
┌─────────────────────────────────┐
│ ┌───┐                           │
│ │ 👤│ Carlos Silva              │
│ └───┘ 📍 São Paulo, SP          │
│       ⭐ 4.8  [Disponível]      │
│       [Ver Perfil] [💬]         │
└─────────────────────────────────┘
Sombra: shadow-md
Hover: shadow-lg
```

### Badge de Status
```
Disponível:  [Disponível]  ← Verde
Ocupado:     [Ocupado]     ← Cinza
Premium:     [👑 Premium]  ← Amarelo
```

### Sistema de Estrelas
```
⭐⭐⭐⭐⭐ 5.0
⭐⭐⭐⭐☆ 4.0
⭐⭐⭐☆☆ 3.0
```

---

## 🔄 Animações

### Transições
- Botões: `transition-all` (200ms)
- Cards: `hover:shadow-lg` (300ms)
- Páginas: Fade in (150ms)

### Efeitos
- Botão clique: `active:scale-95`
- Loading: Bounce animation
- Hover cards: Elevação de sombra

---

## 📱 Breakpoints Responsivos

```
Mobile:     < 768px  (1 coluna)
Tablet:     768px+   (2 colunas)
Desktop:    1024px+  (3 colunas)
Wide:       1280px+  (max-width container)
```

---

## ✨ Destaques de UX

1. **Feedback Visual**
   - Loading states
   - Empty states
   - Success/Error messages

2. **Navegação Intuitiva**
   - Bottom bar (mobile)
   - Top bar (desktop)
   - Breadcrumbs onde necessário

3. **Acessibilidade**
   - Contraste adequado
   - Tamanhos de toque (44px+)
   - Labels descritivos

4. **Performance**
   - Lazy loading
   - Imagens otimizadas
   - Transições suaves

---

**Este guia visual serve como referência para manter a consistência do design em todo o aplicativo!** 🎨
