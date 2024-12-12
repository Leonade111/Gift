"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// 定义Category接口
interface Category {
  tag_id: number;
  tag_name: string;
}

// 定义Item接口
interface Item {
  gift_id: string;
  gift_name: string;
  gift_price: number;
  img_url: string;
}

export default function MainPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null);

  // 获取类别数据
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // 处理类别选择
  const handleTagSelect = async (tagId: number) => {
    setSelectedTagId(tagId);
    try {
      const response = await fetch(`/api/category_item?tag_id=${tagId}`);
      const data = await response.json();
      setItems(data.items || []);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  return (
    <main className="min-h-screen bg-yellow-50 py-10 px-6">
      {/* 顶部导航 */}
      <div className="absolute top-6 right-6 flex space-x-6"> {/* 调整按钮间距并稍微下移 */}
        <Link
          href="/"
          className="text-lg font-semibold text-gray-700 hover:text-orange-600 py-3 px-6">
          Home
        </Link>
        <Link
          href="/start"
          className="text-lg font-semibold text-gray-700 hover:text-orange-600 py-3 px-6">
          Start
        </Link>
        <Link
          href="/"
          className="text-lg font-semibold text-gray-700 hover:text-orange-600 py-3 px-6">
          Setting
        </Link>
      </div>

      {/* 布局调整：左侧为类别列表，右侧为商品列表 */}
      <div className="max-w-7xl mx-auto mt-16 flex">
        {/* 类别列表 */}
        <div className="w-1/4 bg-white p-4 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-8 text-center">Gift Categories</h1>
          <div className="space-y-4">
            {categories.map((category) => (
              <button
                key={category.tag_id}
                onClick={() => handleTagSelect(category.tag_id)}
                className={`w-full p-4 rounded-lg text-left transition-all duration-300 ${
                  selectedTagId === category.tag_id
                    ? 'bg-orange-500 text-white'
                    : 'bg-white hover:bg-orange-100'
                }`}>
                {category.tag_name}
              </button>
            ))}
          </div>
        </div>

        {/* 商品列表 */}
        <div className="w-3/4 ml-8">
          {items.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((item) => (
                <div
                  key={item.gift_id}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                  <img
                    src={item.img_url}
                    alt={item.gift_name}
                    className="w-full h-64 object-contain rounded-lg mb-4"
                  />
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">
                      {item.gift_name}
                    </h3>
                    <p className="text-xl font-bold text-orange-500">
                      ${item.gift_price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
