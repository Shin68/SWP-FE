import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import api from "../../api";
import { PAGE_URLS } from "../../App/config";

export default function ProfileEdit() {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState({
    fullname: "",
    phone: "",
    email: "",
    password: "",
    dob: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!storedUser) {
      navigate(PAGE_URLS.LOGIN);
      return;
    }
    // Khởi tạo form với user localStorage
    setUser(storedUser);
    setLoading(false);
  }, [navigate, storedUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.patch(`/customer/update-profile/${storedUser.id}`, {
        fullname: user.fullname,
        email: user.email,
        address: user.address,
        dob: user.dob,
        password: user.password || undefined, // chỉ gửi nếu người dùng nhập
      });

      // Cập nhật lại user localStorage
      const updatedUser = { ...storedUser, ...res.data };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      alert("Profile updated successfully!");
      navigate(PAGE_URLS.PROFILE_VIEW);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile.");
    }
  };

  if (loading) return <div className="text-center text-white mt-10">Loading...</div>;

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
              value={user.fullname || ""}
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
              value={user.email || ""}
              onChange={handleChange}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Password (optional)</label>
            <input
              type="password"
              name="password"
              value={user.password || ""}
              onChange={handleChange}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded"
              placeholder="Leave blank to keep current password"
            />
          </div>

          <div>
            <label className="block mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={user.phone || ""}
              readOnly
              className="w-full bg-gray-600 text-gray-300 px-3 py-2 rounded cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={user.address || ""}
              onChange={handleChange}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={user.dob || ""}
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
