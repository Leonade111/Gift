"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import ProfileList from "./profileList";
import Link from 'next/link';
import Footer from "@/app/footer";
import Image from 'next/image';

interface Profile {
  id: number;
  name: string;
  age: number;
  lastGift?: string;
  long_description?: string;
}

interface Gift {
  id: number;
  gift_id: number;
  gift_name: string;
  description: string;
  gift_price: string;
  img_url: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Profile | undefined>(undefined);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loadingGifts, setLoadingGifts] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');

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

  useEffect(() => {
    fetchProfiles();
  }, []);

  useEffect(() => {
    if (!selectedProfile || !selectedProfile.long_description) return;

    const fetchGifts = async () => {
      if (!selectedProfile) return;
      
      setLoadingGifts(true);
      try {
        // 先尝试获取缓存的推荐
        const cacheResponse = await fetch(`/api/gift-cache?profileId=${selectedProfile.id}`);
        const cacheData = await cacheResponse.json();

        if (cacheData.cached) {
          // 使用缓存的推荐
          setGifts(cacheData.gifts);
        } else {
          // 没有缓存或缓存过期，调用 AI 接口
          const response = await fetch('/api/gifts/recommend', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              longDescription: selectedProfile.long_description
            })
          });

          const data = await response.json();
          if (data.success) {
            setGifts(data.gifts);
            // 存储到缓存
            await fetch('/api/gift-cache', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                profileId: selectedProfile.id,
                gifts: data.gifts
              })
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch gifts:', error);
      } finally {
        setLoadingGifts(false);
      }
    };

    fetchGifts();
  }, [selectedProfile]);

  const handleProfileSelect = (profile: Profile | undefined) => {
    setSelectedProfile(profile);
  };

  const handleAddProfile = () => {
    router.push('/profile/create');
  };

  const handleEditProfile = (profile: Profile) => {
    setIsEditing(true);
    setEditedDescription(profile.long_description || '');
  };

  const handleSaveDescription = async () => {
    if (!selectedProfile) return;

    try {
      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedProfile.id,
          long_description: editedDescription,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // 更新本地状态
        setProfiles(profiles.map(p => 
          p.id === selectedProfile.id 
            ? { ...p, long_description: editedDescription }
            : p
        ));
        setSelectedProfile({ ...selectedProfile, long_description: editedDescription });
        setIsEditing(false);
        // 重新获取礼物推荐
        const fetchGifts = async () => {
          setLoadingGifts(true);
          try {
            const response = await fetch('/api/gifts/recommend', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                longDescription: editedDescription,
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
      } else {
        throw new Error(data.error || '更新失败');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('更新失败，请稍后重试');
    }
  };

  const handleDeleteProfile = async (profileId: number) => {
    try {
      // 找到要删除的profile
      const profileToDelete = profiles.find(p => p.id === profileId);
      if (!profileToDelete) return;

      // 立即从本地状态中移除用户
      const newProfiles = profiles.filter((p) => p.id !== profileId);
      setProfiles(newProfiles);
      
      // 如果删除的是当前选中的用户，选择新的用户或设置为undefined
      if (selectedProfile?.id === profileId) {
        setSelectedProfile(newProfiles.length > 0 ? newProfiles[0] : undefined);
      }

      // 调用删除API
      const response = await fetch(`/api/user/profile?user_id=${encodeURIComponent(profileId)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete profile');
      }
    } catch (error) {
      console.error('Error handling profile deletion:', error);
      // 如果出错，重新加载用户列表
      fetchProfiles();
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50">
      {/* 导航栏 */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link
              href="/"
              className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-pink-600 hover:from-pink-600 hover:to-orange-600 transition-all duration-300"
            >
              Gift Finder
            </Link>
            <div className="flex items-center space-x-8">
              <Link
                href="/"
                className="relative text-[0.95rem] font-medium text-gray-600 hover:text-orange-500 transition-colors duration-300 after:absolute after:left-0 after:bottom-[-4px] after:h-0.5 after:w-0 hover:after:w-full after:bg-gradient-to-r after:from-orange-500 after:to-pink-500 after:transition-all after:duration-300"
              >
                Home
              </Link>
              <Link
                href="/start"
                className="relative text-[0.95rem] font-medium text-gray-600 hover:text-orange-500 transition-colors duration-300 after:absolute after:left-0 after:bottom-[-4px] after:h-0.5 after:w-0 hover:after:w-full after:bg-gradient-to-r after:from-orange-500 after:to-pink-500 after:transition-all after:duration-300"
              >
                Start
              </Link>
              <Link
                href="/category"
                className="relative text-[0.95rem] font-medium text-gray-600 hover:text-orange-500 transition-colors duration-300 after:absolute after:left-0 after:bottom-[-4px] after:h-0.5 after:w-0 hover:after:w-full after:bg-gradient-to-r after:from-orange-500 after:to-pink-500 after:transition-all after:duration-300"
              >
                Category
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <div className="flex-grow pt-24 pb-20">
        <div className="flex max-w-7xl mx-auto px-6 gap-8">
          {/* 个人资料列表 */}
          <ProfileList
            profiles={profiles}
            selectedProfile={selectedProfile}
            onProfileSelect={handleProfileSelect}
            onAddProfile={handleAddProfile}
            onEditProfile={handleEditProfile}
            onDeleteProfile={handleDeleteProfile}
          />

          {/* 右侧内容区域 */}
          <div className="flex-1">
            {selectedProfile ? (
              <div className="space-y-8">
                {/* 个人资料卡片 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                          {selectedProfile.name}'s Profile
                        </h2>
                        <p className="text-gray-500">Age: {selectedProfile.age}</p>
                      </div>
                      {!isEditing && (
                        <button
                          onClick={() => handleEditProfile(selectedProfile)}
                          className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors duration-300"
                        >
                          Edit Profile
                        </button>
                      )}
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">About {selectedProfile.name}</h3>
                      {isEditing ? (
                        <div className="space-y-4">
                          <textarea
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                            className="w-full h-40 px-4 py-3 text-gray-700 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 resize-none"
                            placeholder="Please enter personal description..."
                          />
                          <div className="flex justify-end gap-4">
                            <button
                              onClick={() => setIsEditing(false)}
                              className="px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-300"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleSaveDescription}
                              className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-pink-500 hover:from-pink-500 hover:to-orange-500 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5"
                            >
                              Save Changes
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-600 whitespace-pre-wrap">
                          {selectedProfile.long_description || 'No description yet'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 推荐礼物区域 */}
                {loadingGifts ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="w-8 h-8 rounded-full border-3 border-orange-500 border-t-transparent animate-spin"></div>
                  </div>
                ) : gifts.length > 0 ? (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-gray-900">Recommended Gifts</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {gifts.map((gift) => (
                        <div
                          key={gift.gift_id}
                          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                        >
                          <div className="aspect-w-1 aspect-h-1">
                            <Image
                              src={gift.img_url || '/placeholder.jpg'}
                              alt={gift.gift_name}
                              width={300}
                              height={256}
                              className="w-full h-64 object-contain p-4"
                            />
                          </div>
                          <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                              {gift.gift_name}
                            </h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                              {gift.description || 'A perfect gift for your loved one'}
                            </p>
                            <div className="flex items-center justify-between">
                              <p className="text-xl font-bold text-orange-600">
                                ￥{gift.gift_price}
                              </p>
                              <button className="text-sm px-4 py-2 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors duration-300">
                                View Details
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                    <p className="text-lg">No gift recommendations available.</p>
                    <p className="text-sm mt-2">Try updating the profile description to get personalized recommendations.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-12 text-gray-500">
                <p className="text-lg">Select a profile to view details</p>
                <button
                  onClick={handleAddProfile}
                  className="mt-4 px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-pink-500 hover:from-pink-500 hover:to-orange-500 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Create New Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}