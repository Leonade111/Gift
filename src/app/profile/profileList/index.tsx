import React from 'react';

interface Profile {
  id: number;  // 支持数字类型的ID
  name: string;
  age: number;
  lastGift?: string;
  long_description?: string;
}

interface ProfileListProps {
  profiles: Profile[];
  selectedProfile: Profile | undefined;
  onProfileSelect: (profile: Profile | undefined) => void;
  onAddProfile: () => void;
  onEditProfile: (profile: Profile) => void;
  onDeleteProfile: (profileId: number) => void;
}

export default function ProfileList({
  profiles,
  selectedProfile,
  onProfileSelect,
  onAddProfile,
  onEditProfile,
  onDeleteProfile,
}: ProfileListProps) {

  const handleAddClick = () => {
    onAddProfile();
  };

  const handleEditClick = (profile: Profile) => {
    onEditProfile(profile);
  };

  const handleDeleteClick = async (profileId: number) => {
    try {
      await onDeleteProfile(profileId);
    } catch (error) {
      console.error('Error deleting profile:', error);
    }
  };

  return (
    <div className="w-1/4 bg-white shadow-lg rounded-l-xl p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">用户列表</h2>
        <button
          onClick={handleAddClick}
          className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>

      <div className="space-y-3">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className={`p-4 rounded-lg cursor-pointer transition-all ${
              selectedProfile?.id === profile.id
                ? 'bg-orange-100 border-2 border-orange-500'
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
            onClick={() => onProfileSelect(profile)}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-gray-800">{profile.name}</h3>
                <p className="text-sm text-gray-600">年龄: {profile.age}</p>
                {profile.lastGift && (
                  <p className="text-sm text-gray-600">上次礼物: {profile.lastGift}</p>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(profile);
                  }}
                  className="text-blue-600 hover:text-blue-800 p-1"
                  title="Edit description"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeleteClick(profile.id)}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}