import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaList,
    FaSignOutAlt,
    FaSpinner,
    FaUsers,
    FaUserCog,
} from "react-icons/fa";
import axios from "axios";
import { PAGE_URLS, API_BASE_URL } from "../../App/config";

// ----------------- Modal Edit User -----------------
function EditUserModal({ user, token, onClose, onUpdated }) {
    const [fullname, setFullname] = useState(user.fullname);
    const [email, setEmail] = useState(user.email);
    const [phone] = useState(user.phone || "");
    const [role, setRole] = useState(user.role);
    const [accountLocked, setAccountLocked] = useState(!!user.accountLocked);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.put(
                `${API_BASE_URL}/admin/users/${user.id}`,
                { fullname, email, phone, role, accountLocked },
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
                        required
                    />
                    <input
                        className="w-full px-3 py-2 border rounded"
                        placeholder="Email"
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
                    <select
                        className="w-full px-3 py-2 border rounded"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="CUSTOMER">Customer</option>
                        <option value="STAFF">Staff</option>
                        <option value="TECHNICIAN">Technician</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                    <label className="flex items-center gap-2 mt-2">
                        <input
                            type="checkbox"
                            checked={accountLocked}
                            onChange={(e) => setAccountLocked(e.target.checked)}
                        />
                        Account Locked
                    </label>
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

// ----------------- Modal Edit Service Center -----------------
function EditServiceCenterModal({ center, token, onClose, onUpdated }) {
    const [centerName, setCenterName] = useState(center?.name || "");
    const [centerLocation, setCenterLocation] = useState(center?.location || "");
    const [centerContact, setCenterContact] = useState(center?.contactNumber || "");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.put(
                `${API_BASE_URL}/admin/service-centers/${center.id}`,
                {
                    name: centerName,
                    location: centerLocation,
                    contactNumber: centerContact
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            onUpdated();
            onClose();
        } catch (err) {
            console.error("Error updating center:", err);
            alert("Update failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-xl font-semibold mb-4">Edit Service Center</h3>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        className="w-full px-3 py-2 border rounded"
                        placeholder="Name"
                        value={centerName}
                        onChange={(e) => setCenterName(e.target.value)}
                        required
                    />
                    <input
                        className="w-full px-3 py-2 border rounded"
                        placeholder="Location"
                        value={centerLocation}
                        onChange={(e) => setCenterLocation(e.target.value)}
                        required
                    />
                    <input
                        className="w-full px-3 py-2 border rounded"
                        placeholder="Contact Number"
                        value={centerContact}
                        onChange={(e) => setCenterContact(e.target.value)}
                    />
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

// ----------------- Main Admin Dashboard -----------------
export default function AdminDashboard() {
    const navigate = useNavigate();
    const storedUser = localStorage.getItem("user");
    const adminUser = storedUser ? JSON.parse(storedUser) : null;
    const token = localStorage.getItem("token");

    const [activeTab, setActiveTab] = useState("list");

    // Appointments
    const [appointments, setAppointments] = useState([]);
    const [loadingAppointments, setLoadingAppointments] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Users
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [userPage, setUserPage] = useState(1);
    const [userTotalPages, setUserTotalPages] = useState(1);
    const [editingUser, setEditingUser] = useState(null);

    // Service Centers
    const [centers, setCenters] = useState([]);
    const [loadingCenters, setLoadingCenters] = useState(false);
    const [centerPage, setCenterPage] = useState(1);
    const [centerTotalPages, setCenterTotalPages] = useState(1);
    const [editingCenter, setEditingCenter] = useState(null);

    // ----------------- Part Maintenance -----------------
    const [parts, setParts] = useState([]);
    const [partTypes, setPartTypes] = useState([]);
    const [loadingParts, setLoadingParts] = useState(false);
    const [loadingPartTypes, setLoadingPartTypes] = useState(false);
    const [partPage, setPartPage] = useState(1);
    const [partTotalPages, setPartTotalPages] = useState(1);

    const [refreshKey, setRefreshKey] = useState(0);
    const itemsPerPage = 10;

    useEffect(() => {
        if (!adminUser || !adminUser.id || !token) {
            navigate(PAGE_URLS.LOGIN);
        }
    }, [navigate, adminUser, token]);

    // ----------------- Fetch Appointments -----------------
    useEffect(() => {
        if (activeTab !== "list" || !token) return;
        const source = axios.CancelToken.source();
        const fetchAppointments = async () => {
            setLoadingAppointments(true);
            try {
                const res = await axios.get(`${API_BASE_URL}/admin/appointments`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { page: currentPage - 1, size: itemsPerPage },
                    cancelToken: source.token,
                });
                setAppointments(res.data.content || []);
                setTotalPages(res.data.totalPages || 1);
            } catch (err) {
                if (!axios.isCancel(err)) console.error(err);
            } finally {
                setLoadingAppointments(false);
            }
        };
        fetchAppointments();
        return () => source.cancel();
    }, [activeTab, token, currentPage, refreshKey]);

    // ----------------- Fetch Users -----------------
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
                setUsers(res.data.content || []);
                setUserTotalPages(res.data.totalPages || 1);
            } catch (err) {
                if (!axios.isCancel(err)) console.error(err);
            } finally {
                setLoadingUsers(false);
            }
        };
        fetchUsers();
        return () => source.cancel();
    }, [activeTab, token, userPage, refreshKey]);

    // ----------------- Fetch Service Centers -----------------
    useEffect(() => {
        if (activeTab !== "centers" || !token) return;
        const source = axios.CancelToken.source();
        const fetchCenters = async () => {
            setLoadingCenters(true);
            try {
                const res = await axios.get(`${API_BASE_URL}/admin/service-centers`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCenters(Array.isArray(res.data.content) ? res.data.content : (Array.isArray(res.data) ? res.data : []));
                setCenterTotalPages(res.data.totalPages || 1);
            } catch (err) {
                if (!axios.isCancel(err)) console.error(err);
            } finally {
                setLoadingCenters(false);
            }
        };
        fetchCenters();
        return () => source.cancel();
    }, [activeTab, token, centerPage, refreshKey]);

    // ----------------- Fetch Part Types -----------------
    useEffect(() => {
        if (activeTab !== "parts" || !token) return;
        const source = axios.CancelToken.source();
        const fetchPartTypes = async () => {
            setLoadingPartTypes(true);
            try {
                const res = await axios.get(`${API_BASE_URL}/admin/part-types`, {
                    headers: { Authorization: `Bearer ${token}` },
                    cancelToken: source.token,
                });
                setPartTypes(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                if (!axios.isCancel(err)) console.error("Error fetching part types:", err);
            } finally {
                setLoadingPartTypes(false);
            }
        };
        fetchPartTypes();
        return () => source.cancel();
    }, [activeTab, token, refreshKey]);
    // ----------------- Fetch Parts -----------------
    useEffect(() => {
        if (activeTab !== "parts" || !token) return;
        const source = axios.CancelToken.source();
        const fetchParts = async () => {
            setLoadingParts(true);
            try {
                const res = await axios.get(`${API_BASE_URL}/admin/parts`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { page: partPage - 1, size: itemsPerPage },
                    cancelToken: source.token,
                });
                setParts(res.data.content || []);
                setPartTotalPages(res.data.totalPages || 1);
            } catch (err) {
                if (!axios.isCancel(err)) console.error(err);
            } finally {
                setLoadingParts(false);
            }
        };
        fetchParts();
        return () => source.cancel();
    }, [activeTab, token, partPage, refreshKey]);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate(PAGE_URLS.LOGIN);
    };

    const getServiceTypeName = (partTypeId) => {
        if (!partTypeId) return "—";
        const type = partTypes.find(pt => pt.id === partTypeId);
        return type?.partType?.name || "—";
    };

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleUserPageChange = (page) => {
        if (page < 1 || page > userTotalPages) return;
        setUserPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleCenterPageChange = (page) => {
        if (page < 1 || page > centerTotalPages) return;
        setCenterPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handlePartPageChange = (page) => {
        if (page < 1 || page > partTotalPages) return;
        setPartPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleRemoveUser = async (user) => {
        if (user.id === adminUser.id) {
            alert("You cannot remove your own account!");
            return;
        }
        if (user.role === "ADMIN" && users.filter(u => u.role === "ADMIN").length <= 1) {
            alert("Cannot remove the last admin account!");
            return;
        }
        if (!window.confirm(`Are you sure you want to remove ${user.fullname}?`)) return;
        try {
            await axios.delete(`${API_BASE_URL}/admin/users/${user.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRefreshKey(k => k + 1);
            alert(`${user.fullname} removed successfully`);
        } catch (err) {
            console.error(err);
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
                    <button
                        onClick={() => setActiveTab("centers")}
                        className={`w-full text-left px-3 py-3 rounded flex items-center gap-3 mt-2 ${activeTab === "centers" ? "bg-gray-800 text-white" : "hover:bg-gray-800 text-gray-300"}`}
                    >
                        <FaList /> <span>Service Centers</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("parts")}
                        className={`w-full text-left px-3 py-3 rounded flex items-center gap-3 mt-2 ${activeTab === "parts" ? "bg-gray-800 text-white" : "hover:bg-gray-800 text-gray-300"}`}
                    >
                        <FaList /> <span>Part Maintenance</span>
                    </button>
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
                        {loadingAppointments ? (
                            <div className="flex items-center gap-2 text-gray-500">
                                <FaSpinner className="animate-spin" /> Loading...
                            </div>
                        ) : appointments.length === 0 ? (
                            <p className="text-gray-500">No appointments found.</p>
                        ) : (
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
                                        const isEditingDisabled = u.role === "CUSTOMER";
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
                        )}
                    </div>
                )}

                {/* Service Centers */}
                {activeTab === "centers" && (
                    <div className="bg-white shadow rounded-lg p-8 overflow-x-auto max-w-6xl mx-auto">
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Service Centers</h2>
                        {loadingCenters ? (
                            <div className="flex items-center gap-2 text-gray-500">
                                <FaSpinner className="animate-spin" /> Loading...
                            </div>
                        ) : centers.length === 0 ? (
                            <p className="text-gray-500">No centers found.</p>
                        ) : (
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-50 text-left text-xs text-gray-600 uppercase">
                                    <tr>
                                        <th className="px-6 py-3">#</th>
                                        <th className="px-6 py-3">Name</th>
                                        <th className="px-6 py-3">Location</th>
                                        <th className="px-6 py-3">Phone</th>
                                        <th className="px-6 py-3">Edit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {centers.map((c, idx) => (
                                        <tr key={c.id} className="border-t hover:bg-gray-50">
                                            <td className="px-6 py-4">{(centerPage - 1) * itemsPerPage + idx + 1}</td>
                                            <td className="px-6 py-4">{c.name}</td>
                                            <td className="px-6 py-4">{c.location}</td>
                                            <td className="px-6 py-4">{c.contactNumber || "—"}</td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => setEditingCenter(c)}
                                                    className="px-3 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700"
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {/* Part Maintenance */}
                {/* Part Maintenance - HOÀN CHỈNH */}
                {activeTab === "parts" && (
                    <div className="bg-white shadow rounded-lg p-8 overflow-x-auto max-w-6xl mx-auto">
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Part Maintenance</h2>

                        {/* Loading */}
                        {(loadingParts || loadingPartTypes) ? (
                            <div className="flex items-center justify-center py-8 text-gray-500">
                                <FaSpinner className="animate-spin mr-2" />
                                Loading...
                            </div>
                        ) : parts.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">No parts found.</p>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-sm">
                                        <thead className="bg-gray-50 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                            <tr>
                                                <th className="px-6 py-3">#</th>
                                                <th className="px-6 py-3">Name</th>
                                                <th className="px-6 py-3">Service Type</th>
                                                <th className="px-6 py-3">Price</th>
                                                <th className="px-6 py-3">Part Number</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {parts.map((p, idx) => (
                                                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 text-gray-900">
                                                        {(partPage - 1) * itemsPerPage + idx + 1}
                                                    </td>
                                                    <td className="px-6 py-4 font-medium text-gray-900">
                                                        {p.name}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-700">
                                                        {getServiceTypeName(p.partTypeId)} {/* ← LOOKUP TỪ part-types */}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-700">
                                                        {p.price ? `${p.price.toLocaleString()} ₫` : "—"}
                                                    </td>
                                                    <td className="px-6 py-4 font-mono text-gray-800">
                                                        {p.part?.partNumber || p.partNumber || "—"}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {partTotalPages > 1 && (
                                    <div className="flex justify-center items-center gap-1 mt-6">
                                        <button
                                            onClick={() => handlePartPageChange(partPage - 1)}
                                            disabled={partPage === 1}
                                            className={`px-3 py-1 rounded text-sm ${partPage === 1
                                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                                                }`}
                                        >
                                            Previous
                                        </button>

                                        {Array.from({ length: Math.min(5, partTotalPages) }, (_, i) => {
                                            let pageNum;
                                            if (partTotalPages <= 5) pageNum = i + 1;
                                            else if (partPage <= 3) pageNum = i + 1;
                                            else if (partPage >= partTotalPages - 2) pageNum = partTotalPages - 4 + i;
                                            else pageNum = partPage - 2 + i;

                                            return pageNum >= 1 && pageNum <= partTotalPages ? (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => handlePartPageChange(pageNum)}
                                                    className={`px-3 py-1 rounded text-sm font-medium ${partPage === pageNum
                                                        ? "bg-blue-600 text-white"
                                                        : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                                                        }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            ) : null;
                                        })}

                                        <button
                                            onClick={() => handlePartPageChange(partPage + 1)}
                                            disabled={partPage === partTotalPages}
                                            className={`px-3 py-1 rounded text-sm ${partPage === partTotalPages
                                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                                                }`}
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

            {/* Modals */}
            {editingUser && (
                <EditUserModal
                    user={editingUser}
                    token={token}
                    onClose={() => setEditingUser(null)}
                    onUpdated={() => setRefreshKey(k => k + 1)}
                />
            )}

            {editingCenter && (
                <EditServiceCenterModal
                    center={editingCenter}
                    token={token}
                    onClose={() => setEditingCenter(null)}
                    onUpdated={() => setRefreshKey(k => k + 1)}
                />
            )}
        </div>
    );
}
