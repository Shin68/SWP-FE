// src/pages/Admin/AdminLayout.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";


export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // ✅ Guard đúng chuẩn
  if (!user || user.role !== "ADMIN") {
    return navigate("/login");
  }

  // ✅ Layout hiển thị khi đúng role
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4 space-y-4">
        <div className="text-xl font-bold">Admin Panel</div>

        <button
          className="block w-full text-left px-3 py-2 rounded hover:bg-gray-700"
          onClick={() => navigate("/admin-dashboard")}
        >
          Dashboard
        </button>

        <button
          className="block w-full text-left px-3 py-2 rounded hover:bg-gray-700"
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
        >
          Logout
        </button>
      </aside>

      {/* Page Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
