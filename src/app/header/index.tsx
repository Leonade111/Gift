"use client";  

import { useState } from 'react';
import Link from 'next/link';
import LoginModal from './login';

export default function Header() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <header className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-pink-600 hover:from-pink-600 hover:to-orange-600 transition-all duration-300"
          >
            Gift Finder
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-8">
            <Link
              href="/"
              className="relative text-[0.95rem] font-medium text-gray-600 hover:text-orange-500 transition-colors duration-300 after:absolute after:left-0 after:bottom-[-4px] after:h-0.5 after:w-0 hover:after:w-full after:bg-gradient-to-r after:from-orange-500 after:to-pink-500 after:transition-all after:duration-300"
            >
              Home
            </Link>
            <Link
              href="/start"
              className="relative text-[0.95rem] font-medium text-gray-600 hover:text-orange-500 transition-colors duration-300 after:absolute after:left-0 after:bottom-[-4px] after:h-0.5 after:w-0 hover:after:w-full after:bg-gradient-to-r after:from-orange-500 after:to-pink-500 after:transition-all after:duration-300"
            >
              Start
            </Link>
            <Link
              href="/category"
              className="relative text-[0.95rem] font-medium text-gray-600 hover:text-orange-500 transition-colors duration-300 after:absolute after:left-0 after:bottom-[-4px] after:h-0.5 after:w-0 hover:after:w-full after:bg-gradient-to-r after:from-orange-500 after:to-pink-500 after:transition-all after:duration-300"
            >
              Category
            </Link>
            <Link
              href="/profile"
              className="relative text-[0.95rem] font-medium text-gray-600 hover:text-orange-500 transition-colors duration-300 after:absolute after:left-0 after:bottom-[-4px] after:h-0.5 after:w-0 hover:after:w-full after:bg-gradient-to-r after:from-orange-500 after:to-pink-500 after:transition-all after:duration-300"
            >
              Profile
            </Link>
            <button
              onClick={openLoginModal}
              className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-pink-500 rounded-full hover:shadow-lg transform transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Login
            </button>
          </nav>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </header>
  );
}
