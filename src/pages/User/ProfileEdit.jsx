import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHome } from "react-icons/fa";
import { PAGE_URLS } from "../../App/config";

export default function ProfileEdit() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    id: "",
    fullname: "",
    email: "",
    password: "",
    dob: "",
    address: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // Fetch current profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) {
          navigate(PAGE_URLS.LOGIN);
          return;
        }

        const res = await axios.get(
          `http://localhost:8080/api/auth/profile/${storedUser.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setUser({
          id: res.data.id || storedUser.id,
          fullname: res.data.fullname || "",
          email: res.data.email || "",
          password: "",
          dob: res.data.dob || "",
          address: res.data.address || "",
          phone: res.data.phone || "",
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
        alert("Cannot fetch profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!user.id) return alert("User ID missing");

      await axios.patch(
        `http://localhost:8080/api/customer/update-profile/${user.id}`,
        {
          fullname: user.fullname,
          email: user.email,
          password: user.password || undefined, // only send if entered
          dob: user.dob,
          address: user.address,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Profile updated successfully!");
      navigate(PAGE_URLS.HOME);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile. Check console for details.");
    }
  };

  if (loading) return <div className="p-6 text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-700 text-white">
      {/* Header */}
      <header className="bg-gray-800 p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Edit Profile</h2>
        <button
          onClick={() => navigate(PAGE_URLS.HOME)}
          className="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded flex items-center"
        >
          <FaHome className="mr-2" /> Home
        </button>
      </header>

      {/* Form */}
      <div className="max-w-3xl mx-auto mt-10 bg-gray-800 p-8 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-4 text-gray-200">
          <div>
            <label className="block mb-1">Full Name</label>
            <input
              type="text"
              name="fullname"
              value={user.fullname}
              onChange={handleChange}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1">New Password</label>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded"
              placeholder="Enter new password if you want to change"
            />
          </div>

          <div>
            <label className="block mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={user.phone}
              readOnly
              className="w-full bg-gray-600 text-gray-300 px-3 py-2 rounded cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={user.address}
              onChange={handleChange}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={user.dob}
              onChange={handleChange}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded"
            />
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold transition-all"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
