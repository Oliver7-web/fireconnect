'use client';

import { MapPin, Star, MessageCircle, MoreHorizontal } from 'lucide-react';
import { Firefighter } from '@/types';
import Link from 'next/link';

interface FirefighterCardProps {
  firefighter: Firefighter;
}

export default function FirefighterCard({ firefighter }: FirefighterCardProps) {
  return (
    <div className="card">
      {/* Header do Card */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={firefighter.available ? 'avatar-ring' : 'avatar-ring-simple'}>
            <div className="w-10 h-10 rounded-full overflow-hidden bg-white">
              {firefighter.photo_url ? (
                <img 
                  src={firefighter.photo_url} 
                  alt={firefighter.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm font-semibold text-gray-600">
                    {firefighter.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div>
            <Link href={`/firefighter/${firefighter.id}`}>
              <h3 className="text-sm font-semibold text-black hover:text-gray-600">
                {firefighter.name}
              </h3>
            </Link>
            <div className="flex items-center text-xs text-gray-500">
              <MapPin size={10} className="mr-1" />
              <span>{firefighter.location}</span>
            </div>
          </div>
        </div>
        <button className="p-1">
          <MoreHorizontal size={20} className="text-black" />
        </button>
      </div>

      {/* Imagem Principal */}
      <Link href={`/firefighter/${firefighter.id}`}>
        <div className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3 cursor-pointer">
          {firefighter.photo_url ? (
            <img 
              src={firefighter.photo_url} 
              alt={firefighter.name}
              className="w-full h-full object-cover hover:opacity-95 transition-opacity"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <span className="text-6xl font-bold text-gray-400">
                {firefighter.name.charAt(0)}
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Ações */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-4">
          <button className="hover:opacity-60 transition-opacity">
            <MessageCircle size={24} className="text-black" />
          </button>
          <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded">
            <Star size={14} className="text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-semibold text-black">
              {Number(firefighter.rating).toFixed(1)}
            </span>
          </div>
        </div>
        <span className={`badge ${firefighter.available ? 'badge-success' : 'badge-gray'}`}>
          {firefighter.available ? 'Disponível' : 'Ocupado'}
        </span>
      </div>

      {/* Descrição */}
      <div className="mb-2">
        <p className="text-sm">
          <span className="font-semibold text-black">{firefighter.name}</span>
          {' '}
          <span className="text-gray-700">
            {firefighter.description?.substring(0, 80)}
            {firefighter.description && firefighter.description.length > 80 ? '...' : ''}
          </span>
        </p>
      </div>

      {/* Botão Ver Perfil */}
      <Link href={`/firefighter/${firefighter.id}`}>
        <button className="w-full btn-primary">
          Ver Perfil Completo
        </button>
      </Link>
    </div>
  );
}
