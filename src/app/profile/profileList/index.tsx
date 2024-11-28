"use client";

// 确保导入了React以防止未定义错误
import React from "react"; 

interface Profile {
  name: string;
  age?: number; // 根据需要可以继续扩展属性
  lastGift?: string;
}

interface ProfileListProps {
  profiles: Profile[];
  onProfileSelect: (profile: Profile) => void;
  onAddProfile: () => void;
  onEditProfile: (profile: Profile) => void; // 编辑回调
  onDeleteProfile: (profile: Profile) => void; // 删除回调
}

export default function ProfileList({
  profiles,
  onProfileSelect,
  onAddProfile,
  onEditProfile,
  onDeleteProfile,
}: ProfileListProps) {
  return (
    <div className="w-1/4 bg-gray-50 p-4">
      <h2 className="text-lg font-semibold mb-6">Profiles</h2>
      <ul className="space-y-4">
        {/* 遍历并显示每个profile */}
        {profiles.map((profile) => (
          <li
            key={profile.name}
            className="flex justify-between items-center p-2 bg-white shadow-sm rounded-md hover:bg-gray-100 transition-all cursor-pointer"
            onClick={() => onProfileSelect(profile)} // 点击选择该profile
          >
            <span>{profile.name}</span>
            <div className="flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation(); // 防止事件冒泡
                  onEditProfile(profile); // 调用编辑回调
                }}
                className="text-sm text-blue-500 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // 防止事件冒泡
                  if (confirm(`Are you sure you want to delete ${profile.name}?`)) {
                    onDeleteProfile(profile); // 调用删除回调
                  }
                }}
                className="text-sm text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      {/* 添加新profile的按钮 */}
      <button
        onClick={onAddProfile}
        className="mt-6 py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition-all"
      >
        Add New Profile
      </button>
    </div>
  );
}
