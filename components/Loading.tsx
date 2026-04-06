import { Flame } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-bounce mb-4 flex justify-center">
          <Flame className="text-primary" size={60} />
        </div>
        <p className="text-gray-600 font-semibold">Carregando...</p>
      </div>
    </div>
  );
}
