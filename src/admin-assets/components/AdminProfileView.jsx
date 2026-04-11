import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import myaxios from "../../assets/utilities/myaxios";
import { successToast, errorToast } from "../../assets/utilities/toast";

const AdminProfileView = () => {

  const [showConfirm, setShowConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    username: "",
    full_name: "",
    email: "",
    phone: "",
  });

  const [formData, setFormData] = useState(profile);

  const navigate = useNavigate();



  useEffect(() => {

    const fetchProfileData = async () => {

      try {

        const userData =
          await myaxios.get("user-profile");

        setProfile(userData.data.data);

      } catch (err) {

        console.error(err);
        alert("Failed to load profile");

      }

    };

    fetchProfileData();

  }, []);



 

  useEffect(() => {

    setFormData(profile);

  }, [profile]);



  const handleInputChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };


  const handleUpdate = () => {

    setIsEditing(true);

  };


  const handleSave = async () => {

    try {

      const response =
        await myaxios.put(
          "update-profile",
          formData
        );

        
        console.log("Update response:", response);

      if (response?.data?.status) {

        setProfile(formData);

        setIsEditing(false);
        successToast(response.data.message || "Profile updated successfully!");

      }

    } catch (error) {
        console.error("Update error:", error);

      errorToast("Update failed!");

    }

  };


  const handleCancel = () => {

    setFormData(profile);

    setIsEditing(false);

  };


  const handleDelete = () => {

    setShowConfirm(true);

  };


  const confirmDelete = async () => {

    try {

      const response =
        await myaxios.delete(
          "user-profile/"
        );

      if (response?.data?.status) {

        setShowConfirm(false);

        alert(
          response.data.message ||
          "Profile deleted!"
        );

        navigate(
          "/admin/login",
          { replace: true }
        );

      }

    } catch (error) {

      console.error(error);

      alert("Delete failed!");

    }

  };



  const cancelDelete = () => {

    setShowConfirm(false);

  };



  return (

    <div className="min-h-screen bg-linear-to-br from-slate-900 via-gray-900 to-slate-900">

      <div className="relative bg-linear-to-r from-blue-600 to-purple-600 pb-32">

        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div className="relative max-w-5xl mx-auto px-4 pt-12">

          <div className="flex flex-col items-center text-center">

            <div className="w-32 h-32 bg-linear-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-5xl font-bold text-white shadow-2xl mb-4 border-4 border-white">

              {profile.full_name?.charAt(0) || "A"}

            </div>

            <h1 className="text-3xl font-bold text-white mb-2">

              {profile.full_name}

            </h1>

            <p className="text-blue-200 text-lg">

              @{profile.username}

            </p>

          </div>

        </div>

      </div>


      <div className="max-w-4xl mx-auto px-4 -mt-20 pb-12">

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">

        
          <div className="mb-8">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-bold text-white">

                Profile Information

              </h2>



              {!isEditing && (

                <button
                  onClick={handleUpdate}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2"
                >

                  Edit Profile

                </button>

              )}

            </div>



            {!isEditing ? (

              <div className="space-y-4">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">

                    <label className="block text-gray-400 text-sm mb-1">

                      Username

                    </label>

                    <div className="text-white font-medium">

                      {profile.username}

                    </div>

                  </div>



                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">

                    <label className="block text-gray-400 text-sm mb-1">

                      Full Name

                    </label>

                    <div className="text-white font-medium">

                      {profile.full_name}

                    </div>

                  </div>



                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">

                    <label className="block text-gray-400 text-sm mb-1">

                      Email Address

                    </label>

                    <div className="text-white font-medium">

                      {profile.email}

                    </div>

                  </div>



                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">

                    <label className="block text-gray-400 text-sm mb-1">

                      Phone Number

                    </label>

                    <div className="text-white font-medium">

                      {profile.phone}

                    </div>

                  </div>

                </div>

              </div>

            ) : (

              <div className="space-y-4">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {["username","full_name","email","phone"].map((field)=>(
                    <div key={field}>

                      <label className="block text-gray-300 text-sm mb-2">

                        {field.replace("_"," ").toUpperCase()}

                      </label>

                      <input
                        type="text"
                        name={field}
                        value={formData[field] || ""}
                        onChange={handleInputChange}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />

                    </div>
                  ))}

                </div>



                <div className="flex gap-3 pt-4">

                  <button
                    onClick={handleSave}
                    className="flex-1 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium py-3 rounded-xl transition-all"
                  >
                    Save Changes
                  </button>

                  <button
                    onClick={handleCancel}
                    className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium py-3 rounded-xl transition-all"
                  >
                    Cancel
                  </button>

                </div>

              </div>

            )}

          </div>

         

          <div className="pt-6 border-t border-white/10">

            <button
              onClick={handleDelete}
              className="w-full bg-linear-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-medium py-3 rounded-xl transition-all"
            >
              Delete Account
            </button>

          </div>

        </div>

      </div>


      {showConfirm && (

        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">

          <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-2xl max-w-md w-full p-6 border border-red-500/30 shadow-2xl">

            <h3 className="text-2xl font-bold text-white mb-2 text-center">

              Delete Account

            </h3>

            <p className="text-gray-300 mb-6 text-center">

              Are you sure you want to delete this profile?

            </p>

            <div className="flex gap-3">

              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-xl transition-all"
              >
                Yes, Delete
              </button>

              <button
                onClick={cancelDelete}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 rounded-xl transition-all"
              >
                Cancel
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

};

export default AdminProfileView;