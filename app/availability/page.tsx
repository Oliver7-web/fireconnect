'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

export default function AvailabilityPage() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAvailability();
    }
  }, [user, currentDate]);

  const fetchAvailability = async () => {
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('type')
        .eq('id', user?.id)
        .single();

      if (userData?.type !== 'firefighter') {
        setLoading(false);
        return;
      }

      const { data: ffData } = await supabase
        .from('firefighters')
        .select('id, available')
        .eq('user_id', user?.id)
        .single();

      if (ffData) {
        setAvailable(ffData.available);

        // Buscar disponibilidade do mês atual
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        const { data: availData } = await supabase
          .from('availability')
          .select('date')
          .eq('firefighter_id', ffData.id)
          .gte('date', startOfMonth.toISOString().split('T')[0])
          .lte('date', endOfMonth.toISOString().split('T')[0])
          .eq('available', true);

        if (availData) {
          const dates = new Set(availData.map(a => a.date));
          setSelectedDates(dates);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar disponibilidade:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveAvailability = async () => {
    setSaving(true);
    try {
      const { data: ffData } = await supabase
        .from('firefighters')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (!ffData) return;

      // Atualizar status geral
      await supabase
        .from('firefighters')
        .update({ available })
        .eq('user_id', user?.id);

      // Deletar disponibilidades antigas do mês
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      await supabase
        .from('availability')
        .delete()
        .eq('firefighter_id', ffData.id)
        .gte('date', startOfMonth.toISOString().split('T')[0])
        .lte('date', endOfMonth.toISOString().split('T')[0]);

      // Inserir novas disponibilidades
      if (selectedDates.size > 0) {
        const availabilityData = Array.from(selectedDates).map(dateStr => ({
          firefighter_id: ffData.id,
          date: dateStr,
          available: true
        }));

        await supabase
          .from('availability')
          .insert(availabilityData);
      }

      alert('Disponibilidade salva com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar disponibilidade');
    } finally {
      setSaving(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const toggleDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${day}`;
    const newSelected = new Set(selectedDates);
    
    if (newSelected.has(dateStr)) {
      newSelected.delete(dateStr);
    } else {
      newSelected.add(dateStr);
    }
    
    setSelectedDates(newSelected);
  };

  const isDateSelected = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${day}`;
    return selectedDates.has(dateStr);
  };

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <ProtectedRoute>
      <div className="min-h-screen pb-20 md:pb-8 md:pt-20">
        <Navbar />
      
        <div className="instagram-container py-8">
          <h1 className="text-xl font-semibold text-black mb-6">Minha Disponibilidade</h1>
          
          <div className="card">
          <div className="flex items-center justify-between mb-6">
            <button onClick={previousMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronLeft size={24} className="text-black" />
            </button>
            
            <h2 className="text-base font-semibold text-black">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            
            <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronRight size={24} className="text-black" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2">
            {dayNames.map((day) => (
              <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {[...Array(startingDayOfWeek)].map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square"></div>
            ))}
            
            {[...Array(daysInMonth)].map((_, index) => {
              const day = index + 1;
              const isSelected = isDateSelected(day);
              const isToday = 
                day === new Date().getDate() &&
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear();
              
              return (
                <button
                  key={day}
                  onClick={() => toggleDate(day)}
                  className={`aspect-square rounded-lg flex items-center justify-center text-sm font-semibold transition-all ${
                    isSelected
                      ? 'bg-primary text-white'
                      : isToday
                      ? 'bg-red-50 text-primary border border-primary'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <CalendarIcon size={18} className="text-primary" />
              <span>
                {selectedDates.size === 0
                  ? 'Nenhuma data selecionada'
                  : `${selectedDates.size} ${selectedDates.size === 1 ? 'dia selecionado' : 'dias selecionados'}`}
              </span>
            </div>
          </div>

          <button 
            onClick={saveAvailability}
            disabled={saving}
            className="w-full btn-primary mt-6"
          >
            {saving ? 'Salvando...' : 'Salvar Disponibilidade'}
          </button>
        </div>

        <div className="mt-6 card">
          <h3 className="text-base font-semibold text-black mb-4">Status Atual</h3>
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <span className="text-sm font-semibold text-green-700">
              {available ? 'Disponível para contratação' : 'Indisponível'}
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={available}
                onChange={(e) => setAvailable(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>
      </div>
    </ProtectedRoute>
  );
}
