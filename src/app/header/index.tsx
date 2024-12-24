"use client";  

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function Header() {
  const { isLoggedIn, user } = useAuth();
  const router = useRouter();

  const handleLoginClick = () => {
    router.push('/login');
  };

  return (
    <header className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-gray-800">
          Gift
        </Link>
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <span className="text-sm text-gray-600">Welcome, {user?.email}</span>
              <Link
                href="/profile/profileList"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Profile
              </Link>
            </>
          ) : (
            <button
              onClick={handleLoginClick}
              className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-pink-500 rounded-full hover:shadow-lg transform transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Login
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
