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
  tag_id: string;
}

export default function MainPage() {
  const [giftRequest, setGiftRequest] = useState("");
  const [searchItems, setSearchItems] = useState<Item[]>([]);
  const [defaultItems, setDefaultItems] = useState<Item[]>([]); // 默认商品状态
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [giftStrategy, setGiftStrategy] = useState<string | null>(null);

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

      // 获取推荐的tag_ids
      const recommendResponse = await fetch("/api/gifts/recommend", {
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

      if (recommendResult.success && recommendResult.gifts) {
        setSearchItems(recommendResult.gifts);
        setGiftStrategy(recommendResult.strategy);
      } else {
        setSearchItems([]);
        setGiftStrategy(null);
      }

      setHasSearched(true); // 在所有处理完成后才设置搜索状态
    } catch (error) {
      console.error("Failed to search:", error);
      setHasSearched(true); // 发生错误时也要设置搜索状态
      setSearchItems([]); // 清空搜索结果
      setGiftStrategy(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-orange-600">
              Gift
            </Link>
            <div className="flex space-x-4">
              <Link
                href="/category"
                className="text-gray-600 hover:text-orange-600 px-3 py-2 rounded-md">
                分类
              </Link>
              <Link
                href="/profile"
                className="text-gray-600 hover:text-orange-600 px-3 py-2 rounded-md">
                我的
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 搜索区域 */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex gap-4">
              <input
                type="text"
                value={giftRequest}
                onChange={(e) => setGiftRequest(e.target.value)}
                placeholder="描述你想要的礼物..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className={`px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}>
                {isLoading ? "搜索中..." : "搜索"}
              </button>
            </div>
          </div>
        </div>

        {/* 搜索结果或默认商品展示 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hasSearched && giftStrategy && (
            <div className="col-span-full bg-orange-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-orange-600 mb-2">送礼策略建议</h3>
              <p className="text-gray-700 whitespace-pre-line">{giftStrategy}</p>
            </div>
          )}
          {(hasSearched ? searchItems : defaultItems).map((item) => (
            <div
              key={item.gift_id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={item.img_url || "/placeholder.jpg"}
                  alt={item.gift_name}
                  className="object-cover w-full h-48"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {item.gift_name}
                </h3>
                <p className="text-orange-600 font-bold">
                  ¥{item.gift_price?.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 底部 */}
      <Footer />
    </main>
  );
}
