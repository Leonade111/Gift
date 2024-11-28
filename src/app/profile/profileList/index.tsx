"use client";

import { useState } from "react";
import 

export default function ProfileList({ profiles, onProfileSelect, onAddProfile }) {
  return (
    <div className="w-1/4 bg-gray-50 p-4">
      <h2 className="text-lg font-semibold mb-6">Profiles</h2>
      <ul className="space-y-4">
        {profiles.map((profile, index) => (
          <li
            key={profile.name}
            className="flex justify-between items-center p-2 bg-white shadow-sm rounded-md hover:bg-gray-100 transition-all cursor-pointer"
            onClick={() => onProfileSelect(profile)}
          >
            <span>{profile.name}</span>
            <div className="flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // 编辑按钮的功能，跳转到编辑页面
                  console.log(`Edit profile: ${profile.name}`);
                }}
                className="text-sm text-blue-500"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // 删除按钮的功能
                  console.log(`Delete profile: ${profile.name}`);
                }}
                className="text-sm text-red-500"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button
        onClick={onAddProfile}
        className="mt-6 py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition-all"
      >
        Add New Profile
      </button>
    </div>
  );
}
