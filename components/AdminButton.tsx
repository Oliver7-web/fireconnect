'use client';

import { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

export default function AdminButton() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  
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

      setIsAdmin(data?.is_admin || false);
    } catch (error) {
      setIsAdmin(false);
    }
  };

  if (!isAdmin) return null;

  const isActive = pathname === '/admin';

  return (
    <Link href="/admin">
      <div className="p-2 hover:bg-red-50 rounded-lg transition-colors">
        <Shield 
          size={28} 
          className={isActive ? 'text-red-600' : 'text-red-500'} 
          fill={isActive ? 'currentColor' : 'none'}
        />
      </div>
    </Link>
  );
}
