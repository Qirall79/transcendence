// src/components/layouts/PublicLayout.tsx
import { ReactNode } from 'react';
import Logo from '@/components/ui/Logo';
import { Link } from 'react-router-dom';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-gray-800 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Logo size={40} />
          <a href="/" className="text-white text-2xl font-bold">
            P0000NG
          </a>
        </div>
        <div className="flex gap-6">
          <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
            About
          </Link>
          <Link to="/auth/login" className="text-white hover:text-gray-300 transition-colors">
            Sign In
          </Link>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="p-4 border-t border-gray-800 text-center text-xs text-gray-500">
        © 2025 P0000NG
      </footer>
    </div>
  );
};