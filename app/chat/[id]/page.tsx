'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ArrowLeft, Send, Paperclip, Image as ImageIcon } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'me' | 'other';
  timestamp: string;
  type: 'text' | 'image' | 'document';
}

export default function ChatConversation() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [messages] = useState<Message[]>([
    {
      id: '1',
      content: 'Olá! Vi seu perfil e gostaria de contratar seus serviços.',
      sender: 'other',
      timestamp: '10:00',
      type: 'text'
    },
    {
      id: '2',
      content: 'Olá! Fico feliz com o interesse. Qual seria o trabalho?',
      sender: 'me',
      timestamp: '10:05',
      type: 'text'
    },
    {
      id: '3',
      content: 'Precisamos de um bombeiro civil para um evento corporativo.',
      sender: 'other',
      timestamp: '10:10',
      type: 'text'
    },
    {
      id: '4',
      content: 'Perfeito! Quando seria o evento?',
      sender: 'me',
      timestamp: '10:15',
      type: 'text'
    }
  ]);

  const handleSend = () => {
    if (message.trim()) {
      // Enviar mensagem via Supabase Realtime
      setMessage('');
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen pb-20 md:pb-0 md:pt-20">
        <Navbar />
        
        <div className="instagram-container h-[calc(100vh-8rem)] flex flex-col">
          <div className="bg-white border-b border-gray-300 p-4">
            <div className="flex items-center space-x-3">
              <button onClick={() => router.back()} className="text-black hover:opacity-60">
                <ArrowLeft size={24} />
              </button>
              <div className="w-10 h-10 rounded-full bg-gray-200"></div>
              <div>
                <h2 className="text-sm font-semibold text-black">Empresa ABC</h2>
                <p className="text-xs text-gray-500">Online</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] ${
                  msg.sender === 'me' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-black'
                } rounded-2xl px-4 py-2`}>
                  <p className="text-sm">{msg.content}</p>
                  <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-white/70' : 'text-gray-500'}`}>
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border-t border-gray-300 p-4">
            <div className="flex items-center space-x-2">
              <button className="text-gray-600 hover:text-black">
                <Paperclip size={22} />
              </button>
              <button className="text-gray-600 hover:text-black">
                <ImageIcon size={22} />
              </button>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Digite sua mensagem..."
                className="flex-1 input-field"
              />
              <button 
                onClick={handleSend}
                className="bg-primary text-white p-2 rounded-full hover:opacity-90 transition-all"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
