"use client";

import { useState, useEffect } from "react";
import ProfileList from "./profileList";

interface Profile {
  id: number;
  name: string;
  age: number;
  lastGift: string;
  longDescription?: string;
}

interface Gift {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
}

export default function ProfilePage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Profile | undefined>(undefined);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loadingGifts, setLoadingGifts] = useState(false);

  useEffect(() => {
    // 从数据库加载profiles
    const fetchProfiles = async () => {
      try {
        const response = await fetch('/api/profile/getAll');
        const data = await response.json();
        if (data.success) {
          setProfiles(data.profiles);
          setSelectedProfile(data.profiles[0]);
        }
      } catch (error) {
        console.error('Failed to fetch profiles:', error);
      }
    };

    fetchProfiles();
  }, []);

  useEffect(() => {
    if (!selectedProfile || !selectedProfile.longDescription) return;

    const fetchGifts = async () => {
      setLoadingGifts(true);
      try {
        const response = await fetch('/api/gifts/recommend', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            longDescription: selectedProfile.longDescription,
          }),
        });

        const data = await response.json();
        if (data.success) {
          setGifts(data.gifts);
        }
      } catch (error) {
        console.error('Failed to fetch gifts:', error);
      } finally {
        setLoadingGifts(false);
      }
    };

    fetchGifts();
  }, [selectedProfile]);

  const handleProfileSelect = (profile: Profile) => {
    setSelectedProfile(profile);
  };

  const handleAddProfile = () => {
    // This is now handled by the create page
  };

  const handleEditProfile = (profile: Profile) => {
    setSelectedProfile(profile);
  };

  const handleDeleteProfile = async (profile: Profile) => {
    try {
      const response = await fetch(`/api/user/profile?user_id=${profile.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user profile');
      }

      setProfiles((prevProfiles) => {
        const updatedProfiles = prevProfiles.filter((p) => p.id !== profile.id);
        if (selectedProfile?.id === profile.id) {
          setSelectedProfile(updatedProfiles[0] || undefined);
        }
        return updatedProfiles;
      });
    } catch (error) {
      console.error('Error deleting profile:', error);
    }
  };

  return (
    <main className="flex min-h-screen bg-gradient-to-r from-pink-100 via-yellow-100 to-orange-100">
      <ProfileList
        profiles={profiles}
        selectedProfile={selectedProfile}
        onProfileSelect={handleProfileSelect}
        onAddProfile={handleAddProfile}
        onEditProfile={handleEditProfile}
        onDeleteProfile={handleDeleteProfile}
      />

      <div className="flex-1 p-8">
        {loadingGifts ? (
          <div>Loading gifts...</div>
        ) : (
          gifts.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gifts.map((gift) => (
                <div key={gift.id} className="bg-white shadow-lg rounded-lg p-4">
                  <img src={gift.image} alt={gift.name} className="w-full h-48 object-cover mb-4" />
                  <h3 className="text-lg font-bold mb-2">{gift.name}</h3>
                  <p className="text-gray-600 mb-2">{gift.description}</p>
                  <p className="text-orange-500 font-bold">{gift.price}</p>
                </div>
              ))}
            </div>
          ) : (
            <div>No gifts found.</div>
          )
        )}
      </div>
    </main>
  );
}
