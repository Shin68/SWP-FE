import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { PAGE_URLS } from "../../App/config";

export default function ProfileView() {
  const navigate = useNavigate();

  const user = {
    name: "Tran Quang Hieu",
    phone: "0123456789",
    email: "hieu@example.com",
    password: "********",
    dob: "2001-05-20",
    address: "Thu Duc City, Ho Chi Minh",
  };

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
            <h3 className="text-2xl font-semibold">{user.name}</h3>
            <p className="text-gray-300 text-sm">{user.phone}</p>
          </div>
        </div>

        <div className="space-y-3 text-gray-200">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Password:</strong> {user.password}</p>
          <p><strong>Address:</strong> {user.address}</p>
          <p><strong>Date of Birth:</strong> {user.dob}</p>
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
