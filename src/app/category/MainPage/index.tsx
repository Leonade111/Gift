"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Footer from "@/app/footer";

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
        // 确保我们设置的是 categories 数组
        if (data && data.categories) {
          setCategories(data.categories);
        }
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
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50">
      {/* 导航栏 */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link
              href="/"
              className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-pink-600 hover:from-pink-600 hover:to-orange-600 transition-all duration-300"
            >
              Gift Finder
            </Link>
            <div className="flex items-center space-x-8">
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
                href="/profile"
                className="relative text-[0.95rem] font-medium text-gray-600 hover:text-orange-500 transition-colors duration-300 after:absolute after:left-0 after:bottom-[-4px] after:h-0.5 after:w-0 hover:after:w-full after:bg-gradient-to-r after:from-orange-500 after:to-pink-500 after:transition-all after:duration-300"
              >
                Profile
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-grow pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* 页面标题 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Explore Gift Categories
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse through our carefully curated categories to find the perfect gift for any occasion
            </p>
          </div>

          {/* 布局调整：左侧为类别列表，右侧为商品列表 */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* 类别列表 */}
            <div className="lg:w-1/4 bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Categories</h2>
                <div className="space-y-2">
                  {Array.isArray(categories) && categories.map((category) => (
                    <button
                      key={category.tag_id}
                      onClick={() => handleTagSelect(category.tag_id)}
                      className={`w-full px-4 py-3 rounded-lg text-left transition-all duration-300 ${
                        selectedTagId === category.tag_id
                          ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md'
                          : 'hover:bg-orange-50 text-gray-700 hover:text-orange-600'
                      }`}
                    >
                      {category.tag_name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 商品列表 */}
            <div className="lg:w-3/4">
              {items.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((item) => (
                    <div
                      key={item.gift_id}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <div className="relative h-64">
                        <img
                          src={item.img_url}
                          alt={item.gift_name}
                          className="w-full h-full object-contain p-4"
                        />
                      </div>
                      <div className="p-6 bg-white">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          {item.gift_name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <p className="text-xl font-bold text-orange-600">
                            ￥{item.gift_price}
                          </p>
                          <button className="text-sm px-4 py-2 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors duration-300">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 bg-white rounded-xl">
                  <p className="text-lg text-gray-500">
                    Select a category to view items
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
