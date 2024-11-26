"use client";  // <-- 添加这一行，标记为客户端组件

import { useState } from 'react';
import Link from 'next/link';
import LoginModal from './login'; // 引入 LoginModal 组件

export default function Header() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <header className="bg-gradient-to-r from-pink-100 via-yellow-100 to-orange-100 text-gray-800 py-6 shadow-md">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo or Brand Name */}
        <a
          href="#"
          className="text-3xl font-extrabold tracking-wide text-yellow-800 hover:text-orange-600 transition-all duration-300"
        >
          Leooooooooooooooo
        </a>

        {/* Navigation Links */}
        <nav className="space-x-6 flex items-center">
          <button
            onClick={openLoginModal}
            className="text-lg font-semibold text-gray-700 hover:text-orange-600 rounded-lg px-4 py-2 transition-all duration-300 transform hover:scale-105 active:scale-90 active:bg-yellow-200 active:shadow-lg"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Login
          </button>
          <Link
            href="/profile"
            className="text-lg font-semibold text-gray-700 hover:text-orange-600 rounded-lg px-4 py-2 transition-all duration-300 transform hover:scale-105 active:scale-90 active:bg-yellow-200 active:shadow-lg"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Profile
          </Link>
          <a
            href="#contact"
            className="text-lg font-semibold text-gray-700 hover:text-orange-600 rounded-lg px-4 py-2 transition-all duration-300 transform hover:scale-105 active:scale-90 active:bg-yellow-200 active:shadow-lg"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Setting
          </a>
        </nav>
      </div>

      {/* Login Modal Component */}
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </header>
  );
}
