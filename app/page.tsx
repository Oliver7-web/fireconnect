'use client';

import { useRouter } from 'next/navigation';
import { Flame } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <Flame size={64} className="text-primary" />
        </div>
        <h1 className="text-4xl font-semibold mb-4 text-black" style={{ fontFamily: 'cursive' }}>
          FireConnect
        </h1>
        <p className="text-base text-gray-500 mb-8">
          Conectando bombeiros civis a empresas
        </p>
        <div className="space-y-3">
          <button 
            onClick={() => router.push('/login')}
            className="w-full btn-primary"
          >
            Entrar
          </button>
          <button 
            onClick={() => router.push('/register')}
            className="w-full btn-secondary"
          >
            Cadastrar
          </button>
        </div>
      </div>
    </div>
  );
}
