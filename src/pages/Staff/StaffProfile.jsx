import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSpinner, FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import { PAGE_URLS, API_BASE_URL } from "../../App/config";

export default function StaffProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!currentUser || !currentUser.id || !token) {
      navigate(PAGE_URLS.LOGIN);
      return;
    }
  }, [navigate, currentUser, token]);

  useEffect(() => {
    if (!currentUser?.id || !token) return;

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/auth/profile/${currentUser.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          navigate(PAGE_URLS.LOGIN);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser?.id, token]);

  const handleBack = () => {
    navigate(PAGE_URLS.STAFF_DASHBOARD);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <FaArrowLeft /> Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow p-8">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <FaSpinner className="animate-spin text-2xl text-blue-600" />
                <span className="ml-2 text-gray-600">Loading profile...</span>
              </div>
            ) : profile ? (
              <div>
                <h3 className="text-center text-3xl font-bold text-gray-800 mb-8">
                  {profile.fullname}
                </h3>

                <table className="min-w-full text-sm">
                  <tbody>
                    <tr className="border-t">
                      <td className="px-6 py-4 font-medium text-gray-700">Email</td>
                      <td className="px-6 py-4">{profile.email}</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-6 py-4 font-medium text-gray-700">Phone</td>
                      <td className="px-6 py-4">{profile.phone || "—"}</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-6 py-4 font-medium text-gray-700">Role</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          profile.role === "STAFF" ? "bg-blue-100 text-blue-800" :
                          profile.role === "TECHNICIAN" ? "bg-green-100 text-green-800" :
                          profile.role === "ADMIN" ? "bg-purple-100 text-purple-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {profile.role}
                        </span>
                      </td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-6 py-4 font-medium text-gray-700">Address</td>
                      <td className="px-6 py-4">{profile.address || "—"}</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-6 py-4 font-medium text-gray-700">Date of Birth</td>
                      <td className="px-6 py-4">{profile.dob || "—"}</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-6 py-4 font-medium text-gray-700">Account Status</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          profile.accountLocked ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                        }`}>
                          {profile.accountLocked ? "Locked" : "Active"}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-10">No profile data available.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}