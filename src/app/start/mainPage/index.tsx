"use client"; // 声明为客户端组件

import { useState, useEffect } from "react";
import Link from "next/link";
import Footer from "@/app/footer";

// 定义商品接口
interface Item {
  gift_id: string;
  gift_name: string;
  gift_price: number;
  img_url: string;
  created_at: string;
  tags: string[];
}

export default function MainPage() {
  const [giftRequest, setGiftRequest] = useState("");
  const [searchItems, setSearchItems] = useState<Item[]>([]);
  const [defaultItems, setDefaultItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [giftStrategy, setGiftStrategy] = useState("");

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
    if (!giftRequest.trim()) return;

    try {
      setIsLoading(true);
      setHasSearched(false);

      const response = await fetch("/api/gifts/prompt-recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: giftRequest }),
      });

      const result = await response.json();
      console.log("API Response:", result);

      if (result.success) {
        if (Array.isArray(result.gifts)) {
          const formattedItems = result.gifts.map((gift: any) => ({
            gift_id: gift.gift_id?.toString() || '',
            gift_name: gift.gift_name || '',
            gift_price: Number(gift.gift_price) || 0,
            img_url: gift.img_url || '',
            created_at: gift.created_at || '',
            tags: Array.isArray(gift.tags) ? gift.tags.filter(Boolean) : []
          }));
          setSearchItems(formattedItems);
        }
        if (result.strategy) {
          setGiftStrategy(result.strategy);
        }
      } else {
        setSearchItems([]);
        setGiftStrategy("");
      }
    } catch (error) {
      console.error("Search failed:", error);
      setSearchItems([]);
      setGiftStrategy("");
    } finally {
      setIsLoading(false);
      setHasSearched(true);
    }
  };

  // 渲染商品卡片
  const renderGiftCard = (item: Item) => (
    <div
      key={item.gift_id}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="relative h-64">
        <img
          src={item.img_url || '/placeholder-image.jpg'}
          alt={item.gift_name}
          className="w-full h-full object-contain p-4"
        />
      </div>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.gift_name}</h3>
        <p className="text-gray-600 mb-4">${item.gift_price.toFixed(2)}</p>
        <div className="flex flex-wrap gap-2">
          {Array.isArray(item.tags) && item.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 text-sm bg-orange-100 text-orange-800 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

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
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容区域 */}
      <div className="flex-grow pt-24 pb-20">
        {/* 搜索区域 */}
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Find the Perfect Gift
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Describe the person you're shopping for, and we'll help you find the ideal gift
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <textarea
                id="gift-input"
                value={giftRequest}
                onChange={(e) => setGiftRequest(e.target.value)}
                placeholder="Example: A 30-year-old software engineer who loves coffee and reading sci-fi novels. They enjoy spending time outdoors and are interested in sustainable products."
                className="flex-grow px-6 py-4 h-32 rounded-xl border border-gray-200 shadow-sm text-gray-800 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none text-lg resize-none transition-all duration-300"
              />
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className={`px-8 py-4 h-fit rounded-xl font-semibold text-white shadow-md transform hover:scale-105 active:scale-95 transition-all bg-gradient-to-r from-orange-500 to-pink-500 hover:from-pink-500 hover:to-orange-500 whitespace-nowrap ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Searching...' : 'Find Gifts'}
              </button>
            </div>
          </div>
        </div>

        {/* 商品展示区域 */}
        <div className="max-w-7xl mx-auto px-6">
          {hasSearched && (
            <>
              {/* 送礼策略 */}
              {giftStrategy && (
                <div className="mb-8 bg-white rounded-xl p-6 shadow-md">
                  <div className="flex items-center gap-3 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <h3 className="text-xl font-bold text-gray-900">Gift Selection Tips</h3>
                  </div>
                  <div className="text-gray-600 leading-relaxed">
                    {giftStrategy.split('\n').map((paragraph, index) => (
                      paragraph.trim() && (
                        <p key={index} className="mb-2 last:mb-0">
                          {paragraph}
                        </p>
                      )
                    ))}
                  </div>
                </div>
              )}

              {/* 礼物列表 */}
              <div className="mb-16">
                <h2 className="text-3xl font-bold mb-8 text-center">
                  {searchItems.length > 0 ? 'Recommended Gifts' : 'No gifts found. Try another description!'}
                </h2>
                {searchItems.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {searchItems.map(renderGiftCard)}
                  </div>
                )}
              </div>
            </>
          )}
          
          {!hasSearched && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8 text-center">Popular Gifts</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {defaultItems.map(renderGiftCard)}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
