# 🔌 Guia de Integração com Supabase

Este guia mostra como substituir os dados mock por dados reais do Supabase.

## 📋 Índice
1. [Autenticação](#autenticação)
2. [Dashboard](#dashboard)
3. [Busca](#busca)
4. [Perfil](#perfil)
5. [Chat em Tempo Real](#chat-em-tempo-real)
6. [Upload de Arquivos](#upload-de-arquivos)

---

## 🔐 Autenticação

### Login (app/login/page.tsx)

Substitua o `handleLogin`:

```typescript
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert('Erro ao fazer login: ' + error.message);
    return;
  }

  router.push('/dashboard');
};
```

### Cadastro (app/register/page.tsx)

Substitua o `handleRegister`:

```typescript
const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // 1. Criar usuário no Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password
  });

  if (authError) {
    alert('Erro ao criar conta: ' + authError.message);
    return;
  }

  // 2. Criar registro na tabela users
  const { error: userError } = await supabase
    .from('users')
    .insert([
      { 
        id: authData.user?.id,
        email,
        type: userType 
      }
    ]);

  if (userError) {
    alert('Erro ao salvar dados: ' + userError.message);
    return;
  }

  // 3. Criar perfil específico
  if (userType === 'firefighter') {
    await supabase
      .from('firefighters')
      .insert([
        {
          user_id: authData.user?.id,
          name,
          location: '',
          rating: 0,
          available: true,
          specialties: []
        }
      ]);
  } else {
    await supabase
      .from('companies')
      .insert([
        {
          user_id: authData.user?.id,
          name,
          location: '',
          contracts_count: 0
        }
      ]);
  }

  router.push('/dashboard');
};
```

### Verificar Sessão

Adicione em qualquer página protegida:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function ProtectedPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
      } else {
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  if (loading) return <Loading />;

  return (
    // Seu conteúdo aqui
  );
}
```

---

## 🏠 Dashboard

### Buscar Bombeiros (app/dashboard/page.tsx)

```typescript
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Firefighter } from '@/types';

export default function Dashboard() {
  const [firefighters, setFirefighters] = useState<Firefighter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFirefighters();
  }, []);

  const fetchFirefighters = async () => {
    const { data, error } = await supabase
      .from('firefighters')
      .select('*')
      .eq('available', true)
      .order('rating', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Erro ao buscar bombeiros:', error);
      return;
    }

    setFirefighters(data || []);
    setLoading(false);
  };

  if (loading) return <Loading />;

  return (
    // Seu JSX aqui
  );
}
```

---

## 🔎 Busca

### Busca com Filtros (app/search/page.tsx)

```typescript
const searchFirefighters = async () => {
  let query = supabase
    .from('firefighters')
    .select('*');

  // Filtro de busca por nome ou localização
  if (searchTerm) {
    query = query.or(`name.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`);
  }

  // Filtro de cidade
  if (filters.city) {
    query = query.ilike('location', `%${filters.city}%`);
  }

  // Filtro de avaliação mínima
  if (filters.minRating > 0) {
    query = query.gte('rating', filters.minRating);
  }

  // Filtro de disponibilidade
  if (filters.available) {
    query = query.eq('available', true);
  }

  const { data, error } = await query.order('rating', { ascending: false });

  if (error) {
    console.error('Erro na busca:', error);
    return;
  }

  setFirefighters(data || []);
};

// Chamar ao mudar filtros
useEffect(() => {
  searchFirefighters();
}, [searchTerm, filters]);
```

---

## 👤 Perfil

### Buscar Perfil do Bombeiro (app/firefighter/[id]/page.tsx)

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function FirefighterProfile() {
  const params = useParams();
  const [firefighter, setFirefighter] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchProfile();
  }, [params.id]);

  const fetchProfile = async () => {
    // Buscar dados do bombeiro
    const { data: ffData } = await supabase
      .from('firefighters')
      .select('*')
      .eq('id', params.id)
      .single();

    setFirefighter(ffData);

    // Buscar certificados
    const { data: certData } = await supabase
      .from('certificates')
      .select('*')
      .eq('firefighter_id', params.id);

    setCertificates(certData || []);

    // Buscar avaliações com dados da empresa
    const { data: reviewData } = await supabase
      .from('reviews')
      .select(`
        *,
        companies (name)
      `)
      .eq('firefighter_id', params.id)
      .order('created_at', { ascending: false });

    setReviews(reviewData || []);
  };

  // Resto do componente...
}
```

### Atualizar Perfil (app/profile/page.tsx)

```typescript
const handleSave = async () => {
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase
    .from('firefighters')
    .update({
      name: profile.name,
      location: profile.location,
      description: profile.description,
      phone: profile.phone
    })
    .eq('user_id', user?.id);

  if (error) {
    alert('Erro ao salvar: ' + error.message);
    return;
  }

  alert('Perfil atualizado com sucesso!');
  setIsEditing(false);
};
```

---

## 💬 Chat em Tempo Real

### Configurar Realtime (app/chat/[id]/page.tsx)

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Message } from '@/types';

export default function ChatConversation() {
  const params = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Buscar mensagens existentes
    fetchMessages();

    // Configurar listener em tempo real
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${params.id}`
        },
        (payload) => {
          setMessages((current) => [...current, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [params.id]);

  const fetchMessages = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${user?.id},receiver_id.eq.${user?.id}`)
      .order('created_at', { ascending: true });

    setMessages(data || []);
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('messages')
      .insert([
        {
          sender_id: user?.id,
          receiver_id: params.id,
          content: newMessage,
          type: 'text'
        }
      ]);

    if (error) {
      console.error('Erro ao enviar mensagem:', error);
      return;
    }

    setNewMessage('');
  };

  // Resto do componente...
}
```

---

## 📤 Upload de Arquivos

### Upload de Avatar

```typescript
const uploadAvatar = async (file: File) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  // 1. Upload do arquivo
  const fileExt = file.name.split('.').pop();
  const fileName = `${user?.id}/avatar.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, { upsert: true });

  if (uploadError) {
    alert('Erro ao fazer upload: ' + uploadError.message);
    return;
  }

  // 2. Obter URL pública
  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);

  // 3. Atualizar perfil
  await supabase
    .from('firefighters')
    .update({ photo_url: data.publicUrl })
    .eq('user_id', user?.id);

  alert('Foto atualizada com sucesso!');
};
```

### Upload de Certificado

```typescript
const uploadCertificate = async (file: File, name: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${user?.id}/${Date.now()}.${fileExt}`;

  // Upload
  const { error: uploadError } = await supabase.storage
    .from('certificates')
    .upload(fileName, file);

  if (uploadError) {
    alert('Erro ao fazer upload: ' + uploadError.message);
    return;
  }

  // Obter URL
  const { data } = supabase.storage
    .from('certificates')
    .getPublicUrl(fileName);

  // Salvar no banco
  const { data: ffData } = await supabase
    .from('firefighters')
    .select('id')
    .eq('user_id', user?.id)
    .single();

  await supabase
    .from('certificates')
    .insert([
      {
        firefighter_id: ffData?.id,
        name,
        file_url: data.publicUrl,
        issued_date: new Date().toISOString()
      }
    ]);

  alert('Certificado adicionado com sucesso!');
};
```

---

## 📅 Disponibilidade

### Salvar Disponibilidade (app/availability/page.tsx)

```typescript
const saveAvailability = async () => {
  const { data: { user } } = await supabase.auth.getUser();

  // Buscar ID do bombeiro
  const { data: ffData } = await supabase
    .from('firefighters')
    .select('id')
    .eq('user_id', user?.id)
    .single();

  // Deletar disponibilidades antigas do mês
  await supabase
    .from('availability')
    .delete()
    .eq('firefighter_id', ffData?.id)
    .gte('date', `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-01`);

  // Inserir novas disponibilidades
  const availabilityData = Array.from(selectedDates).map(dateStr => ({
    firefighter_id: ffData?.id,
    date: dateStr,
    available: true
  }));

  const { error } = await supabase
    .from('availability')
    .insert(availabilityData);

  if (error) {
    alert('Erro ao salvar: ' + error.message);
    return;
  }

  alert('Disponibilidade salva com sucesso!');
};
```

---

## 🔔 Dicas Importantes

### 1. Tratamento de Erros
Sempre verifique erros:
```typescript
if (error) {
  console.error('Erro:', error);
  // Mostrar mensagem ao usuário
  return;
}
```

### 2. Loading States
Use estados de carregamento:
```typescript
const [loading, setLoading] = useState(true);

// Antes da query
setLoading(true);

// Depois da query
setLoading(false);

// No JSX
if (loading) return <Loading />;
```

### 3. Tipos TypeScript
Use os tipos definidos em `types/index.ts`:
```typescript
const [data, setData] = useState<Firefighter[]>([]);
```

### 4. Cleanup de Subscriptions
Sempre limpe subscriptions:
```typescript
useEffect(() => {
  const channel = supabase.channel('...');
  
  return () => {
    supabase.removeChannel(channel);
  };
}, []);
```

---

## ✅ Checklist de Integração

- [ ] Configurar variáveis de ambiente
- [ ] Criar tabelas no Supabase
- [ ] Implementar autenticação
- [ ] Conectar dashboard
- [ ] Implementar busca
- [ ] Conectar perfis
- [ ] Implementar chat realtime
- [ ] Adicionar upload de arquivos
- [ ] Testar todas as funcionalidades
- [ ] Adicionar tratamento de erros
- [ ] Implementar loading states

---

**Pronto!** Agora você tem um guia completo para integrar o FireConnect com o Supabase. 🔥
