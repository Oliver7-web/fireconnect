'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import Loading from '@/components/Loading';
import { MapPin, Star, Download, MessageCircle, ArrowLeft, Award, UserPlus, UserMinus, Phone, Link, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function FirefighterProfile() {
  const router = useRouter();
  const params = useParams();
  const [firefighter, setFirefighter] = useState<any>(null);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentFirefighterId, setCurrentFirefighterId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminAction, setAdminAction] = useState<'temp_ban' | 'permanent_ban' | null>(null);
  const [banReason, setBanReason] = useState('');
  const [banDays, setBanDays] = useState(7);

  useEffect(() => {
    if (params.id) {
      fetchCurrentUser();
      fetchProfile();
    }
  }, [params.id]);

  const fetchCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setCurrentUserId(user.id);
      
      // Verificar se é admin
      const { data: userData } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', user.id)
        .single();
      
      setIsAdmin(userData?.is_admin || false);
      
      // Buscar ID do firefighter do usuário atual
      const { data: ffData } = await supabase
        .from('firefighters')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (ffData) {
        setCurrentFirefighterId(ffData.id);
      }
    }
  };

  const fetchProfile = async () => {
    try {
      // Buscar dados do bombeiro
      const { data: ffData, error: ffError } = await supabase
        .from('firefighters')
        .select('*')
        .eq('id', params.id)
        .single();

      if (ffError) {
        console.error('Erro ao buscar bombeiro:', ffError);
        return;
      }

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
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (firefighter && currentFirefighterId) {
      fetchFollowData();
    }
  }, [firefighter, currentFirefighterId]);

  const fetchFollowData = async () => {
    try {
      // Contar seguidores
      const { data: followersData } = await supabase
        .from('followers')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', params.id);
      
      setFollowersCount(followersData?.length || 0);

      // Contar seguindo
      const { data: followingData } = await supabase
        .from('followers')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', params.id);
      
      setFollowingCount(followingData?.length || 0);

      // Verificar se está seguindo
      if (currentFirefighterId && currentFirefighterId !== params.id) {
        const { data: followData } = await supabase
          .from('followers')
          .select('*')
          .eq('follower_id', currentFirefighterId)
          .eq('following_id', params.id)
          .single();
        
        setIsFollowing(!!followData);
      }
    } catch (error) {
      console.error('Erro ao buscar dados de seguidores:', error);
    }
  };

  const handleFollowToggle = async () => {
    if (!currentFirefighterId || currentFirefighterId === params.id) return;

    try {
      if (isFollowing) {
        // Deixar de seguir
        await supabase
          .from('followers')
          .delete()
          .eq('follower_id', currentFirefighterId)
          .eq('following_id', params.id);
        
        setIsFollowing(false);
        setFollowersCount(prev => prev - 1);
      } else {
        // Seguir
        await supabase
          .from('followers')
          .insert({
            follower_id: currentFirefighterId,
            following_id: params.id
          });
        
        setIsFollowing(true);
        setFollowersCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Erro ao seguir/deixar de seguir:', error);
      alert('Erro ao processar ação. Tente novamente.');
    }
  };

  const handleAdminAction = async () => {
    if (!banReason.trim()) {
      alert('Por favor, informe o motivo');
      return;
    }

    try {
      if (adminAction === 'temp_ban') {
        const { error } = await supabase.rpc('temp_ban_user', {
          target_user_id: firefighter.user_id,
          days: banDays,
          reason: banReason,
          admin_user_id: currentUserId
        });

        if (error) throw error;
        alert(`✅ Usuário bloqueado por ${banDays} dias!`);
      } else if (adminAction === 'permanent_ban') {
        const { error } = await supabase.rpc('ban_user', {
          target_user_id: firefighter.user_id,
          reason: banReason,
          admin_user_id: currentUserId
        });

        if (error) throw error;
        alert('✅ Usuário banido permanentemente!');
      }

      setShowAdminModal(false);
      setBanReason('');
      setAdminAction(null);
      router.push('/admin');
    } catch (error: any) {
      alert('❌ Erro: ' + error.message);
    }
  };

  if (loading) return <Loading />;
  if (!firefighter) return (
    <ProtectedRoute>
      <div className="min-h-screen pb-20 md:pb-8 md:pt-20">
        <Navbar />
        <div className="instagram-container py-8">
          <div className="card text-center">
            <p className="text-gray-500">Bombeiro não encontrado</p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen pb-20 md:pb-8 md:pt-20">
      <Navbar />
      
      <div className="instagram-container py-8">
        <button 
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-black mb-6 text-sm font-semibold"
        >
          <ArrowLeft size={20} className="mr-2" />
          Voltar
        </button>

        <div className="card mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className={firefighter.available ? 'avatar-ring' : 'avatar-ring-simple'}>
              <img 
                src={firefighter.photo_url || '/placeholder-avatar.png'} 
                alt={firefighter.name}
                className="w-32 h-32 rounded-full object-cover bg-white"
              />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-semibold text-black">{firefighter.name}</h1>
                  {firefighter.is_verified && (
                    <CheckCircle size={24} className="text-blue-500" title="Verificado" />
                  )}
                </div>
                <span className={`mt-2 md:mt-0 badge ${
                  firefighter.available ? 'badge-success' : 'badge-gray'
                }`}>
                  {firefighter.available ? 'Disponível' : 'Ocupado'}
                </span>
              </div>
              
              <div className="flex items-center justify-center md:justify-start text-gray-500 mb-2 text-sm">
                <MapPin size={16} className="mr-1" />
                <span>{firefighter.location}</span>
              </div>
              
              <div className="flex items-center justify-center md:justify-start space-x-6 mb-4">
                <div className="text-center">
                  <p className="text-lg font-semibold text-black">{Number(firefighter.rating).toFixed(1)}</p>
                  <p className="text-xs text-gray-500">Avaliação</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-black">{followersCount}</p>
                  <p className="text-xs text-gray-500">Seguidores</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-black">{followingCount}</p>
                  <p className="text-xs text-gray-500">Seguindo</p>
                </div>
                {firefighter.experience_years > 0 && (
                  <div className="text-center">
                    <p className="text-lg font-semibold text-black">{firefighter.experience_years}</p>
                    <p className="text-xs text-gray-500">Anos Exp.</p>
                  </div>
                )}
              </div>
              
              {firefighter.bio && (
                <p className="text-sm text-gray-700 mb-4 italic">{firefighter.bio}</p>
              )}
              
              <p className="text-sm text-gray-700 mb-6">{firefighter.description}</p>
              
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                {currentFirefighterId && currentFirefighterId !== params.id && (
                  <>
                    <button 
                      onClick={handleFollowToggle}
                      className={`${isFollowing ? 'btn-secondary' : 'btn-primary'} flex items-center justify-center`}
                    >
                      {isFollowing ? (
                        <>
                          <UserMinus size={18} className="mr-2" />
                          Deixar de Seguir
                        </>
                      ) : (
                        <>
                          <UserPlus size={18} className="mr-2" />
                          Seguir
                        </>
                      )}
                    </button>
                    <button className="btn-primary flex items-center justify-center">
                      Contratar
                    </button>
                    <button className="btn-secondary flex items-center justify-center">
                      <MessageCircle size={18} className="mr-2" />
                      Mensagem
                    </button>
                  </>
                )}
                
                {currentFirefighterId === params.id && (
                  <button 
                    onClick={() => router.push('/profile')}
                    className="btn-primary flex items-center justify-center w-full"
                  >
                    Editar Perfil
                  </button>
                )}
              </div>
              
              {/* Botões de Admin */}
              {isAdmin && currentFirefighterId !== params.id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2 font-semibold">🛡️ Ações Administrativas</p>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <button
                      onClick={() => {
                        setAdminAction('temp_ban');
                        setShowAdminModal(true);
                      }}
                      className="btn-secondary text-xs py-2 px-3 flex items-center justify-center text-orange-600 border-orange-600"
                    >
                      ⏱️ Bloqueio Temporal
                    </button>
                    <button
                      onClick={() => {
                        setAdminAction('permanent_ban');
                        setShowAdminModal(true);
                      }}
                      className="btn-secondary text-xs py-2 px-3 flex items-center justify-center text-red-600 border-red-600"
                    >
                      🚫 Banir Permanente
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {firefighter.specialties && firefighter.specialties.length > 0 && (
          <div className="card mb-6">
            <h2 className="text-base font-semibold text-black mb-4 flex items-center">
              <Award size={20} className="mr-2 text-primary" />
              Especialidades
            </h2>
            <div className="flex flex-wrap gap-2">
              {firefighter.specialties.map((specialty: string, index: number) => (
                <span key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        )}

        {firefighter.qualifications && firefighter.qualifications.length > 0 && (
          <div className="card mb-6">
            <h2 className="text-base font-semibold text-black mb-4">Qualificações</h2>
            <div className="flex flex-wrap gap-2">
              {firefighter.qualifications.map((qualification: string, index: number) => (
                <span key={index} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                  {qualification}
                </span>
              ))}
            </div>
          </div>
        )}

        {(firefighter.phone || firefighter.instagram || firefighter.linkedin) && (
          <div className="card mb-6">
            <h2 className="text-base font-semibold text-black mb-4">Contato</h2>
            <div className="space-y-3">
              {firefighter.phone && (
                <div className="flex items-center space-x-3">
                  <Phone size={18} className="text-gray-400" />
                  <a href={`tel:${firefighter.phone}`} className="text-sm text-primary hover:underline">
                    {firefighter.phone}
                  </a>
                </div>
              )}
              {firefighter.instagram && (
                <div className="flex items-center space-x-3">
                  <Link size={18} className="text-gray-400" />
                  <a 
                    href={`https://instagram.com/${firefighter.instagram.replace('@', '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {firefighter.instagram}
                  </a>
                </div>
              )}
              {firefighter.linkedin && (
                <div className="flex items-center space-x-3">
                  <Link size={18} className="text-gray-400" />
                  <a 
                    href={firefighter.linkedin.startsWith('http') ? firefighter.linkedin : `https://${firefighter.linkedin}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    LinkedIn
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {certificates.length > 0 && (
          <div className="card mb-6">
            <h2 className="text-base font-semibold text-black mb-4">Certificados</h2>
            <div className="space-y-3">
              {certificates.map((cert) => (
                <div key={cert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="text-sm font-semibold text-black">{cert.name}</h3>
                    <p className="text-xs text-gray-500">Emitido em: {new Date(cert.issued_date).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <button className="text-primary hover:opacity-60">
                    <Download size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {reviews.length > 0 && (
          <div className="card">
            <h2 className="text-base font-semibold text-black mb-4">Avaliações</h2>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-black">{review.companies?.name || 'Empresa'}</h3>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={14} 
                          className={i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{review.comment}</p>
                  <p className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString('pt-BR')}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    
    {/* Modal de Ação Administrativa */}
    {showAdminModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-bold text-black mb-4">
            {adminAction === 'temp_ban' ? '⏱️ Bloqueio Temporal' : '🚫 Banimento Permanente'}
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Usuário: <strong>{firefighter?.name}</strong>
          </p>
          
          {adminAction === 'temp_ban' && (
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Duração do bloqueio:
              </label>
              <select
                value={banDays}
                onChange={(e) => setBanDays(parseInt(e.target.value))}
                className="input-field"
              >
                <option value={1}>1 dia</option>
                <option value={3}>3 dias</option>
                <option value={7}>7 dias</option>
                <option value={15}>15 dias</option>
                <option value={30}>30 dias</option>
              </select>
            </div>
          )}
          
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Motivo:
          </label>
          <textarea
            value={banReason}
            onChange={(e) => setBanReason(e.target.value)}
            className="input-field min-h-[100px] mb-4"
            placeholder="Descreva o motivo..."
          />
          
          <div className="flex space-x-3">
            <button
              onClick={() => {
                setShowAdminModal(false);
                setBanReason('');
                setAdminAction(null);
              }}
              className="btn-secondary flex-1"
            >
              Cancelar
            </button>
            <button
              onClick={handleAdminAction}
              className={`btn-primary flex-1 ${
                adminAction === 'temp_ban' ? 'bg-orange-600' : 'bg-red-600'
              }`}
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    )}
    </ProtectedRoute>
  );
}
