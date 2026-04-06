'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import Loading from '@/components/Loading';
import { Shield, CheckCircle, XCircle, Ban, Users, Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

export default function AdminPanel() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [banReason, setBanReason] = useState('');
  const [showBanModal, setShowBanModal] = useState(false);

  useEffect(() => {
    if (user) {
      checkAdmin();
    }
  }, [user]);

  const checkAdmin = async () => {
    try {
      const { data } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', user?.id)
        .single();

      if (data?.is_admin) {
        setIsAdmin(true);
        fetchUsers();
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Erro:', error);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data: usersData } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersData) {
        // Buscar dados adicionais de firefighters e companies
        const enrichedUsers = await Promise.all(
          usersData.map(async (u) => {
            if (u.type === 'firefighter') {
              const { data: ffData } = await supabase
                .from('firefighters')
                .select('name, photo_url')
                .eq('user_id', u.id)
                .single();
              return { ...u, ...(ffData || {}) };
            } else {
              const { data: compData } = await supabase
                .from('companies')
                .select('name, logo_url as photo_url')
                .eq('user_id', u.id)
                .single();
              return { ...u, ...(compData || {}) };
            }
          })
        );
        setUsers(enrichedUsers);
      }
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  const handleVerify = async (userId: string) => {
    try {
      const { error } = await supabase.rpc('verify_user', {
        target_user_id: userId,
        admin_user_id: user?.id
      });

      if (error) throw error;

      alert('✅ Usuário verificado com sucesso!');
      fetchUsers();
    } catch (error: any) {
      alert('❌ Erro: ' + error.message);
    }
  };

  const handleBan = async () => {
    if (!selectedUser || !banReason.trim()) {
      alert('Por favor, informe o motivo do banimento');
      return;
    }

    try {
      const { error } = await supabase.rpc('ban_user', {
        target_user_id: selectedUser.id,
        reason: banReason,
        admin_user_id: user?.id
      });

      if (error) throw error;

      alert('✅ Usuário banido com sucesso!');
      setShowBanModal(false);
      setBanReason('');
      setSelectedUser(null);
      fetchUsers();
    } catch (error: any) {
      alert('❌ Erro: ' + error.message);
    }
  };

  const handleUnban = async (userId: string) => {
    try {
      const { error } = await supabase.rpc('unban_user', {
        target_user_id: userId,
        admin_user_id: user?.id
      });

      if (error) throw error;

      alert('✅ Usuário desbanido com sucesso!');
      fetchUsers();
    } catch (error: any) {
      alert('❌ Erro: ' + error.message);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loading />;

  if (!isAdmin) {
    return null;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen pb-20 md:pb-8 md:pt-20 bg-gray-50">
        <Navbar />
        
        <div className="instagram-container py-8">
          <div className="card mb-6 bg-gradient-to-r from-red-500 to-red-600 text-white">
            <div className="flex items-center space-x-4">
              <Shield size={48} />
              <div>
                <h1 className="text-2xl font-bold">Painel Administrativo</h1>
                <p className="text-red-100">Gerenciamento de usuários da plataforma</p>
              </div>
            </div>
          </div>

          <div className="card mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <Search size={20} className="text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome ou email..."
                className="input-field flex-1"
              />
            </div>
            <p className="text-sm text-gray-500">
              <Users size={16} className="inline mr-1" />
              {filteredUsers.length} usuários encontrados
            </p>
          </div>

          <div className="space-y-4">
            {filteredUsers.map((u) => (
              <div key={u.id} className="card">
                <div className="flex items-start space-x-4">
                  <img
                    src={u.photo_url || '/placeholder-avatar.png'}
                    alt={u.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-base font-semibold text-black">{u.name || 'Sem nome'}</h3>
                      {u.is_admin && (
                        <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs font-semibold flex items-center">
                          <Shield size={12} className="mr-1" />
                          ADMIN
                        </span>
                      )}
                      {u.is_verified && (
                        <CheckCircle size={18} className="text-blue-500" />
                      )}
                      {u.is_banned && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-semibold">
                          BANIDO
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600">{u.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Tipo: {u.type === 'firefighter' ? 'Bombeiro' : 'Empresa'}
                    </p>
                    
                    {u.is_banned && u.banned_reason && (
                      <p className="text-xs text-red-600 mt-2">
                        Motivo: {u.banned_reason}
                      </p>
                    )}
                  </div>

                  {!u.is_admin && (
                    <div className="flex flex-col space-y-2">
                      {!u.is_verified && (
                        <button
                          onClick={() => handleVerify(u.id)}
                          className="btn-primary text-xs py-2 px-3 flex items-center"
                        >
                          <CheckCircle size={14} className="mr-1" />
                          Verificar
                        </button>
                      )}
                      
                      {!u.is_banned ? (
                        <button
                          onClick={() => {
                            setSelectedUser(u);
                            setShowBanModal(true);
                          }}
                          className="btn-secondary text-xs py-2 px-3 flex items-center text-red-600 border-red-600"
                        >
                          <Ban size={14} className="mr-1" />
                          Banir
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUnban(u.id)}
                          className="btn-primary text-xs py-2 px-3 flex items-center bg-green-600"
                        >
                          <XCircle size={14} className="mr-1" />
                          Desbanir
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal de Banimento */}
        {showBanModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-bold text-black mb-4">Banir Usuário</h2>
              <p className="text-sm text-gray-600 mb-4">
                Você está prestes a banir: <strong>{selectedUser?.name}</strong>
              </p>
              
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Motivo do banimento:
              </label>
              <textarea
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                className="input-field min-h-[100px] mb-4"
                placeholder="Descreva o motivo do banimento..."
              />
              
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowBanModal(false);
                    setBanReason('');
                    setSelectedUser(null);
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleBan}
                  className="btn-primary flex-1 bg-red-600"
                >
                  Confirmar Banimento
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
