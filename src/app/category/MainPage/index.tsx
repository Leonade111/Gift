'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Category {
  tag_id: number;
  tag_name: string;
}

interface Item {
  gift_id: number;
  gift_name: string;
  gift_price: number;
  img_url: string;
}

export default function MainPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null);

  // 获取categories
  useEffect(() => {
    async function fetchCategories() {
      const res = await fetch('/api/categories');
      const data: Category[] = await res.json();
      setCategories(data);
    }
    fetchCategories();
  }, []);

  // 获取items，根据selectedTagId
  useEffect(() => {
    if (selectedTagId !== null) {
      async function fetchItems() {
        const res = await fetch(`/api/category_item?tag_id=${selectedTagId}`);
        const data: Item[] = await res.json();
        setItems(data);
      }
      fetchItems();
    }
  }, [selectedTagId]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-100 text-gray-800">
      {/* 顶部导航 */}
      <div className="absolute top-4 right-6 flex space-x-6">
        <Link
          href="/"
          className="text-lg font-semibold text-gray-700 hover:text-orange-600 rounded-lg px-4 py-2 transition-all duration-300 transform hover:scale-105 active:scale-90 active:bg-yellow-200 active:shadow-lg"
        >
          Home
        </Link>
        <Link
          href="/start"
          className="text-lg font-semibold text-gray-700 hover:text-orange-600 rounded-lg px-4 py-2 transition-all duration-300 transform hover:scale-105 active:scale-90 active:bg-yellow-200 active:shadow-lg"
        >
          Start
        </Link>
        <Link
          href="/"
          className="text-lg font-semibold text-gray-700 hover:text-orange-600 rounded-lg px-4 py-2 transition-all duration-300 transform hover:scale-105 active:scale-90 active:bg-yellow-200 active:shadow-lg"
        >
          Setting
        </Link>
      </div>

      <div className="flex py-16 px-8 space-x-6">
        {/* Left side: Category */}
        <div className="w-1/4 p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Categories</h2>
          <ul className="space-y-4">
            {categories.map((category) => (
              <li
                key={category.tag_id}
                className={`p-3 rounded-md text-lg text-center bg-yellow-100 hover:bg-yellow-300 cursor-pointer transition-all duration-300 ${
                  selectedTagId === category.tag_id ? 'bg-yellow-300 font-bold' : ''
                }`}
                onClick={() => setSelectedTagId(category.tag_id)}
              >
                {category.tag_name}
              </li>
            ))}
          </ul>
        </div>

        {/* Right side: Item */}
        <div className="flex-1 p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Items</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.length > 0 ? (
              items.map((item) => (
                <div
                  key={item.gift_id}
                  className="bg-white border p-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <img
                    src={item.img_url}
                    alt={item.gift_name}
                    className="w-full h-64 object-contain rounded-md mb-4"
                  />
                  <div className="text-center">
                    <h3 className="font-semibold text-lg text-gray-800">{item.gift_name}</h3>
                    <p className="text-xl font-bold text-orange-500">{`$${item.gift_price}`}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center w-full h-64 text-2xl font-semibold text-gray-500">
                No items found
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
