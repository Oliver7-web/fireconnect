'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import Loading from '@/components/Loading';
import { MapPin, Star, Download, MessageCircle, ArrowLeft, Award } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function FirefighterProfile() {
  const router = useRouter();
  const params = useParams();
  const [firefighter, setFirefighter] = useState<any>(null);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchProfile();
    }
  }, [params.id]);

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
                <h1 className="text-2xl font-semibold text-black">{firefighter.name}</h1>
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
              
              <div className="flex items-center justify-center md:justify-start mb-4">
                <Star size={18} className="text-yellow-500 fill-yellow-500 mr-1" />
                <span className="text-lg font-semibold text-black">{Number(firefighter.rating).toFixed(1)}</span>
                <span className="text-sm text-gray-500 ml-2">({reviews.length} avaliações)</span>
              </div>
              
              <p className="text-sm text-gray-700 mb-6">{firefighter.description}</p>
              
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <button className="btn-primary flex items-center justify-center">
                  Contratar
                </button>
                <button className="btn-secondary flex items-center justify-center">
                  <MessageCircle size={18} className="mr-2" />
                  Enviar Mensagem
                </button>
              </div>
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
    </ProtectedRoute>
  );
}
