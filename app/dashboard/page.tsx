'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import FirefighterCard from '@/components/FirefighterCard';
import Loading from '@/components/Loading';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Firefighter } from '@/types';
import { Crown, Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {
  const [firefighters, setFirefighters] = useState<Firefighter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFirefighters();
  }, []);

  const fetchFirefighters = async () => {
    try {
      const { data, error } = await supabase
        .from('firefighters')
        .select('*')
        .order('rating', { ascending: false });

      if (error) {
        console.error('Erro ao buscar bombeiros:', error);
        return;
      }

      setFirefighters(data || []);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <ProtectedRoute>
      <div className="min-h-screen pb-20 md:pb-8 md:pt-20">
        <Navbar />
        
        <div className="instagram-container py-8">
          {/* Stories/Premium Banner */}
          <div className="mb-8 bg-white border border-gray-300 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                  <Crown size={32} className="text-white" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-black">Seja Premium</h3>
                  <p className="text-sm text-gray-500">Destaque seu perfil nas buscas</p>
                </div>
              </div>
              <button className="btn-primary">
                Assinar
              </button>
            </div>
          </div>

          {/* Header */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-black">Bombeiros Disponíveis</h2>
            <p className="text-sm text-gray-500">Profissionais certificados perto de você</p>
          </div>

          {/* Grid de Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {firefighters.map((firefighter) => (
              <FirefighterCard key={firefighter.id} firefighter={firefighter} />
            ))}
          </div>

          {firefighters.length === 0 && (
            <div className="text-center py-16 bg-white border border-gray-300 rounded-lg">
              <Search size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-base font-semibold text-black mb-2">
                Nenhum bombeiro encontrado
              </h3>
              <p className="text-sm text-gray-500">
                Tente ajustar seus filtros de busca
              </p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
