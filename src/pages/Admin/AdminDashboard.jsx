import React from "react";
import { useNavigate } from "react-router-dom";
import { PAGE_URLS } from "../../App/config";

export default function AdminDashboard() {
    const navigate = useNavigate();

    // Lấy user từ localStorage
    const user = JSON.parse(localStorage.getItem("user") || "null");

    // Nếu chưa login hoặc không phải admin
    if (!user || user.role !== "ADMIN") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white text-xl">
                Access denied — Admin only
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-800 text-white p-6">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <button
                    onClick={() => {
                        localStorage.removeItem("user");
                        localStorage.removeItem("token");
                        navigate(PAGE_URLS.LOGIN);
                    }}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
                >
                    Logout
                </button>
            </header>

            <section className="bg-gray-700 p-4 rounded mb-6">
                <p>Welcome, <b>{user.fullname}</b></p>
                <p>Role: {user.role}</p>
                <p>Email: {user.email}</p>
                <p>Phone: {user.phone}</p>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                    className="bg-gray-700 p-6 rounded cursor-pointer hover:bg-gray-600"
                    onClick={() => navigate("/admin/users")} // ví dụ
                >
                    <h2 className="text-xl font-semibold mb-2">Users Management</h2>
                    <p>View and manage all registered users</p>
                </div>

                <div
                    className="bg-gray-700 p-6 rounded cursor-pointer hover:bg-gray-600"
                    onClick={() => navigate("/admin/dealers")} // ví dụ
                >
                    <h2 className="text-xl font-semibold mb-2">Service Centers</h2>
                    <p>Manage service centers and staff</p>
                </div>

                <div
                    className="bg-gray-700 p-6 rounded cursor-pointer hover:bg-gray-600"
                    onClick={() => navigate("/admin/reports")}
                >
                    <h2 className="text-xl font-semibold mb-2">Reports</h2>
                    <p>View system reports and analytics</p>
                </div>
            </section>
        </div>
    );
}
