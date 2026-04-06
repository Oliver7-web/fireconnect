'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import FirefighterCard from '@/components/FirefighterCard';
import Loading from '@/components/Loading';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Firefighter } from '@/types';
import { supabase } from '@/lib/supabase';

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    city: '',
    minRating: 0,
    available: false
  });
  const [firefighters, setFirefighters] = useState<Firefighter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    searchFirefighters();
  }, [searchTerm, filters]);

  const searchFirefighters = async () => {
    setLoading(true);
    try {
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
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  const filteredFirefighters = firefighters;

  return (
    <ProtectedRoute>
      <div className="min-h-screen pb-20 md:pb-8 md:pt-20">
        <Navbar />
      
        <div className="instagram-container py-8">
          <h1 className="text-xl font-semibold text-black mb-6">Buscar Bombeiros</h1>
          
          <div className="card mb-6">
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nome ou localização..."
                  className="input-field pl-10"
                />
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="btn-secondary px-4"
              >
                <SlidersHorizontal size={20} />
              </button>
            </div>
            
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={filters.city}
                    onChange={(e) => setFilters({...filters, city: e.target.value})}
                    placeholder="Ex: São Paulo"
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    Avaliação Mínima: {filters.minRating}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.5"
                    value={filters.minRating}
                    onChange={(e) => setFilters({...filters, minRating: parseFloat(e.target.value)})}
                    className="w-full"
                  />
                </div>
                
                <div className="flex items-end">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.available}
                      onChange={(e) => setFilters({...filters, available: e.target.checked})}
                      className="w-4 h-4 text-primary"
                    />
                    <span className="text-xs font-semibold text-gray-700">Apenas disponíveis</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-500">
              {filteredFirefighters.length} {filteredFirefighters.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFirefighters.map((firefighter) => (
              <FirefighterCard key={firefighter.id} firefighter={firefighter} />
            ))}
          </div>

          {filteredFirefighters.length === 0 && (
            <div className="text-center py-16 bg-white border border-gray-300 rounded-lg">
              <Search size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-sm text-gray-500">Nenhum bombeiro encontrado com esses critérios</p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
