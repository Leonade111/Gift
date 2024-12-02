"use client"; // 声明为客户端组件

import { useState, useEffect } from "react";
import Link from "next/link";

// 定义商品接口
interface Item {
  gift_id: string;
  gift_name: string;
  gift_price: number;  // 假设价格是数字类型
  img_url: string;
}

export default function MainPage() {
  const [giftRequest, setGiftRequest] = useState(""); // 搜索框的输入
  const [items, setItems] = useState<Item[]>([]); // 存储商品数据

  // 从 API 获取数据
  useEffect(() => {
    // 发起请求，假设你的 API 路径是 '/api/items'
    const fetchItems = async () => {
      try {
        const response = await fetch("/api/items");
        if (response.ok) {
          const data = await response.json();
          setItems(data); // 更新商品数据
        } else {
          console.error("Failed to fetch items.");
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, []);

  // 搜索事件处理
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
          <Link href={`/items/${item.gift_id}`} key={index}>
            <div
              className="bg-white shadow-lg rounded-lg p-6 hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <img
                src={item.img_url}  // 从数据库获取图片 URL
                alt={item.gift_name}  // 商品名称作为图片描述
                className="rounded-lg w-full object-cover h-48"
              />
              <div className="mt-4 text-center">
                <p className="text-lg font-bold text-gray-900">{item.gift_name}</p>
                <p className="text-sm font-serif text-gray-600">￥{item.gift_price}</p>  {/* 显示带￥符号的价格 */}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
