"use client";

import { useState } from "react";

export default function Login({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // 处理密码显示/隐藏
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (!isOpen) return null; // 如果没有打开，则返回 null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-8 shadow-lg w-96">
        <div className="text-right">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        <h2 className="text-2xl font-semibold text-center text-orange-600 mb-6">Login</h2>
        
        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm text-gray-600">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter your email"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm text-gray-600">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? "" : ""}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div>
              <input type="checkbox" id="remember" />
              <label htmlFor="remember" className="text-sm text-gray-600 ml-2">Remember me</label>
            </div>
            <a href="#forgot-password" className="text-sm text-orange-600">Forgot password?</a>
          </div>

          <div className="mb-6">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-400 to-yellow-500 text-white py-3 rounded-lg hover:scale-105 transform transition-all"
            >
              Login
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account? 
            <a href="#signup" className="text-orange-600 font-semibold"> Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
}
