
import React, { useState } from 'react';

const AdminProfileUpdate = () => {
  const [userData, setUserData] = useState({
    username: "patientnew",
    full_name: "patient3-update",
    email: "patient3@gmail.com",
    phone: "21243243"
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...userData });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUserData(formData);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  return (
    <div className="min-h-screen bg-[#0A0C10] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#12141C] border border-[#1E212B] rounded-2xl p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Profile Information</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition"
            >
              Edit Profile
            </button>
          )}
        </div>

        {!isEditing ? (
          /* Display Mode */
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1">Username</label>
              <div className="bg-[#0A0C10] border border-[#1E212B] rounded-lg p-3 text-white">
                {userData.username}
              </div>
            </div>
            
            <div>
              <label className="block text-gray-400 text-sm mb-1">Full Name</label>
              <div className="bg-[#0A0C10] border border-[#1E212B] rounded-lg p-3 text-white">
                {userData.full_name}
              </div>
            </div>
            
            <div>
              <label className="block text-gray-400 text-sm mb-1">Email</label>
              <div className="bg-[#0A0C10] border border-[#1E212B] rounded-lg p-3 text-white">
                {userData.email}
              </div>
            </div>
            
            <div>
              <label className="block text-gray-400 text-sm mb-1">Phone</label>
              <div className="bg-[#0A0C10] border border-[#1E212B] rounded-lg p-3 text-white">
                {userData.phone}
              </div>
            </div>
          </div>
        ) : (
          /* Edit Mode */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full bg-[#0A0C10] border border-[#1E212B] rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-gray-400 text-sm mb-1">Full Name</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                className="w-full bg-[#0A0C10] border border-[#1E212B] rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-gray-400 text-sm mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-[#0A0C10] border border-[#1E212B] rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-gray-400 text-sm mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full bg-[#0A0C10] border border-[#1E212B] rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormData(userData);
                }}
                className="flex-1 bg-[#1A1D27] border border-[#1E212B] hover:bg-[#222530] text-gray-300 font-medium py-2 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminProfileUpdate;