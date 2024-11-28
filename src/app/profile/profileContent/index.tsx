"use client";
// 在文件顶部确保有如下导入
import React from "react"; // 解决 React is not defined 的问题

import { useState, useEffect } from "react";

// 定义Profile类型
interface Profile {
  name: string;
  age: number;
  lastGift: string;
}

// 定义ProfileContentProps接口，确保传递的props类型正确
interface ProfileContentProps {
  selectedProfile: Profile;
  onSave: (profileData: Profile) => void;
  onReset: () => void;
}

export default function ProfileContent({ selectedProfile, onSave, onReset }: ProfileContentProps) {
  const [profileData, setProfileData] = useState<Profile>(selectedProfile);
  const [isSaved, setIsSaved] = useState(true); // 状态跟踪是否保存

  // 检查是否有修改，并更新保存状态
  useEffect(() => {
    setProfileData(selectedProfile);
    setIsSaved(true); // 当选中的 profile 发生变化时，默认认为已保存
  }, [selectedProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setIsSaved(false); // 修改数据后，保存按钮变为可点击状态
  };

  const handleSave = () => {
    onSave(profileData);
    setIsSaved(true); // 保存后，按钮变灰，表示已保存
  };

  return (
    <div className="flex-1 bg-white p-6 shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-4">Profile Details</h2>
      <div className="space-y-4">
        <div>
          <label className="block font-semibold">Name</label>
          <input
            type="text"
            name="name"
            value={profileData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block font-semibold">Age</label>
          <input
            type="number"
            name="age"
            value={profileData.age}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block font-semibold">Last Selected Gift</label>
          <input
            type="text"
            name="lastGift"
            value={profileData.lastGift}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
      </div>
      <div className="mt-6 flex space-x-4">
        <button
          onClick={handleSave}
          disabled={isSaved} // 如果已保存，禁用按钮
          className={`py-2 px-4 rounded-md transition-all ${isSaved ? "bg-gray-300 text-gray-700 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`}
        >
          {isSaved ? "Saved" : "Save Changes"}
        </button>
        <button
          onClick={() => {
            setProfileData(selectedProfile);
            onReset();
          }}
          className="py-2 px-4 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-all"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
