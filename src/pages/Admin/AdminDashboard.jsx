import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaList, FaSignOutAlt, FaSpinner, FaUsers, FaUserCog } from "react-icons/fa";
import axios from "axios";
import { PAGE_URLS, API_BASE_URL } from "../../App/config";


// Modal edit user
function EditUserModal({ user, token, onClose, onUpdated }) {
    const [fullname, setFullname] = useState(user.fullname);
    const [email, setEmail] = useState(user.email);
    const [phone] = useState(user.phone || ""); // readonly
    const [role, setRole] = useState(user.role);
    const [accountLocked, setAccountLocked] = useState(!!user.accountLocked);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.put(
                `${API_BASE_URL}/admin/users/${user.id}`,
                {
                    fullname,
                    email,
                    phone,
                    role,
                    accountLocked,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            onUpdated();
            onClose();
        } catch (err) {
            console.error("Error updating user:", err);
            alert("Update failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-xl font-semibold mb-4">Edit User</h3>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        className="w-full px-3 py-2 border rounded"
                        placeholder="Full Name"
                        value={fullname}
                        onChange={(e) => setFullname(e.target.value)}
                    />
                    <input
                        className="w-full px-3 py-2 border rounded"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className="w-full px-3 py-2 border rounded bg-gray-100"
                        placeholder="Phone"
                        value={phone}
                        readOnly
                    />
                    <select
                        className="w-full px-3 py-2 border rounded"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="CUSTOMER">Customer</option>
                        <option value="STAFF">Staff</option>
                        <option value="TECHNICIAN">Technician</option>
                    </select>
                    <div className="flex justify-end gap-2 mt-2">
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

// Main AdminDashboard
export default function AdminDashboard() {
    const navigate = useNavigate();

    // States
    const [appointments, setAppointments] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [activeTab, setActiveTab] = useState("list");
    const [refreshKey, setRefreshKey] = useState(0);
    const [editingUser, setEditingUser] = useState(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [userPage, setUserPage] = useState(1);
    const [userTotalPages, setUserTotalPages] = useState(1);
    const itemsPerPage = 10;

    // User + token
    const storedUser = localStorage.getItem("user");
    const adminUser = storedUser ? JSON.parse(storedUser) : null;
    const token = localStorage.getItem("token");

    // Redirect if no login
    useEffect(() => {
        if (!adminUser || !adminUser.id || !token) {
            navigate(PAGE_URLS.LOGIN);
        }
    }, [navigate, adminUser, token]);

    // Fetch appointments
    useEffect(() => {
        if (activeTab !== "list" || !token) return;

        const source = axios.CancelToken.source();
        const fetchAppointments = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API_BASE_URL}/admin/appointments`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { page: currentPage - 1, size: itemsPerPage },
                    cancelToken: source.token,
                });
                const list = Array.isArray(res.data.content) ? res.data.content : [];
                setAppointments(list);
                setTotalPages(res.data.totalPages || 1);
            } catch (err) {
                if (!axios.isCancel(err)) console.error("Error fetching appointments:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
        return () => source.cancel();
    }, [activeTab, token, currentPage, refreshKey]);

    // Fetch users
    useEffect(() => {
        if (activeTab !== "users" || !token) return;

        const source = axios.CancelToken.source();
        const fetchUsers = async () => {
            setLoadingUsers(true);
            try {
                const res = await axios.get(`${API_BASE_URL}/admin/users`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { page: userPage - 1, size: itemsPerPage },
                    cancelToken: source.token,
                });
                const list = Array.isArray(res.data.content) ? res.data.content : [];
                setUsers(list);
                setUserTotalPages(res.data.totalPages || 1);
            } catch (err) {
                if (!axios.isCancel(err)) console.error("Error fetching users:", err);
            } finally {
                setLoadingUsers(false);
            }
        };
        fetchUsers();
        return () => source.cancel();
    }, [activeTab, token, userPage, refreshKey]);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate(PAGE_URLS.LOGIN);
    };

    const handlePageChange = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleUserPageChange = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > userTotalPages) return;
        setUserPage(pageNumber);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleRemoveUser = async (user) => {
        if (user.id === adminUser.id) {
            alert("You cannot remove your own account!");
            return;
        }

        if (user.role === "ADMIN") {
            const adminCount = users.filter(u => u.role === "ADMIN").length;
            if (adminCount <= 1) {
                alert("Cannot remove the last admin account!");
                return;
            }
        }

        if (!window.confirm(`Are you sure you want to remove ${user.fullname}?`)) return;

        try {
            await axios.delete(`${API_BASE_URL}/admin/users/${user.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert(`${user.fullname} removed successfully`);
            setRefreshKey((k) => k + 1);
        } catch (err) {
            console.error("Error removing user:", err);
            alert("Failed to remove user");
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white fixed top-0 left-0 bottom-0 flex flex-col">
                <div className="p-4 border-b border-gray-800">
                    <div className="text-xl font-bold">Admin Portal</div>
                </div>

                <nav className="flex-1 p-2">
                    <button
                        onClick={() => setActiveTab("list")}
                        className={`w-full text-left px-3 py-3 rounded flex items-center gap-3 ${activeTab === "list" ? "bg-gray-800 text-white" : "hover:bg-gray-800 text-gray-300"}`}
                    >
                        <FaList /> <span>Appointment List</span>
                    </button>

                    <button
                        onClick={() => setActiveTab("users")}
                        className={`w-full text-left px-3 py-3 rounded flex items-center gap-3 mt-2 ${activeTab === "users" ? "bg-gray-800 text-white" : "hover:bg-gray-800 text-gray-300"}`}
                    >
                        <FaUsers /> <span>User List</span>
                    </button>
                    {/* My Profile */}
                    <button
                        onClick={() => navigate(PAGE_URLS.ADMIN_PROFILE)}
                        className="w-full text-left px-3 py-3 rounded flex items-center gap-3 mt-2 hover:bg-gray-800 text-gray-300"
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
                    <div className="mt-1 font-medium">{adminUser?.fullname || "Admin"}</div>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 ml-64 p-8">
                {/* Appointment List */}
                {activeTab === "list" && (
                    <div className="bg-white shadow rounded-lg p-8 overflow-x-auto max-w-6xl mx-auto">
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Appointment Management</h2>
                        {loading ? (
                            <div className="flex items-center gap-2 text-gray-500">
                                <FaSpinner className="animate-spin" /> Loading...
                            </div>
                        ) : appointments.length === 0 ? (
                            <p className="text-gray-500">No appointments found.</p>
                        ) : (
                            <>
                                <table className="min-w-full text-sm">
                                    <thead className="bg-gray-50 text-left text-xs text-gray-600 uppercase">
                                        <tr>
                                            <th className="px-6 py-3">#</th>
                                            <th className="px-6 py-3">Customer</th>
                                            <th className="px-6 py-3">Vehicle</th>
                                            <th className="px-6 py-3">Branch</th>
                                            <th className="px-6 py-3">Date</th>
                                            <th className="px-6 py-3">Time</th>
                                            <th className="px-6 py-3">Technician</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3">Report</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {appointments.map((a, idx) => (
                                            <tr key={a.id} className="border-t hover:bg-gray-50">
                                                <td className="px-6 py-4">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                                                <td className="px-6 py-4">{a.customerName}</td>
                                                <td className="px-6 py-4">{a.vehicle || "—"}</td>
                                                <td className="px-6 py-4">{a.branch || "—"}</td>
                                                <td className="px-6 py-4">{a.appointmentDate}</td>
                                                <td className="px-6 py-4">{a.appointmentTime}</td>
                                                <td className="px-6 py-4">{a.technicianAssigned || "—"}</td>
                                                <td className="px-6 py-4">
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
                                                <td className="px-6 py-4">{a.report ? `Report #${a.report.id}` : "—"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center mt-4 gap-2">
                                        <button
                                            className="px-3 py-1 border rounded hover:bg-gray-200"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            Prev
                                        </button>
                                        <span className="px-3 py-1">{currentPage} / {totalPages}</span>
                                        <button
                                            className="px-3 py-1 border rounded hover:bg-gray-200"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                {/* User List */}
                {activeTab === "users" && (
                    <div className="bg-white shadow rounded-lg p-8 overflow-x-auto max-w-6xl mx-auto">
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800">User List</h2>
                        {loadingUsers ? (
                            <div className="flex items-center gap-2 text-gray-500">
                                <FaSpinner className="animate-spin" /> Loading...
                            </div>
                        ) : users.length === 0 ? (
                            <p className="text-gray-500">No users found.</p>
                        ) : (
                            <>
                                <table className="min-w-full text-sm">
                                    <thead className="bg-gray-50 text-left text-xs text-gray-600 uppercase">
                                        <tr>
                                            <th className="px-6 py-3">#</th>
                                            <th className="px-6 py-3">Name</th>
                                            <th className="px-6 py-3">Email</th>
                                            <th className="px-6 py-3">Phone</th>
                                            <th className="px-6 py-3">Role</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3">Edit</th>
                                            <th className="px-6 py-3">Remove</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((u, idx) => {
                                            const isEditingDisabled = u.role === "CUSTOMER" || u.role === "ADMIN";
                                            const isRemoveDisabled = u.id === adminUser.id || (u.role === "ADMIN" && users.filter(x => x.role === "ADMIN").length <= 1);

                                            return (
                                                <tr key={u.id} className="border-t hover:bg-gray-50">
                                                    <td className="px-6 py-4">{(userPage - 1) * itemsPerPage + idx + 1}</td>
                                                    <td className="px-6 py-4">{u.fullname}</td>
                                                    <td className="px-6 py-4">{u.email}</td>
                                                    <td className="px-6 py-4">{u.phone || "—"}</td>
                                                    <td className="px-6 py-4">{u.role}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded text-xs ${u.accountLocked ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
                                                            {u.accountLocked ? "Locked" : "Active"}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button
                                                            onClick={() => setEditingUser(u)}
                                                            disabled={isEditingDisabled}
                                                            className={`px-3 py-1 text-xs rounded ${isEditingDisabled ? "bg-gray-500 text-gray-300 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                                                        >
                                                            Edit
                                                        </button>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button
                                                            onClick={() => handleRemoveUser(u)}
                                                            disabled={isRemoveDisabled}
                                                            className={`px-3 py-1 text-xs rounded ${isRemoveDisabled ? "bg-gray-500 text-gray-300 cursor-not-allowed" : "bg-red-600 text-white hover:bg-red-700"}`}
                                                        >
                                                            Remove
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>

                                {/* Pagination for Users */}
                                {userTotalPages > 1 && (
                                    <div className="flex justify-center mt-4 gap-2">
                                        <button
                                            className="px-3 py-1 border rounded hover:bg-gray-200"
                                            onClick={() => handleUserPageChange(userPage - 1)}
                                            disabled={userPage === 1}
                                        >
                                            Prev
                                        </button>
                                        <span className="px-3 py-1">{userPage} / {userTotalPages}</span>
                                        <button
                                            className="px-3 py-1 border rounded hover:bg-gray-200"
                                            onClick={() => handleUserPageChange(userPage + 1)}
                                            disabled={userPage === userTotalPages}
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </main>

            {/* Edit User Modal */}
            {editingUser && editingUser.id !== adminUser.id && (
                <EditUserModal
                    user={editingUser}
                    token={token}
                    onClose={() => setEditingUser(null)}
                    onUpdated={() => setRefreshKey(k => k + 1)}
                />
            )}
        </div>
    );
}