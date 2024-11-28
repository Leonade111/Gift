"use client";

import { useState, useEffect } from "react";
import ProfileList from "./profileList";
import ProfileContent from "./profileContent";

interface Profile {
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

  const handleProfileSelect = (profile: Profile) => {
    setSelectedProfile(profile);
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
    setSelectedProfile(profiles.find((profile) => profile.name === selectedProfile.name) || profiles[0]);
  };

  const handleEditProfile = (profile: Profile) => {
    setSelectedProfile(profile);
  };

  const handleDeleteProfile = (profile: Profile) => {
    const updatedProfiles = profiles.filter((p) => p.name !== profile.name);
    setProfiles(updatedProfiles);
    if (selectedProfile.name === profile.name && updatedProfiles.length > 0) {
      setSelectedProfile(updatedProfiles[0]);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-b from-yellow-100 via-orange-50 to-orange-200">
      {/* Left: Profile List */}
      <ProfileList
        profiles={profiles}
        onProfileSelect={handleProfileSelect}
        onAddProfile={handleAddProfile}
        onEditProfile={handleEditProfile} // 传递编辑回调
        onDeleteProfile={handleDeleteProfile} // 传递删除回调
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
