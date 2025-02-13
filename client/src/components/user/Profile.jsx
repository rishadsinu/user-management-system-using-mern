

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, setUser } from "../../redux/slices/authSlice";
import axiosInstance from "../../utils/apiClient";
import { toast } from "react-toastify";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [imageLoading, setImageLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    profileImage: ""
  });

  const user = useSelector((state) => state.user.user);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const loading = !user || Object.keys(user).length === 0;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      setEditData({
        name: user?.name || "",
        email: user?.email || "",
        profileImage: user?.profileImage || ""
      });
    }
  }, [isAuthenticated, user, navigate]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImageLoading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "ums_mern");
    data.append("cloud_name", "dnepk2rnc");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dnepk2rnc/image/upload",
        {
          method: "POST",
          body: data
        }
      );

      const uploadedImage = await res.json();
      
      if (uploadedImage.secure_url) {
        const response = await axiosInstance.put("/user/profile", {
          ...editData,
          profileImage: uploadedImage.secure_url
        });

        if (response.data.success) {
          setEditData(prev => ({ ...prev, profileImage: uploadedImage.secure_url }));
          dispatch(setUser(response.data.user));
          toast.success("Profile image updated successfully");
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    }

    setImageLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleSave = async () => {
    try {
      const response = await axiosInstance.put("/user/profile", editData);

      if (response.status === 200) {
        const { user } = response.data;
        dispatch(setUser(user));
        toast.success("Profile updated successfully");
        setIsEditing(false);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred while updating profile"
      );
    }
  };

  const handleCancel = () => {
    setEditData({
      name: user?.name || "",
      email: user?.email || "",
      profileImage: user?.profileImage || ""
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    dispatch(clearUser());
    navigate("/login");
  };

  if (loading) {
    return <div className="text-center mt-10 text-gray-700">Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg p-6 w-full max-w-md border border-gray-200 text-center relative rounded-lg">
        {/* Profile Image */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-gray-300 overflow-hidden">
              {imageLoading ? (
                <div className="flex items-center justify-center h-full bg-gray-100">
                  <p className="text-sm text-gray-500">Uploading...</p>
                </div>
              ) : editData.profileImage ? (
                <img
                  src={editData.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-100">
                  <img src="upload.svg" alt="Upload" className="w-8 h-8" />
                </div>
              )}
            </div>
            <input
              type="file"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept="image/*"
            />
          </div>
        </div>

        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h1 className="text-xl font-semibold text-gray-700">
            Welcome, {user.name}
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-sm hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        <div className="space-y-4 text-left">
          {isEditing ? (
            <>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={editData.email}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                  readOnly
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="bg-green-500 text-white px-4 py-2 rounded-sm hover:bg-green-600 transition"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-4 py-2 rounded-sm hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium text-gray-800">Name:</span>{" "}
                  {user.name}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium text-gray-800">Email:</span>{" "}
                  {user.email}
                </p>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-sm hover:bg-blue-600 transition"
              >
                Edit Profile
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;