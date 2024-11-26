"use client";

import { useState } from "react";
import Link from "next/link";

export default function MainPage() {
  // 分类数据
  const categories = [
    { id: 1, name: "Toys" },
    { id: 2, name: "Books" },
    { id: 3, name: "Electronics" },
    { id: 4, name: "Fashion" },
    { id: 5, name: "Home Decor" },
  ];

  // 示例礼物数据
  const gifts = {
    Toys: [
      {
        id: 1,
        name: "Building Blocks",
        price: "$25.00",
        image:
          "https://firebasestorage.googleapis.com/v0/b/flowspark-1f3e0.appspot.com/o/Tailspark%20Images%2FPlaceholder%20Image.svg?alt=media&token=d199377e-16c1-4b00-b204-0a86c24d8e6a",
      },
      {
        id: 2,
        name: "Stuffed Bear",
        price: "$30.00",
        image:
          "https://firebasestorage.googleapis.com/v0/b/flowspark-1f3e0.appspot.com/o/Tailspark%20Images%2FPlaceholder%20Image.svg?alt=media&token=d199377e-16c1-4b00-b204-0a86c24d8e6a",
      },
    ],
    Books: [
      {
        id: 3,
        name: "Novel 'Mystery Island'",
        price: "$12.00",
        image:
          "https://firebasestorage.googleapis.com/v0/b/flowspark-1f3e0.appspot.com/o/Tailspark%20Images%2FPlaceholder%20Image.svg?alt=media&token=d199377e-16c1-4b00-b204-0a86c24d8e6a",
      },
    ],
    Electronics: [
      {
        id: 4,
        name: "Wireless Earbuds",
        price: "$99.00",
        image:
          "https://firebasestorage.googleapis.com/v0/b/flowspark-1f3e0.appspot.com/o/Tailspark%20Images%2FPlaceholder%20Image.svg?alt=media&token=d199377e-16c1-4b00-b204-0a86c24d8e6a",
      },
    ],
    Fashion: [
      {
        id: 5,
        name: "Silk Scarf",
        price: "$45.00",
        image:
          "https://firebasestorage.googleapis.com/v0/b/flowspark-1f3e0.appspot.com/o/Tailspark%20Images%2FPlaceholder%20Image.svg?alt=media&token=d199377e-16c1-4b00-b204-0a86c24d8e6a",
      },
    ],
    "Home Decor": [
      {
        id: 6,
        name: "Ceramic Vase",
        price: "$60.00",
        image:
          "https://firebasestorage.googleapis.com/v0/b/flowspark-1f3e0.appspot.com/o/Tailspark%20Images%2FPlaceholder%20Image.svg?alt=media&token=d199377e-16c1-4b00-b204-0a86c24d8e6a",
      },
    ],
  };

  const [selectedCategory, setSelectedCategory] = useState("Toys");

  return (
    <section className="min-h-screen bg-yellow-100 text-gray-800 flex">
      {/* 顶部导航按钮 */}
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
          href="/setting"
          className="text-lg font-semibold text-gray-700 hover:text-orange-600 rounded-lg px-4 py-2 transition-all duration-300 transform hover:scale-105 active:scale-90 active:bg-yellow-200 active:shadow-lg"
        >
          Setting
        </Link>
      </div>

      {/* 左侧分类列表 */}
      <aside className="w-1/4 bg-transparent p-4">
        <h2 className="text-lg font-bold mb-4">Categories</h2>
        <ul className="space-y-2">
          {categories.map((category) => (
            <li
              key={category.id}
              onClick={() => setSelectedCategory(category.name)}
              className={`cursor-pointer px-4 py-2 rounded-md transition-colors ${
                selectedCategory === category.name
                  ? "bg-orange-300 text-white font-semibold"
                  : "bg-gray-100 hover:bg-orange-200 text-gray-800"
              }`}
            >
              {category.name}
            </li>
          ))}
        </ul>
      </aside>

      {/* 右侧礼物展示 */}
      <main className="flex-1 bg-transparent p-6 ml-4">
        <h2 className="text-xl font-bold mb-4">{selectedCategory} Gifts</h2>
        <div className="grid grid-cols-3 gap-8">
          {gifts[selectedCategory].map((gift) => (
            <div
              key={gift.id}
              className="bg-orange-50 p-4 rounded-lg shadow hover:shadow-lg transition-transform transform hover:scale-105"
            >
              <img
                src={gift.image}
                alt={gift.name}
                className="h-32 w-full object-cover rounded-md mb-2"
              />
              <h3 className="font-bold text-gray-800">{gift.name}</h3>
              <p className="text-orange-600">{gift.price}</p>
            </div>
          ))}
        </div>
      </main>
    </section>
  );
}
  