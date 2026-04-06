'use client';

import { Home, Search, MessageCircle, Calendar, User, Flame } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AdminButton from './AdminButton';

export default function Navbar() {
  const pathname = usePathname();
  
  const isActive = (path: string) => pathname === path;
  
  return (
    <>
      {/* Desktop Navbar - Estilo Instagram */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 shadow-sm">
        <div className="instagram-container">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Flame className="text-primary" size={28} />
              <span className="text-2xl font-semibold" style={{ fontFamily: 'cursive' }}>
                FireConnect
              </span>
            </Link>
            
            {/* Navegação */}
            <div className="flex items-center space-x-6">
              <AdminButton />
              
              <Link href="/dashboard">
                <div className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  {isActive('/dashboard') ? (
                    <Home size={28} className="text-black" fill="black" />
                  ) : (
                    <Home size={28} className="text-black" />
                  )}
                </div>
              </Link>
              
              <Link href="/search">
                <div className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  {isActive('/search') ? (
                    <Search size={28} className="text-black" strokeWidth={3} />
                  ) : (
                    <Search size={28} className="text-black" />
                  )}
                </div>
              </Link>
              
              <Link href="/chat">
                <div className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  {isActive('/chat') ? (
                    <MessageCircle size={28} className="text-black" fill="black" />
                  ) : (
                    <MessageCircle size={28} className="text-black" />
                  )}
                </div>
              </Link>
              
              <Link href="/availability">
                <div className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  {isActive('/availability') ? (
                    <Calendar size={28} className="text-black" fill="black" />
                  ) : (
                    <Calendar size={28} className="text-black" />
                  )}
                </div>
              </Link>
              
              <Link href="/profile">
                <div className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className={`w-7 h-7 rounded-full ${isActive('/profile') ? 'ring-2 ring-black' : ''} bg-gray-300 flex items-center justify-center`}>
                    <User size={18} className="text-gray-600" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar - Estilo Instagram */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg">
        <div className="flex justify-around items-center h-14 px-2">
          <Link href="/dashboard">
            <div className="p-2">
              {isActive('/dashboard') ? (
                <Home size={28} className="text-black" fill="black" />
              ) : (
                <Home size={28} className="text-black" />
              )}
            </div>
          </Link>
          
          <Link href="/search">
            <div className="p-2">
              {isActive('/search') ? (
                <Search size={28} className="text-black" strokeWidth={3} />
              ) : (
                <Search size={28} className="text-black" />
              )}
            </div>
          </Link>
          
          <Link href="/chat">
            <div className="p-2">
              {isActive('/chat') ? (
                <MessageCircle size={28} className="text-black" fill="black" />
              ) : (
                <MessageCircle size={28} className="text-black" />
              )}
            </div>
          </Link>
          
          <Link href="/availability">
            <div className="p-2">
              {isActive('/availability') ? (
                <Calendar size={28} className="text-black" fill="black" />
              ) : (
                <Calendar size={28} className="text-black" />
              )}
            </div>
          </Link>
          
          <Link href="/profile">
            <div className="p-2">
              <div className={`w-7 h-7 rounded-full ${isActive('/profile') ? 'ring-2 ring-black' : ''} bg-gray-300 flex items-center justify-center`}>
                <User size={18} className="text-gray-600" />
              </div>
            </div>
          </Link>
        </div>
      </nav>
    </>
  );
}
