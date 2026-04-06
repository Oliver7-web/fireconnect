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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // 1. Criar usuário no Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password
      });

      if (authError) {
        alert('Erro ao criar conta: ' + authError.message);
        return;
      }

      if (!authData.user) {
        alert('Erro ao criar usuário');
        return;
      }

      // 2. Criar registro na tabela users
      const { error: userError } = await supabase
        .from('users')
        .insert([
          { 
            id: authData.user.id,
            email,
            type: userType 
          }
        ]);

      if (userError) {
        console.error('Erro ao salvar dados:', userError);
      }

      // 3. Criar perfil específico
      if (userType === 'firefighter') {
        await supabase
          .from('firefighters')
          .insert([
            {
              user_id: authData.user.id,
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
              user_id: authData.user.id,
              name,
              location: '',
              contracts_count: 0
            }
          ]);
      }

      alert('Conta criada com sucesso!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao criar conta');
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
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                userType === 'firefighter'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              <User className="inline mr-1" size={16} />
              Bombeiro
            </button>
            <button
              onClick={() => setUserType('company')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                userType === 'company'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              <Building className="inline mr-1" size={16} />
              Empresa
            </button>
          </div>

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
                />
              </div>
            </div>

            <button type="submit" className="w-full btn-primary">
              Cadastrar
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
