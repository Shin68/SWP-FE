import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import api from "../../api";
import { PAGE_URLS } from "../../App/config";

export default function ProfileView() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate(PAGE_URLS.LOGIN);
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const res = await api.get(`/customer/vehicle/details/${storedUser.id}`);
        // ⚠️ Nếu BE không có endpoint riêng cho "get profile", bạn có thể bỏ dòng trên
        // và chỉ dùng dữ liệu trong localStorage
        setUser(res.data || storedUser);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setUser(storedUser);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  if (loading) return <div className="text-center text-white mt-10">Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-700 text-white">
      {/* Header */}
      <header className="bg-gray-800 p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">View Profile</h2>
        <button
          onClick={() => navigate(PAGE_URLS.HOME)}
          className="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded flex items-center"
        >
          <FaHome className="mr-2" /> Home
        </button>
      </header>

      {/* Information */}
      <div className="max-w-3xl mx-auto mt-10 bg-gray-800 p-8 rounded-lg shadow-lg">
        <div className="flex items-center gap-6 mb-6">
          <img
            src="/img/avt.jpg"
            alt="Avatar"
            className="h-24 w-24 rounded-full border-4 border-white"
          />
          <div>
            <h3 className="text-2xl font-semibold">{user.fullname}</h3>
            <p className="text-gray-300 text-sm">{user.phone}</p>
          </div>
        </div>

        <div className="space-y-3 text-gray-200">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Address:</strong> {user.address}</p>
          <p><strong>Date of Birth:</strong> {user.dob}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>

        {/* Edit Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={() => navigate(PAGE_URLS.PROFILE_EDIT)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-lg shadow-lg transition-all"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
