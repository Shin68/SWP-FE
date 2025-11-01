import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { PAGE_URLS } from "../../App/config";
import axios from "axios";

export default function ProfileView() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      if (!storedUser || !token) return navigate(PAGE_URLS.LOGIN);

      try {
        const res = await axios.get(
          `http://localhost:8080/api/auth/profile/${storedUser.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        alert("Cannot fetch profile!");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate, storedUser, token]);

  if (loading) return <div className="p-6 text-white">Loading...</div>;
  if (!user) return <div className="p-6 text-white">User not found</div>;

  return (
    <div className="min-h-screen bg-gray-700 text-white">
      <header className="bg-gray-800 p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">View Profile</h2>
        <button
          onClick={() => navigate(PAGE_URLS.HOME)}
          className="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded flex items-center"
        >
          <FaHome className="mr-2" /> Home
        </button>
      </header>

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
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={() => navigate(PAGE_URLS.PROFILE_EDIT, { state: { user } })}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-lg shadow-lg transition-all"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
