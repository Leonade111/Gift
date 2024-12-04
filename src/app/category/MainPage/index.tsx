'use client';
import React, { useState, useEffect } from 'react';

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
    <main className="flex bg-gray-50 py-16 px-8 space-x-6">
      {/* Left side: Category */}
      <div className="w-1/4 bg-gradient-to-tl from-yellow-100 to-orange-200 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Categories</h2>
        <ul className="space-y-4">
          {categories.map((category) => (
            <li
              key={category.tag_id}
              className="p-3 bg-white rounded-md hover:bg-yellow-200 cursor-pointer transition-all duration-300"
              onClick={() => setSelectedTagId(category.tag_id)}
            >
              <span className="text-lg text-gray-800">{category.tag_name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Right side: Item */}
      <div className="w-3/4 p-6 bg-white rounded-lg shadow-lg">
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
            <div className="flex justify-center items-center text-xl text-gray-500">
              No items found
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
