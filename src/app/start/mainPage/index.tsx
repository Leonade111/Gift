"use client"; // 声明为客户端组件

import { useState } from "react";
import Link from "next/link";

export default function MainPage() {
  const [giftRequest, setGiftRequest] = useState("");

  const items = [
    { name: "Tennis Racket", price: "$120", src: "/images/tennis-racket.jpg", id: "tennis-racket" },
    { name: "Wireless Headphones", price: "$180", src: "/images/headphones.jpg", id: "headphones" },
    { name: "Smart Watch", price: "$250", src: "/images/smart-watch.jpg", id: "smart-watch" },
    { name: "Travel Backpack", price: "$90", src: "/images/backpack.jpg", id: "backpack" },
    { name: "Sneakers", price: "$150", src: "/images/sneakers.jpg", id: "sneakers" },
    { name: "Sunglasses", price: "$60", src: "/images/sunglasses.jpg", id: "sunglasses" },
    { name: "Water Bottle", price: "$25", src: "/images/water-bottle.jpg", id: "water-bottle" },
    { name: "Tennis Ball Pack", price: "$20", src: "/images/tennis-ball-pack.jpg", id: "tennis-ball-pack" },
    { name: "Fitness Tracker", price: "$110", src: "/images/fitness-tracker.jpg", id: "fitness-tracker" },
  ];

  const handleSearch = () => {
    alert(`Searching for: ${giftRequest}`);
  };

  return (
    <main className="relative flex flex-col min-h-screen bg-gradient-to-r from-pink-100 via-yellow-100 to-orange-100 text-gray-800 p-12">
      {/* 顶部导航 */}
      <div className="absolute top-4 right-6 flex space-x-6">
        <Link
          href="/"
          className="text-lg font-semibold text-gray-700 hover:text-orange-600 rounded-lg px-4 py-2 transition-all duration-300 transform hover:scale-105 active:scale-90 active:bg-yellow-200 active:shadow-lg"
        >
          Home
        </Link>
        <Link
          href="/category"
          className="text-lg font-semibold text-gray-700 hover:text-orange-600 rounded-lg px-4 py-2 transition-all duration-300 transform hover:scale-105 active:scale-90 active:bg-yellow-200 active:shadow-lg"
        >
          Category
        </Link>
        <Link
          href="/"
          className="text-lg font-semibold text-gray-700 hover:text-orange-600 rounded-lg px-4 py-2 transition-all duration-300 transform hover:scale-105 active:scale-90 active:bg-yellow-200 active:shadow-lg"
        >
          Setting
        </Link>
      </div>

      {/* 输入框 */}
      <div className="max-w-7xl mx-auto mb-10">
        <label className="block text-2xl font-semibold mb-6" htmlFor="gift-input">
          Describe the recipient of your gift:
        </label>
        <div className="flex items-center space-x-4">
          <input
            id="gift-input"
            type="text"
            value={giftRequest}
            onChange={(e) => setGiftRequest(e.target.value)}
            placeholder="A 30-year-old worker who likes to play tennis"
            className="flex-grow px-6 py-4 rounded-lg shadow-lg text-gray-800 bg-white focus:ring-4 focus:ring-orange-400 focus:outline-none text-lg"
          />
          <button
            onClick={handleSearch}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-4 rounded-lg font-semibold text-white shadow-lg transform hover:scale-105 active:scale-95 transition-all"
          >
            Search
          </button>
        </div>
      </div>

      {/* 图片网格 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
        {items.map((item, index) => (
          <Link href={`/items/${item.id}`} key={index}>
            <div
              className="bg-white shadow-lg rounded-lg p-6 hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <img
                src={item.src}
                alt={item.name}
                className="rounded-lg w-full object-cover h-48"
              />
              <div className="mt-4 text-center">
                <p className="text-lg font-bold text-gray-900">{item.name}</p>
                <p className="text-sm font-serif text-gray-600">{item.price}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
