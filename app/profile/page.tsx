'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import Loading from '@/components/Loading';
import { Camera, MapPin, Mail, Phone, Edit, LogOut, Crown, Award, Save, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

export default function ProfilePage() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    description: '',
    bio: '',
    qualifications: [] as string[],
    experience_years: 0,
    instagram: '',
    linkedin: '',
    photo_url: '',
    isPremium: false,
    rating: 0,
    completedJobs: 0,
    specialties: [] as string[]
  });

  const [newSpecialty, setNewSpecialty] = useState('');
  const [newQualification, setNewQualification] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      // Buscar tipo de usuário
      const { data: userData } = await supabase
        .from('users')
        .select('type')
        .eq('id', user?.id)
        .single();

      if (userData?.type === 'firefighter') {
        const { data: ffData } = await supabase
          .from('firefighters')
          .select('*')
          .eq('user_id', user?.id)
          .single();

        if (ffData) {
          setProfile({
            name: ffData.name || '',
            email: user?.email || '',
            phone: ffData.phone || '',
            location: ffData.location || '',
            description: ffData.description || '',
            bio: ffData.bio || '',
            qualifications: ffData.qualifications || [],
            experience_years: ffData.experience_years || 0,
            instagram: ffData.instagram || '',
            linkedin: ffData.linkedin || '',
            photo_url: ffData.photo_url || '',
            isPremium: false,
            rating: Number(ffData.rating) || 0,
            completedJobs: 0,
            specialties: ffData.specialties || []
          });
        }
      } else {
        const { data: compData } = await supabase
          .from('companies')
          .select('*')
          .eq('user_id', user?.id)
          .single();

        if (compData) {
          setProfile({
            name: compData.name || '',
            email: user?.email || '',
            phone: '',
            location: compData.location || '',
            description: compData.description || '',
            bio: '',
            qualifications: [],
            experience_years: 0,
            instagram: '',
            linkedin: '',
            photo_url: compData.logo_url || '',
            isPremium: false,
            rating: 0,
            completedJobs: compData.contracts_count || 0,
            specialties: []
          });
        }
      }
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('type')
        .eq('id', user?.id)
        .single();

      if (userData?.type === 'firefighter') {
        const { error } = await supabase
          .from('firefighters')
          .update({
            name: profile.name,
            location: profile.location,
            description: profile.description,
            bio: profile.bio,
            qualifications: profile.qualifications,
            experience_years: profile.experience_years,
            phone: profile.phone,
            instagram: profile.instagram,
            linkedin: profile.linkedin,
            specialties: profile.specialties
          })
          .eq('user_id', user?.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('companies')
          .update({
            name: profile.name,
            location: profile.location,
            description: profile.description
          })
          .eq('user_id', user?.id);

        if (error) throw error;
      }

      alert('Perfil atualizado com sucesso!');
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar perfil');
    } finally {
      setSaving(false);
    }
  };

  const addSpecialty = () => {
    if (newSpecialty.trim() && !profile.specialties.includes(newSpecialty.trim())) {
      setProfile({
        ...profile,
        specialties: [...profile.specialties, newSpecialty.trim()]
      });
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (specialty: string) => {
    setProfile({
      ...profile,
      specialties: profile.specialties.filter(s => s !== specialty)
    });
  };

  const addQualification = () => {
    if (newQualification.trim() && !profile.qualifications.includes(newQualification.trim())) {
      setProfile({
        ...profile,
        qualifications: [...profile.qualifications, newQualification.trim()]
      });
      setNewQualification('');
    }
  };

  const removeQualification = (qualification: string) => {
    setProfile({
      ...profile,
      qualifications: profile.qualifications.filter(q => q !== qualification)
    });
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas imagens (JPG, PNG, etc.)');
      return;
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB');
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar-${Date.now()}.${fileExt}`;

      // Upload do arquivo
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Obter URL pública
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Atualizar perfil
      const { data: userData } = await supabase
        .from('users')
        .select('type')
        .eq('id', user.id)
        .single();

      if (userData?.type === 'firefighter') {
        await supabase
          .from('firefighters')
          .update({ photo_url: data.publicUrl })
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('companies')
          .update({ logo_url: data.publicUrl })
          .eq('user_id', user.id);
      }

      setProfile({ ...profile, photo_url: data.publicUrl });
      alert('✅ Foto atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('❌ Erro ao fazer upload da foto. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    signOut();
  };

  if (loading) return <Loading />;

  return (
    <ProtectedRoute>
      <div className="min-h-screen pb-20 md:pb-8 md:pt-20">
        <Navbar />
      
        <div className="instagram-container py-8">
          <div className="card mb-6">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                {uploading ? (
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="text-xs text-gray-500 mt-2">Enviando...</p>
                  </div>
                ) : profile.photo_url ? (
                  <img src={profile.photo_url} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-gray-400">
                    {profile.name.charAt(0)}
                  </span>
                )}
              </div>
              <label 
                htmlFor="avatar-upload" 
                className={`absolute bottom-0 right-0 bg-primary text-white p-3 rounded-full hover:bg-red-600 cursor-pointer shadow-lg transition-all ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Camera size={20} />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
            
            <p className="text-xs text-gray-500 mb-4 text-center">
              Clique no ícone da câmera para adicionar sua foto
            </p>
            
            <h1 className="text-xl font-semibold text-black mb-2">{profile.name}</h1>
            
            {profile.isPremium && (
              <div className="flex items-center space-x-2 bg-yellow-50 text-yellow-700 px-4 py-1 rounded-lg mb-4">
                <Crown size={16} />
                <span className="text-sm font-semibold">Premium</span>
              </div>
            )}
            
            <div className="flex items-center space-x-8 mb-6">
              <div className="text-center">
                <p className="text-lg font-semibold text-black">{profile.rating}</p>
                <p className="text-xs text-gray-500">Avaliação</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-black">{profile.completedJobs}</p>
                <p className="text-xs text-gray-500">Trabalhos</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-semibold text-black">Informações Pessoais</h2>
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="text-primary hover:opacity-60 flex items-center space-x-1 text-sm font-semibold"
              >
                <Edit size={18} />
                <span>Editar</span>
              </button>
            ) : (
              <div className="flex space-x-3">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="text-gray-600 hover:opacity-60 flex items-center space-x-1 text-sm font-semibold"
                >
                  <X size={18} />
                  <span>Cancelar</span>
                </button>
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="text-primary hover:opacity-60 flex items-center space-x-1 text-sm font-semibold"
                >
                  <Save size={18} />
                  <span>{saving ? 'Salvando...' : 'Salvar'}</span>
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Nome
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  className="input-field"
                />
              ) : (
                <p className="text-sm text-gray-700">{profile.name}</p>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <Mail size={18} className="text-gray-400" />
              <span className="text-sm text-gray-700">{profile.email}</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Localização
              </label>
              <div className="flex items-center space-x-3">
                <MapPin size={18} className="text-gray-400" />
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => setProfile({...profile, location: e.target.value})}
                    className="input-field flex-1"
                    placeholder="Cidade, Estado"
                  />
                ) : (
                  <span className="text-sm text-gray-700">{profile.location}</span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Sobre mim
              </label>
              {isEditing ? (
                <textarea
                  value={profile.description}
                  onChange={(e) => setProfile({...profile, description: e.target.value})}
                  className="input-field min-h-[100px]"
                  placeholder="Conte um pouco sobre você..."
                />
              ) : (
                <p className="text-sm text-gray-700">{profile.description || 'Nenhuma descrição'}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Bio
              </label>
              {isEditing ? (
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  className="input-field min-h-[80px]"
                  placeholder="Uma breve biografia profissional..."
                />
              ) : (
                <p className="text-sm text-gray-700">{profile.bio || 'Nenhuma bio'}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Telefone
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  className="input-field"
                  placeholder="(11) 98765-4321"
                />
              ) : (
                <p className="text-sm text-gray-700">{profile.phone || 'Não informado'}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Anos de Experiência
              </label>
              {isEditing ? (
                <input
                  type="number"
                  min="0"
                  value={profile.experience_years}
                  onChange={(e) => setProfile({...profile, experience_years: parseInt(e.target.value) || 0})}
                  className="input-field"
                  placeholder="0"
                />
              ) : (
                <p className="text-sm text-gray-700">{profile.experience_years} anos</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Instagram
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.instagram}
                  onChange={(e) => setProfile({...profile, instagram: e.target.value})}
                  className="input-field"
                  placeholder="@seu_usuario"
                />
              ) : (
                <p className="text-sm text-gray-700">{profile.instagram || 'Não informado'}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                LinkedIn
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.linkedin}
                  onChange={(e) => setProfile({...profile, linkedin: e.target.value})}
                  className="input-field"
                  placeholder="linkedin.com/in/seu-perfil"
                />
              ) : (
                <p className="text-sm text-gray-700">{profile.linkedin || 'Não informado'}</p>
              )}
            </div>

            {profile.qualifications.length > 0 || isEditing ? (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Qualificações
                </label>
                <div className="flex flex-wrap gap-2">
                  {profile.qualifications.map((qualification, index) => (
                    <span 
                      key={index} 
                      className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-2"
                    >
                      <span>{qualification}</span>
                      {isEditing && (
                        <button 
                          onClick={() => removeQualification(qualification)}
                          className="hover:text-blue-800"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
                {isEditing && (
                  <div className="mt-3 flex space-x-2">
                    <input
                      type="text"
                      value={newQualification}
                      onChange={(e) => setNewQualification(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addQualification()}
                      className="input-field flex-1"
                      placeholder="Ex: NR-23, Primeiros Socorros..."
                    />
                    <button 
                      onClick={addQualification}
                      className="btn-primary"
                    >
                      Adicionar
                    </button>
                  </div>
                )}
              </div>
            ) : null}

            {profile.specialties.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Especialidades
                </label>
                <div className="flex flex-wrap gap-2">
                  {profile.specialties.map((specialty, index) => (
                    <span 
                      key={index} 
                      className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-2"
                    >
                      <span>{specialty}</span>
                      {isEditing && (
                        <button 
                          onClick={() => removeSpecialty(specialty)}
                          className="hover:text-red-700"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
                {isEditing && (
                  <div className="mt-3 flex space-x-2">
                    <input
                      type="text"
                      value={newSpecialty}
                      onChange={(e) => setNewSpecialty(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSpecialty()}
                      className="input-field flex-1"
                      placeholder="Adicionar especialidade..."
                    />
                    <button 
                      onClick={addSpecialty}
                      className="btn-primary"
                    >
                      Adicionar
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {!profile.isPremium && (
          <div className="card mb-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                <Crown size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-black">Seja Premium</h3>
                <p className="text-xs text-gray-600">Destaque seu perfil</p>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-gray-700 mb-4">
              <li className="flex items-center space-x-2">
                <Award size={14} />
                <span>Destaque no topo das buscas</span>
              </li>
              <li className="flex items-center space-x-2">
                <Award size={14} />
                <span>Selo de verificado</span>
              </li>
              <li className="flex items-center space-x-2">
                <Award size={14} />
                <span>Estatísticas avançadas</span>
              </li>
            </ul>
            <button className="w-full btn-primary">
              Assinar por R$ 29,90/mês
            </button>
          </div>
        )}

          <button 
            onClick={handleLogout}
            className="w-full btn-secondary text-red-600 border-red-600 hover:bg-red-50 flex items-center justify-center space-x-2"
          >
            <LogOut size={20} />
            <span>Sair da Conta</span>
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
