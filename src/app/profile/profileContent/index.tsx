import React, { useState, useEffect } from 'react';

interface Profile {
  id: number;
  name: string;
  age: number;
  lastGift: string;
  long_description?: string;
}

interface Gift {
  gift_id: string;
  gift_name: string;
  gift_price: number;
  img_url: string;
}

interface ProfileContentProps {
  selectedProfile: Profile;
  onSave: (profile: Profile) => void;
  onReset: () => void;
}

export default function ProfileContent({
  selectedProfile,
  onSave,
  onReset,
}: ProfileContentProps) {
  const [editedProfile, setEditedProfile] = useState<Profile>(selectedProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [isLoadingGifts, setIsLoadingGifts] = useState(false);

  useEffect(() => {
    setEditedProfile(selectedProfile);
    setIsEditing(false);
  }, [selectedProfile]);

  useEffect(() => {
    const fetchRecommendedGifts = async () => {
      if (!selectedProfile?.long_description) return;

      setIsLoadingGifts(true);
      try {
        const recommendResponse = await fetch('/api/recommend', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: selectedProfile.long_description,
          }),
        });
        const recommendData = await recommendResponse.json();

        if (recommendData.tagIds && recommendData.tagIds.length > 0) {
          const allItems: Gift[] = [];
          for (const tagId of recommendData.tagIds) {
            const itemsResponse = await fetch(`/api/category_item?tag_id=${tagId}`);
            const data = await itemsResponse.json();
            if (data.items && Array.isArray(data.items)) {
              allItems.push(...data.items);
            }
          }

          const uniqueGifts = Array.from(
            new Map(allItems.map(item => [item.gift_id, item])).values()
          );
          setGifts(uniqueGifts);
        }
      } catch (error) {
        console.error('Failed to fetch recommended gifts:', error);
      } finally {
        setIsLoadingGifts(false);
      }
    };

    fetchRecommendedGifts();
  }, [selectedProfile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedProfile);
    setIsEditing(false);
  };

  return (
    <div className="flex-1 bg-white shadow-lg rounded-r-xl p-8 overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Profile Details</h2>
          <div className="space-x-4">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Edit Profile
              </button>
            ) : (
              <div className="space-x-4">
                <button
                  onClick={onReset}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.name}
                  onChange={(e) =>
                    setEditedProfile({ ...editedProfile, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              ) : (
                <p className="text-lg text-gray-800">{selectedProfile.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              {isEditing ? (
                <input
                  type="number"
                  value={editedProfile.age}
                  onChange={(e) =>
                    setEditedProfile({
                      ...editedProfile,
                      age: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              ) : (
                <p className="text-lg text-gray-800">{selectedProfile.age}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Gift
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.lastGift}
                  onChange={(e) =>
                    setEditedProfile({
                      ...editedProfile,
                      lastGift: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              ) : (
                <p className="text-lg text-gray-800">{selectedProfile.lastGift}</p>
              )}
            </div>
          </div>
        </div>

        {/* Gift History Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Gift History</h3>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg mr-4"></div>
              <div>
                <h4 className="font-medium text-gray-800">
                  {selectedProfile.lastGift}
                </h4>
                <p className="text-sm text-gray-600">Purchased on Dec 1, 2023</p>
              </div>
            </div>
            {/* Add more gift history items here */}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Recommended Gifts</h3>
          {isLoadingGifts ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {gifts.map((gift) => (
                <div key={gift.gift_id} className="bg-white shadow-lg rounded-lg p-4">
                  <img
                    src={gift.img_url}
                    alt={gift.gift_name}
                    className="w-full h-48 object-cover mb-4 rounded-lg"
                  />
                  <h3 className="text-lg font-bold mb-2">{gift.gift_name}</h3>
                  <p className="text-orange-500 font-bold">￥{gift.gift_price}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
