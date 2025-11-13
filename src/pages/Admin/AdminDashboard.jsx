import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaList, FaSignOutAlt, FaUserCog, FaSpinner } from "react-icons/fa";
import axios from "axios";
import { PAGE_URLS, API_BASE_URL } from "../../App/config";

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("appointments");
    const [activeUserView, setActiveUserView] = useState("customers"); // "customers" hoặc "staff"
    const [appointments, setAppointments] = useState([]);
    const [users, setUsers] = useState({ customers: [], staff: [] });
    const [revenue, setRevenue] = useState({ total: 0, count: 0, payments: [] });
    const [adminInfo, setAdminInfo] = useState({ fullname: "", email: "", phone: "" });
    const [editingPassword, setEditingPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const user = JSON.parse(localStorage.getItem("user") || "null");
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!user || user.role !== "ADMIN" || !token) {
            navigate(PAGE_URLS.LOGIN);
            return;
        }
    }, [navigate, user, token]);

    // ---------- Fetch Appointments ----------
    useEffect(() => {
        if (activeTab !== "appointments") return;
        const fetchAppointments = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API_BASE_URL}/staff/appointments`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const list = Array.isArray(res.data) ? res.data : [];
                setAppointments(list);
            } catch (err) {
                console.error("Error fetching appointments:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, [activeTab, token]);


    // ---------- Fetch Users ----------
    useEffect(() => {
        if (activeTab !== "users") return;
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API_BASE_URL}/api/admin/users`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const list = Array.isArray(res.data) ? res.data : [];
                const customers = list.filter((u) => u.role === "CUSTOMER");
                const staff = list.filter((u) => u.role === "STAFF" || u.role === "TECHNICIAN");
                setUsers({ customers, staff });
            } catch (err) {
                console.error("Error fetching users:", err);
                setUsers({ customers: [], staff: [] });
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [activeTab, token]);

    // ---------- Fetch Revenue ----------
    useEffect(() => {
        if (activeTab !== "revenue") return;
        const fetchRevenue = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API_BASE_URL}/api/admin/payments/status/PAID`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const payments = Array.isArray(res.data) ? res.data : [];
                const total = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
                setRevenue({ total, count: payments.length, payments });
            } catch (err) {
                console.error("Error fetching revenue:", err);
                setRevenue({ total: 0, count: 0, payments: [] });
            } finally {
                setLoading(false);
            }
        };
        fetchRevenue();
    }, [activeTab, token]);

    // ---------- Fetch Admin Info ----------
    useEffect(() => {
        if (activeTab !== "settings") return;
        const fetchAdmin = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/auth/profile/${user.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAdminInfo(res.data);
            } catch (err) {
                console.error("Error fetching admin info:", err);
            }
        };
        fetchAdmin();
    }, [activeTab, token, user.id]);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate(PAGE_URLS.LOGIN);
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm("Are you sure to delete this user?")) return;
        try {
            await axios.delete(`${API_BASE_URL}/api/admin/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Deleted successfully!");
            setUsers((prev) => ({
                customers: prev.customers.filter((u) => u.id !== id),
                staff: prev.staff.filter((u) => u.id !== id),
            }));
        } catch (err) {
            console.error(err);
            alert("Delete failed");
        }
    };

    // ---------- Render Functions ----------
    const renderAppointments = () => (
        <div>
            <h1 className="text-2xl font-semibold mb-6">Appointments</h1>
            <div className="bg-white shadow rounded overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 text-left text-xs text-gray-600 uppercase">
                        <tr>
                            <th className="px-4 py-3">#</th>
                            <th className="px-4 py-3">Customer</th>
                            <th className="px-4 py-3">Vehicle</th>
                            <th className="px-4 py-3">Branch</th>
                            <th className="px-4 py-3">Date & Time</th>
                            <th className="px-4 py-3">Technician</th>
                            <th className="px-4 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="7" className="px-4 py-6 text-center">
                                    <FaSpinner className="animate-spin mr-2 inline" /> Loading...
                                </td>
                            </tr>
                        ) : appointments.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="px-4 py-6 text-center text-gray-500">
                                    No appointments found.
                                </td>
                            </tr>
                        ) : (
                            appointments.map((a, idx) => (
                                <tr key={a.appointmentId} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-3">#{idx + 1}</td>
                                    <td className="px-4 py-3">{a.customerName}</td>
                                    <td className="px-4 py-3">{a.vehicleName}</td>
                                    <td className="px-4 py-3">{a.branchName}</td>
                                    <td className="px-4 py-3">
                                        {a.appointmentDate} <br /> {a.appointmentTime}
                                    </td>
                                    <td className="px-4 py-3">{a.technicianAssigned || "—"}</td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`px-2 py-1 rounded text-xs ${a.status === "IN_PROGRESS"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : a.status === "PENDING"
                                                    ? "bg-blue-100 text-blue-800"
                                                    : a.status === "ASSIGNED"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-gray-100 text-gray-800"
                                                }`}
                                        >
                                            {a.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderCustomerTable = () => (
        <div>
            <h2 className="text-xl font-semibold mb-2">Customers</h2>
            <table className="min-w-full bg-white rounded shadow">
                <thead className="bg-gray-50 text-gray-600 text-sm">
                    <tr>
                        <th className="px-3 py-2">#</th>
                        <th className="px-3 py-2">Full Name</th>
                        <th className="px-3 py-2">Email</th>
                        <th className="px-3 py-2">Phone</th>
                        <th className="px-3 py-2">Role</th>
                        <th className="px-3 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.customers.map((u, idx) => (
                        <tr key={u.id} className="border-t hover:bg-gray-50">
                            <td className="px-3 py-2">{idx + 1}</td>
                            <td className="px-3 py-2">{u.fullname}</td>
                            <td className="px-3 py-2">{u.email}</td>
                            <td className="px-3 py-2">{u.phone}</td>
                            <td className="px-3 py-2">{u.role}</td>
                            <td className="px-3 py-2">
                                <button
                                    onClick={() => handleDeleteUser(u.id)}
                                    className="px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderStaffTable = () => (
        <div>
            <h2 className="text-xl font-semibold mb-2">Staff / Technician</h2>
            <table className="min-w-full bg-white rounded shadow">
                <thead className="bg-gray-50 text-gray-600 text-sm">
                    <tr>
                        <th className="px-3 py-2">#</th>
                        <th className="px-3 py-2">Full Name</th>
                        <th className="px-3 py-2">Email</th>
                        <th className="px-3 py-2">Phone</th>
                        <th className="px-3 py-2">Role</th>
                        <th className="px-3 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.staff.map((u, idx) => (
                        <tr key={u.id} className="border-t hover:bg-gray-50">
                            <td className="px-3 py-2">{idx + 1}</td>
                            <td className="px-3 py-2">{u.fullname}</td>
                            <td className="px-3 py-2">{u.email}</td>
                            <td className="px-3 py-2">{u.phone}</td>
                            <td className="px-3 py-2">{u.role}</td>
                            <td className="px-3 py-2">
                                <button
                                    onClick={() => handleDeleteUser(u.id)}
                                    className="px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderUsers = () => (
        <div className="space-y-4">
            <div className="flex space-x-2 mb-4">
                <button
                    onClick={() => setActiveUserView("customers")}
                    className={`px-3 py-2 rounded ${activeUserView === "customers" ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-800"}`}
                >
                    Customers
                </button>
                <button
                    onClick={() => setActiveUserView("staff")}
                    className={`px-3 py-2 rounded ${activeUserView === "staff" ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-800"}`}
                >
                    Staff / Technician
                </button>
            </div>
            {activeUserView === "customers" && renderCustomerTable()}
            {activeUserView === "staff" && renderStaffTable()}
        </div>
    );

    const renderRevenue = () => (
        <div className="p-4 space-y-6">
            {loading ? (
                <div className="flex justify-center py-10 text-gray-500">
                    <FaSpinner className="animate-spin mr-2" /> Loading revenue...
                </div>
            ) : (
                <>
                    <div className="text-center bg-white p-6 rounded shadow">
                        <h2 className="text-xl font-bold mb-4">💰 Revenue Overview</h2>
                        <p className="text-lg">Total Transactions: {revenue.count}</p>
                        <p className="text-2xl font-semibold text-green-600">
                            Total Revenue: {revenue.total.toLocaleString()}₫
                        </p>
                    </div>

                    <div className="bg-white p-4 rounded shadow overflow-x-auto">
                        <h3 className="text-lg font-semibold mb-2">Payment Details</h3>
                        <table className="min-w-full text-sm border">
                            <thead className="bg-gray-50 text-gray-700">
                                <tr>
                                    <th className="px-3 py-2 text-left">#</th>
                                    <th className="px-3 py-2 text-left">Customer</th>
                                    <th className="px-3 py-2 text-left">Amount</th>
                                    <th className="px-3 py-2 text-left">Date</th>
                                    <th className="px-3 py-2 text-left">Method</th>
                                </tr>
                            </thead>
                            <tbody>
                                {revenue.payments?.map((p, i) => (
                                    <tr key={p.id} className="border-t">
                                        <td className="px-3 py-2">{i + 1}</td>
                                        <td className="px-3 py-2">{p.customerName}</td>
                                        <td className="px-3 py-2">{p.amount.toLocaleString()}₫</td>
                                        <td className="px-3 py-2">{p.paymentDate}</td>
                                        <td className="px-3 py-2">{p.paymentMethod}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );

    const renderSettings = () => (
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow space-y-4">
            <h2 className="text-xl font-bold text-center mb-4">⚙️ Admin Settings</h2>

            <div className="flex flex-col">
                <label className="text-sm font-medium">Full Name</label>
                <input
                    type="text"
                    value={adminInfo.fullname}
                    onChange={(e) => setAdminInfo({ ...adminInfo, fullname: e.target.value })}
                    className="border p-2 rounded"
                />
            </div>

            <div className="flex flex-col">
                <label className="text-sm font-medium">Email</label>
                <input
                    type="email"
                    value={adminInfo.email}
                    onChange={(e) => setAdminInfo({ ...adminInfo, email: e.target.value })}
                    className="border p-2 rounded"
                />
            </div>

            <div className="flex flex-col">
                <label className="text-sm font-medium">Phone</label>
                <input
                    type="text"
                    value={adminInfo.phone}
                    onChange={(e) => setAdminInfo({ ...adminInfo, phone: e.target.value })}
                    className="border p-2 rounded"
                />
            </div>

            <div className="flex flex-col">
                <label className="text-sm font-medium">Password</label>
                {!editingPassword ? (
                    <div className="flex items-center justify-between border p-2 rounded">
                        <span>******</span>
                        <button
                            type="button"
                            onClick={() => setEditingPassword(true)}
                            className="text-blue-600 hover:underline text-sm"
                        >
                            Edit
                        </button>
                    </div>
                ) : (
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="border p-2 rounded"
                    />
                )}
            </div>

            <button
                onClick={async () => {
                    try {
                        const updateData = { ...adminInfo };
                        if (editingPassword && password) updateData.password = password;
                        await axios.put(`${API_BASE_URL}/auth/update/${user.id}`, updateData, {
                            headers: { Authorization: `Bearer ${token}` },
                        });
                        alert("✅ Admin info updated!");
                        if (editingPassword) setPassword("");
                        setEditingPassword(false);
                    } catch (err) {
                        console.error(err);
                        alert("❌ Update failed.");
                    }
                }}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
                Save Changes
            </button>
        </div>
    );

    return (
        <div className="min-h-screen flex bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white fixed top-0 left-0 bottom-0 flex flex-col">
                <div className="p-4 border-b border-gray-800 text-xl font-bold">Admin Dashboard</div>
                <nav className="flex-1 p-2 space-y-2">
                    <button
                        onClick={() => setActiveTab("appointments")}
                        className={`w-full text-left px-3 py-3 rounded flex items-center gap-3 ${activeTab === "appointments" ? "bg-gray-800 text-white" : "hover:bg-gray-800 text-gray-300"
                            }`}
                    >
                        <FaList /> Appointments
                    </button>

                    <button
                        onClick={() => setActiveTab("users")}
                        className={`w-full text-left px-3 py-3 rounded flex items-center gap-3 ${activeTab === "users" ? "bg-gray-800 text-white" : "hover:bg-gray-800 text-gray-300"
                            }`}
                    >
                        <FaUserCog /> Users
                    </button>

                    <button
                        onClick={() => setActiveTab("revenue")}
                        className={`w-full text-left px-3 py-3 rounded flex items-center gap-3 ${activeTab === "revenue" ? "bg-gray-800 text-white" : "hover:bg-gray-800 text-gray-300"
                            }`}
                    >
                        <FaList /> Revenue
                    </button>

                    <button
                        onClick={() => setActiveTab("settings")}
                        className={`w-full text-left px-3 py-3 rounded flex items-center gap-3 ${activeTab === "settings" ? "bg-gray-800 text-white" : "hover:bg-gray-800 text-gray-300"
                            }`}
                    >
                        <FaUserCog /> Settings
                    </button>

                    <div className="mt-auto border-t border-gray-800 pt-4">
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-3 py-3 rounded flex items-center gap-3 hover:bg-red-800 text-red-300"
                        >
                            <FaSignOutAlt /> Logout
                        </button>
                    </div>
                </nav>

                <div className="p-4 border-t border-gray-800 text-xs text-gray-400">
                    <div>Logged in as</div>
                    <div className="mt-1 font-medium">{user.fullname}</div>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 ml-64 p-6">
                {activeTab === "appointments" && renderAppointments()}
                {activeTab === "users" && renderUsers()}
                {activeTab === "revenue" && renderRevenue()}
                {activeTab === "settings" && renderSettings()}
            </main>
        </div>
    );
}