'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Flame, Mail, Lock, User, Building } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function Register() {
  const router = useRouter();
  const [userType, setUserType] = useState<'firefighter' | 'company'>('firefighter');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('Por favor, preencha seu nome');
      return;
    }
    
    if (password.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('🔵 Iniciando registro...');
      
      // 1. Criar usuário no Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password
      });

      if (authError) {
        console.error('❌ Erro no Auth:', authError);
        alert('Erro ao criar conta: ' + authError.message);
        setLoading(false);
        return;
      }

      if (!authData.user) {
        alert('Erro ao criar usuário');
        setLoading(false);
        return;
      }

      const userId = authData.user.id;
      console.log('✅ Auth criado. User ID:', userId);

      // Aguardar um pouco para garantir que o Auth foi criado
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 2. Criar registro na tabela users
      console.log('📝 Criando registro em users...');
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: email,
          type: userType,
          created_at: new Date().toISOString()
        });

      if (userError) {
        console.error('❌ Erro ao criar user:', userError);
        alert('Erro ao salvar dados do usuário: ' + userError.message);
        setLoading(false);
        return;
      }

      console.log('✅ User criado');

      // 3. Criar perfil específico
      if (userType === 'firefighter') {
        console.log('📝 Criando perfil de bombeiro...');
        const { error: ffError } = await supabase
          .from('firefighters')
          .insert({
            user_id: userId,
            name: name,
            location: '',
            rating: 0,
            available: true,
            specialties: [],
            description: `Olá! Sou ${name}, bombeiro civil profissional.`,
            bio: '',
            qualifications: [],
            experience_years: 0,
            phone: '',
            instagram: '',
            linkedin: '',
            created_at: new Date().toISOString()
          });
          
        if (ffError) {
          console.error('❌ Erro ao criar bombeiro:', ffError);
          alert('Erro ao criar perfil: ' + ffError.message);
          setLoading(false);
          return;
        }
        
        console.log('✅ Bombeiro criado');
      } else {
        console.log('📝 Criando perfil de empresa...');
        const { error: compError } = await supabase
          .from('companies')
          .insert({
            user_id: userId,
            name: name,
            location: '',
            contracts_count: 0,
            description: `${name} - Empresa de serviços`,
            created_at: new Date().toISOString()
          });
          
        if (compError) {
          console.error('❌ Erro ao criar empresa:', compError);
          alert('Erro ao criar perfil: ' + compError.message);
          setLoading(false);
          return;
        }
        
        console.log('✅ Empresa criada');
      }

      console.log('🎉 Registro completo!');
      alert('✅ Conta criada com sucesso! Complete seu perfil agora.');
      
      // Fazer login automático
      await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      router.push('/profile?edit=true');
    } catch (error: any) {
      console.error('❌ Erro geral:', error);
      alert('Erro ao criar conta: ' + (error.message || 'Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Flame className="text-primary" size={48} />
          </div>
          <h1 className="text-2xl font-semibold text-black" style={{ fontFamily: 'cursive' }}>
            FireConnect
          </h1>
          <p className="text-sm text-gray-500 mt-2">Crie sua conta</p>
        </div>

        <div className="card">
          <div className="flex space-x-2 mb-6">
            <button
              onClick={() => setUserType('firefighter')}
              className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all flex items-center justify-center space-x-2 ${
                userType === 'firefighter'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <User className="inline" size={18} />
              <span>Sou Bombeiro</span>
            </button>
            <button
              onClick={() => setUserType('company')}
              className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all flex items-center justify-center space-x-2 ${
                userType === 'company'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Building className="inline" size={18} />
              <span>Sou Empresa</span>
            </button>
          </div>

          {userType === 'firefighter' && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>👨‍🚒 Bombeiro Civil:</strong> Crie seu perfil profissional, mostre suas certificações e seja encontrado por empresas!
              </p>
            </div>
          )}

          {userType === 'company' && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>🏢 Empresa:</strong> Encontre bombeiros civis qualificados para seus eventos e projetos!
              </p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                {userType === 'firefighter' ? 'Nome Completo' : 'Nome da Empresa'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                placeholder={userType === 'firefighter' ? 'João Silva' : 'Empresa LTDA'}
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="seu@email.com"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full btn-primary"
              disabled={loading}
            >
              {loading ? 'Criando conta...' : 'Cadastrar'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Já tem uma conta?{' '}
              <Link href="/login" className="text-primary font-semibold hover:opacity-60">
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
