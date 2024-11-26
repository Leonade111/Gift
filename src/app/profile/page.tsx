"use client";

import { useState } from "react";
import ProfileList from "./profileList";
import ProfileContent from "./profileContent";

export default function Page() {
  const [profiles, setProfiles] = useState([
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
  const [selectedProfile, setSelectedProfile] = useState(profiles[0]);

  const handleProfileSelect = (profile) => {
    setSelectedProfile(profile);
  };

  const handleAddProfile = () => {
    const newProfile = {
      name: "New Profile",
      age: 0,
      lastGift: "None",
    };
    setProfiles([...profiles, newProfile]);
    setSelectedProfile(newProfile);
  };

  const handleSave = (profileData) => {
    const updatedProfiles = profiles.map((profile) =>
      profile.name === selectedProfile.name ? profileData : profile
    );
    setProfiles(updatedProfiles);
    setSelectedProfile(profileData);
  };

  const handleReset = () => {
    setSelectedProfile(profiles.find((profile) => profile.name === selectedProfile.name));
  };

  return (
    <div className="flex h-screen bg-gradient-to-b from-yellow-100 via-orange-50 to-orange-200">
      {/* Left: Profile List */}
      <ProfileList
        profiles={profiles}
        onProfileSelect={handleProfileSelect}
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
