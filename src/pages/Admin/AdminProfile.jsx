import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaList, FaSignOutAlt, FaSpinner, FaUsers, FaUserCog } from "react-icons/fa";
import axios from "axios";
import { PAGE_URLS, API_BASE_URL } from "../../App/config";

// Modal Edit Profile
function EditProfileModal({ profile, token, onClose, onUpdated }) {
    const [fullname, setFullname] = useState(profile.fullname);
    const [email, setEmail] = useState(profile.email);
    const [phone] = useState(profile.phone || "");
    const [address, setAddress] = useState(profile.address || "");
    const [dob, setDob] = useState(profile.dob || "");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setFullname(profile.fullname);
        setEmail(profile.email);
        setAddress(profile.address || "");
        setDob(profile.dob || "");
    }, [profile]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.put(
                `${API_BASE_URL}/auth/profile/${profile.id}`,
                { fullname, email, address, dob },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            onUpdated();
            onClose();
        } catch (err) {
            console.error("Error updating profile:", err);
            alert("Update failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-xl font-semibold mb-4">Edit Profile</h3>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        className="w-full px-3 py-2 border rounded"
                        placeholder="Full Name"
                        value={fullname}
                        onChange={(e) => setFullname(e.target.value)}
                        required
                    />
                    <input
                        className="w-full px-3 py-2 border rounded"
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        className="w-full px-3 py-2 border rounded bg-gray-100"
                        placeholder="Phone"
                        value={phone}
                        readOnly
                    />
                    <input
                        className="w-full px-3 py-2 border rounded"
                        placeholder="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    <input
                        className="w-full px-3 py-2 border rounded"
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                    />
                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function AdminProfile() {
    const navigate = useNavigate();

    // State
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    // User + token
    const storedUser = localStorage.getItem("user");
    const currentUser = storedUser ? JSON.parse(storedUser) : null;
    const token = localStorage.getItem("token");

    // Redirect nếu chưa đăng nhập
    useEffect(() => {
        if (!currentUser || !currentUser.id || !token) {
            navigate(PAGE_URLS.LOGIN);
        }
    }, [navigate, currentUser, token]);

    // Fetch profile
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
                } else {
                    alert("Failed to load profile.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [currentUser?.id, token, refreshKey]);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate(PAGE_URLS.LOGIN);
    };

    return (
        <div className="min-h-screen flex bg-gray-100">
            {/* Sidebar - giống Dashboard */}
            <aside className="w-64 bg-gray-900 text-white fixed top-0 left-0 bottom-0 flex flex-col">
                <div className="p-4 border-b border-gray-800">
                    <div className="text-xl font-bold">Admin Portal</div>
                </div>

                <nav className="flex-1 p-2">
                    <button
                        onClick={() => navigate(PAGE_URLS.ADMIN_DASHBOARD)}
                        className="w-full text-left px-3 py-3 rounded flex items-center gap-3 hover:bg-gray-800 text-gray-300"
                    >
                        <FaList /> <span>Appointment List</span>
                    </button>

                    <button
                        onClick={() => navigate(PAGE_URLS.ADMIN_DASHBOARD + "?tab=users")}
                        className="w-full text-left px-3 py-3 rounded flex items-center gap-3 mt-2 hover:bg-gray-800 text-gray-300"
                    >
                        <FaUsers /> <span>User List</span>
                    </button>

                    <button
                        onClick={() => navigate(PAGE_URLS.ADMIN_PROFILE)}
                        className="w-full text-left px-3 py-3 rounded flex items-center gap-3 mt-2 bg-gray-800 text-white"
                    >
                        <FaUserCog /> <span>My Profile</span>
                    </button>

                    <div className="mt-6 border-t border-gray-800 pt-4">
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-3 py-3 rounded flex items-center gap-3 hover:bg-red-800 text-red-300"
                        >
                            <FaSignOutAlt /> <span>Logout</span>
                        </button>
                    </div>
                </nav>

                <div className="p-4 border-t border-gray-800 text-xs text-gray-400">
                    <div>Logged in as</div>
                    <div className="mt-1 font-medium">{currentUser?.fullname || "User"}</div>
                </div>
            </aside>

            {/* Main Content - giống bảng Dashboard */}
            <main className="flex-1 ml-64 p-8">
                <div className="bg-white shadow rounded-lg p-8 max-w-5xl mx-auto">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800">My Profile</h2>

                    {loading ? (
                        <div className="flex items-center gap-2 text-gray-500">
                            <FaSpinner className="animate-spin" /> Loading profile...
                        </div>
                    ) : profile ? (
                        <div>
                            {/* Tên to, đậm, căn giữa */}
                            <h3 className="text-center text-3xl font-bold text-gray-800 mb-8">
                                {profile.fullname}
                            </h3>

                            {/* Bảng 2 cột - giống User List */}
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
                                            <span className={`px-3 py-1 rounded-full text-xs ${profile.role === "ADMIN" ? "bg-purple-100 text-purple-800" :
                                                profile.role === "STAFF" ? "bg-blue-100 text-blue-800" :
                                                    profile.role === "TECHNICIAN" ? "bg-green-100 text-green-800" :
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
                                            <span className={`px-3 py-1 rounded-full text-xs ${profile.accountLocked ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                                                }`}>
                                                {profile.accountLocked ? "Locked" : "Active"}
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className="flex justify-center mt-8">
                                <button
                                    onClick={() => setEditing(true)}
                                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                >
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">No profile data available.</p>
                    )}
                </div>
            </main>

            {/* Edit Modal */}
            {editing && profile && (
                <EditProfileModal
                    profile={profile}
                    token={token}
                    onClose={() => setEditing(false)}
                    onUpdated={() => setRefreshKey(k => k + 1)}
                />
            )}
        </div>
    );
}