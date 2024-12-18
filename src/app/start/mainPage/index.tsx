"use client"; // 声明为客户端组件

import { useState, useEffect } from "react";
import Link from "next/link";

// 定义商品接口
interface Item {
  gift_id: string;
  gift_name: string;
  gift_price: number;
  img_url: string;
  tag_id: string;
}

export default function MainPage() {
  const [giftRequest, setGiftRequest] = useState("");
  const [searchItems, setSearchItems] = useState<Item[]>([]);
  const [defaultItems, setDefaultItems] = useState<Item[]>([]); // 默认商品状态
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // 获取默认商品数据
  useEffect(() => {
    const fetchDefaultItems = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/default_items");
        const data = await response.json();
        if (data.items && Array.isArray(data.items)) {
          setDefaultItems(data.items);
        }
      } catch (error) {
        console.error("Failed to fetch default items:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDefaultItems();
  }, []);

  // 搜索事件处理
  const handleSearch = async () => {
    try {
      setIsLoading(true);
      setHasSearched(false); // 重置搜索状态，不立即显示结果
      setCurrentPage(1); // 重置页码
      
      // 获取推荐的tag_ids
      const recommendResponse = await fetch("/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: giftRequest,
        }),
      });
      const recommendResult = await recommendResponse.json();
      console.log("Recommend API response:", recommendResult);
      
      if (recommendResult.tagIds && recommendResult.tagIds.length > 0) {
        // 获取所有推荐标签的礼物
        const allItems: Item[] = [];
        for (const tagId of recommendResult.tagIds) {
          const itemsResponse = await fetch(`/api/category_item?tag_id=${tagId}&page=1`);
          const data = await itemsResponse.json();
          if (data.items && Array.isArray(data.items)) {
            allItems.push(...data.items);
          }
        }
        
        // 去重（如果需要）
        const uniqueItems = Array.from(new Map(allItems.map(item => [item.gift_id, item])).values());
        setSearchItems(uniqueItems);
        setTotalPages(Math.ceil(uniqueItems.length / 9)); // 假设每页显示9个商品
      }
      
      setHasSearched(true); // 在所有处理完成后才设置搜索状态
    } catch (error) {
      console.error("Failed to search:", error);
      setHasSearched(true); // 发生错误时也要设置搜索状态
      setSearchItems([]); // 清空搜索结果
    } finally {
      setIsLoading(false);
    }
  };

  // 处理页面变化
  const handlePageChange = async (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
    
    try {
      setIsLoading(true);
      const itemsResponse = await fetch(`/api/category_item?tag_id=${searchItems[0]?.tag_id}&page=${newPage}`);
      const data = await itemsResponse.json();
      setSearchItems(data.items);
      setCurrentPage(newPage);
    } catch (error) {
      console.error("Failed to fetch page:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative flex flex-col min-h-screen bg-gradient-to-r from-pink-100 via-yellow-100 to-orange-100 text-gray-800 p-12">
      {/* 顶部导航 */}
      <div className="absolute top-4 right-6 flex space-x-6">
        <Link
          href="/"
          className="text-lg font-semibold text-gray-700 hover:text-orange-600 rounded-lg px-4 py-2 transition-all duration-300 transform hover:scale-105 active:scale-90 active:bg-yellow-200 active:shadow-lg">
          Home
        </Link>
        <Link
          href="/category"
          className="text-lg font-semibold text-gray-700 hover:text-orange-600 rounded-lg px-4 py-2 transition-all duration-300 transform hover:scale-105 active:scale-90 active:bg-yellow-200 active:shadow-lg">
          Category
        </Link>
        <Link
          href="/"
          className="text-lg font-semibold text-gray-700 hover:text-orange-600 rounded-lg px-4 py-2 transition-all duration-300 transform hover:scale-105 active:scale-90 active:bg-yellow-200 active:shadow-lg">
          Setting
        </Link>
      </div>

      {/* 搜索区域 */}
      <div className="max-w-7xl mx-auto mb-16 px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Find the Perfect Gift</h1>
          <p className="text-xl text-gray-600">Describe the person you're shopping for, and we'll help you find the ideal gift</p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start space-x-4">
            <textarea
              id="gift-input"
              value={giftRequest}
              onChange={(e) => setGiftRequest(e.target.value)}
              placeholder="Example: A 30-year-old software engineer who loves coffee and reading sci-fi novels. They enjoy spending time outdoors and are interested in sustainable products."
              className="flex-grow px-6 py-4 h-32 rounded-xl shadow-lg text-gray-800 bg-white focus:ring-4 focus:ring-orange-400 focus:outline-none text-lg resize-none"
            />
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className={`px-8 py-4 rounded-xl font-semibold text-white shadow-lg transform hover:scale-105 active:scale-95 transition-all bg-gradient-to-r from-yellow-400 to-orange-500 whitespace-nowrap ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}>
              {isLoading ? 'Searching...' : 'Find Gifts'}
            </button>
          </div>
        </div>
      </div>

      {/* 商品展示区域 */}
      <div className="max-w-7xl mx-auto px-4">
        {/* 搜索结果 */}
        {hasSearched ? (
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">
              {searchItems.length > 0 ? 'Recommended Gifts' : 'No gifts found. Try another description!'}
            </h2>
            {searchItems.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {searchItems.map((item) => (
                  <div
                    key={item.gift_id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <div className="aspect-w-1 aspect-h-1">
                      <img
                        src={item.img_url}
                        alt={item.gift_name}
                        className="w-full h-64 object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2 text-gray-800 line-clamp-2">
                        {item.gift_name}
                      </h3>
                      <p className="text-2xl font-bold text-orange-500">
                        ￥{item.gift_price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          // 默认商品展示
          !isLoading && defaultItems.length > 0 && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {defaultItems.map((item) => (
                  <div
                    key={item.gift_id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <div className="aspect-w-1 aspect-h-1">
                      <img
                        src={item.img_url}
                        alt={item.gift_name}
                        className="w-full h-64 object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2 text-gray-800 line-clamp-2">
                        {item.gift_name}
                      </h3>
                      <p className="text-2xl font-bold text-orange-500">
                        ￥{item.gift_price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </main>
  );
}
