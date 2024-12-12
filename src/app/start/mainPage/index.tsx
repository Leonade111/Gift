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
        const response = await fetch("/api/default_items");
        const data = await response.json();
        setDefaultItems(data.items || []); // 假设API返回的数据结构包含items
      } catch (error) {
        console.error("Failed to fetch default items:", error);
      }
    };
    
    fetchDefaultItems();
  }, []);

  // 搜索事件处理
  const handleSearch = async () => {
    try {
      setIsLoading(true);
      setHasSearched(true);
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
        const tagId = recommendResult.tagIds[0];
        console.log("Using tag_id:", tagId);
        // 使用第一个推荐的tag_id获取礼物
        const itemsResponse = await fetch(`/api/category_item?tag_id=${tagId}&page=1`);
        const data = await itemsResponse.json();
        console.log("Category items API response:", data);
        
        if (data.items && Array.isArray(data.items)) {
          setSearchItems(data.items);
          setTotalPages(data.pagination.totalPages);
        } else {
          console.error("Invalid items data structure:", data);
        }
      }
    } catch (error) {
      console.error("Failed to search:", error);
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

      {/* 输入框 */}
      <div className="max-w-7xl mx-auto mb-10">
        <label
          className="block text-2xl font-semibold mb-6"
          htmlFor="gift-input">
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
            disabled={isLoading}
            className={`bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-4 rounded-lg font-semibold text-white shadow-lg transform hover:scale-105 active:scale-95 transition-all ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}>
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* 搜索结果展示 */}
      {hasSearched && (
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            {searchItems.length > 0 ? 'Recommended Gifts' : 'No gifts found. Try another description!'}
          </h2>
          {searchItems.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {searchItems.map((item) => (
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
              
              {/* 分页控件 */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || isLoading}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === 1 || isLoading
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-orange-500 hover:bg-orange-600 text-white'
                    }`}>
                    Previous
                  </button>
                  <span className="px-4 py-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || isLoading}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === totalPages || isLoading
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-orange-500 hover:bg-orange-600 text-white'
                    }`}>
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* 当没有搜索时，显示默认商品 */}
      {!hasSearched && !giftRequest && defaultItems.length > 0 && (
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-center">Default Recommended Gifts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {defaultItems.map((item) => (
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
        </div>
      )}
    </main>
  );
}
