"use client";

import { useState } from "react";
import ProfileList from "./profileList";
import ProfileContent from "./profileContent";

export interface Profile {
  name: string;
  age: number;
  lastGift: string;
}

export default function Page() {
  const [profiles, setProfiles] = useState<Profile[]>([
    {
      name: "John Doe",
      age: 30,
      lastGift: "Tennis Racket",
    },
    {
      name: "Jane Smith",
      age: 25,
      lastGift: "Yoga Mat",
    },
  ]);
  const [selectedProfile, setSelectedProfile] = useState<Profile>(profiles[0]);

  // 显式声明handleProfileSelect函数的返回类型为void
  const handleProfileSelect = (profile: Profile): void => {
    setSelectedProfile(profile); // 设置选中的profile
  };

  const handleAddProfile = () => {
    const newProfile: Profile = {
      name: "New Profile",
      age: 0,
      lastGift: "None",
    };
    setProfiles([...profiles, newProfile]);
    setSelectedProfile(newProfile);
  };

  const handleSave = (profileData: Profile) => {
    const updatedProfiles = profiles.map((profile) =>
      profile.name === selectedProfile.name ? profileData : profile
    );
    setProfiles(updatedProfiles);
    setSelectedProfile(profileData);
  };

  const handleReset = () => {
    setSelectedProfile(profiles.find((profile) => profile.name === selectedProfile.name)!);
  };

  return (
    <div className="flex h-screen bg-gradient-to-b from-yellow-100 via-orange-50 to-orange-200">
      {/* Left: Profile List */}
      <ProfileList
        profiles={profiles}
        onProfileSelect={handleProfileSelect} // 确保传递的参数与类型匹配
        onAddProfile={handleAddProfile}
      />
      {/* Right: Profile Content */}
      <ProfileContent
        selectedProfile={selectedProfile}
        onSave={handleSave}
        onReset={handleReset}
      />
    </div>
  );
}
