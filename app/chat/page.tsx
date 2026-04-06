'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Search, MessageCircle } from 'lucide-react';
import Link from 'next/link';

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
}

export default function ChatPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data
  const conversations: Conversation[] = [
    {
      id: '1',
      name: 'Empresa ABC',
      avatar: '',
      lastMessage: 'Quando você pode começar?',
      timestamp: '10:30',
      unread: 2
    },
    {
      id: '2',
      name: 'Indústria XYZ',
      avatar: '',
      lastMessage: 'Obrigado pelo excelente trabalho!',
      timestamp: 'Ontem',
      unread: 0
    },
    {
      id: '3',
      name: 'Carlos Silva',
      avatar: '',
      lastMessage: 'Estou disponível amanhã',
      timestamp: '15/03',
      unread: 1
    }
  ];

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen pb-20 md:pb-8 md:pt-20">
        <Navbar />
      
        <div className="instagram-container py-8">
          <h1 className="text-xl font-semibold text-black mb-6">Mensagens</h1>
          
          <div className="card overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar conversas..."
                  className="input-field pl-10"
                />
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {filteredConversations.map((conv) => (
                <Link key={conv.id} href={`/chat/${conv.id}`}>
                  <div className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
                          <MessageCircle size={20} className="text-gray-500" />
                        </div>
                        {conv.unread > 0 && (
                          <div className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                            {conv.unread}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-sm font-semibold text-black truncate">{conv.name}</h3>
                          <span className="text-xs text-gray-500">{conv.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {filteredConversations.length === 0 && (
              <div className="text-center py-16">
                <MessageCircle size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-sm text-gray-500">Nenhuma conversa encontrada</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
