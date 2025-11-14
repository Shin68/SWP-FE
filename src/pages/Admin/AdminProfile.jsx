import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaHome } from "react-icons/fa";
import { PAGE_URLS, API_BASE_URL } from "../../App/config";
import { useNavigate } from "react-router-dom";

export default function AdminProfile() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [loading, setLoading] = useState(true);
    const [admin, setAdmin] = useState({
        id: "",
        fullname: "",
        email: "",
        address: "",
        dob: "",
        phone: "",
        role: "",
        vehicles: [] // luôn có mảng để backend không lỗi
    });

    // Fetch current admin info
    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const stored = JSON.parse(localStorage.getItem("user"));
                if (!stored || stored.role !== "ADMIN") {
                    navigate(PAGE_URLS.LOGIN);
                    return;
                }

                const res = await axios.get(
                    `${API_BASE_URL}/auth/profile/${stored.id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                setAdmin({
                    id: res.data.id,
                    fullname: res.data.fullname || "",
                    email: res.data.email || "",
                    address: res.data.address || "",
                    dob: res.data.dob || "",
                    phone: res.data.phone || "",
                    role: res.data.role || "",
                    vehicles: res.data.vehicles || []
                });
            } catch (err) {
                console.error("Error fetching admin profile:", err);
                alert("Cannot fetch profile data!");
            } finally {
                setLoading(false);
            }
        };

        fetchAdmin();
    }, [navigate, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAdmin((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                id: admin.id,
                fullname: admin.fullname,
                email: admin.email,
                address: admin.address,
                dob: admin.dob,
                phone: admin.phone,
                role: admin.role,
                vehicles: admin.vehicles // luôn gửi mảng
            };

            await axios.put(
                `${API_BASE_URL}/auth/profile/${admin.id}`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Profile updated successfully!");
        } catch (err) {
            console.error("Update admin profile failed:", err);
            alert("Failed to update profile. Check console.");
        }
    };

    if (loading) return <div className="p-6 text-white">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-700 text-white">
            {/* Header */}
            <header className="bg-gray-800 p-4 flex justify-between items-center">
                <h2 className="text-lg font-semibold">Admin Profile</h2>
                <button
                    onClick={() => navigate(PAGE_URLS.ADMIN_DASHBOARD)}
                    className="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded flex items-center"
                >
                    <FaHome className="mr-2" /> Dashboard
                </button>
            </header>

            {/* Form */}
            <div className="max-w-3xl mx-auto mt-10 bg-gray-800 p-8 rounded-lg shadow-lg">
                <form onSubmit={handleSave} className="space-y-4 text-gray-200">
                    <div>
                        <label className="block mb-1">Full Name</label>
                        <input
                            type="text"
                            name="fullname"
                            value={admin.fullname}
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
                            value={admin.email}
                            onChange={handleChange}
                            className="w-full bg-gray-700 text-white px-3 py-2 rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={admin.phone}
                            readOnly
                            className="w-full bg-gray-600 text-gray-300 px-3 py-2 rounded cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block mb-1">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={admin.address}
                            onChange={handleChange}
                            className="w-full bg-gray-700 text-white px-3 py-2 rounded"
                        />
                    </div>

                    <div>
                        <label className="block mb-1">Date of Birth</label>
                        <input
                            type="date"
                            name="dob"
                            value={admin.dob}
                            onChange={handleChange}
                            className="w-full bg-gray-700 text-white px-3 py-2 rounded"
                        />
                    </div>

                    {/* Role (readonly) */}
                    <div>
                        <label className="block mb-1">Role</label>
                        <input
                            type="text"
                            value={admin.role}
                            readOnly
                            className="w-full bg-gray-600 text-gray-300 px-3 py-2 rounded cursor-not-allowed"
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
