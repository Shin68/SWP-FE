import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaList, FaSignOutAlt, FaUserCog, FaSpinner, FaPlay, FaClipboardList } from "react-icons/fa";
import axios from "axios";
import { PAGE_URLS } from "../../App/config";

export default function TechnicianDashboard() {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [techProfile, setTechProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [activeTab, setActiveTab] = useState("list");
    const [refreshKey, setRefreshKey] = useState(0);
    const [startingId, setStartingId] = useState(null);

    const storedUser = localStorage.getItem("user");
    const techUser = storedUser ? JSON.parse(storedUser) : null;
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!techUser || !techUser.id || !token) {
            navigate(PAGE_URLS.LOGIN);
        }
    }, [navigate, techUser, token]);

    // Fetch appointments (dựa trên staff API)
    useEffect(() => {
        if (activeTab !== "list" || !token) return;

        const source = axios.CancelToken.source();
        const fetchAppointments = async () => {
            setLoading(true);
            try {
                const res = await axios.get("http://localhost:8080/api/staff/appointments", {
                    headers: { Authorization: `Bearer ${token}` },
                    cancelToken: source.token,
                });

                const list = Array.isArray(res.data) ? res.data : [];
                const enriched = [];

                for (const item of list) {
                    const {
                        appointmentId,
                        vehicleId,
                        serviceCenterId,
                        technicianAssigned,
                        status,
                        appointmentDate,
                        appointmentTime,
                    } = item;

                    if (!technicianAssigned || technicianAssigned.toLowerCase() === "none") continue;

                    let vehicleName = "---";
                    let branchName = "---";
                    try {
                        const vRes = await axios.get(`http://localhost:8080/api/customer/vehicle/details/${vehicleId}`, { headers: { Authorization: `Bearer ${token}` } });
                        const v = vRes.data || {};
                        vehicleName = `${v.brand || ""} ${v.model || ""}`.trim() || "---";
                    } catch { }

                    try {
                        const cRes = await axios.get(`http://localhost:8080/api/admin/service-centers/${serviceCenterId}`, { headers: { Authorization: `Bearer ${token}` } });
                        branchName = cRes.data?.name || "---";
                    } catch { }

                    enriched.push({ appointmentId, vehicleName, branchName, technicianAssigned, status, appointmentDate, appointmentTime });
                }

                setAppointments(enriched);
            } catch (err) {
                console.error("Error fetching appointments:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
        return () => source.cancel("Component unmounted");
    }, [activeTab, token, refreshKey]);

    // Fetch tech profile
    useEffect(() => {
        if (activeTab !== "settings" || !techUser?.id || !token) return;
        const fetchProfile = async () => {
            setLoadingProfile(true);
            try {
                const res = await axios.get(`http://localhost:8080/api/auth/profile/${techUser.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTechProfile(res.data);
            } catch (err) {
                console.error("Error fetching profile:", err);
            } finally {
                setLoadingProfile(false);
            }
        };
        fetchProfile();
    }, [activeTab, techUser?.id, token]);

    // Start maintenance
    const handleStartMaintenance = async (appointmentId) => {
        setStartingId(appointmentId);
        try {
            // Chỉ cập nhật status thôi
            await axios.put(
                `http://localhost:8080/api/staff/appointments/${appointmentId}/status`,
                { status: "IN_PROGRESS" },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setRefreshKey(k => k + 1);
        } catch (err) {
            console.error("Error starting maintenance:", err);
            alert("Failed to start maintenance!");
        } finally {
            setStartingId(null);
        }
    };



    const handleReport = (appointment) => {
        navigate(`${PAGE_URLS.TECHNICIAN_REPORT}/${appointment.appointmentId}`);
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate(PAGE_URLS.LOGIN);
    };

    return (
        <div className="min-h-screen flex bg-gray-100">
            <aside className="w-64 bg-gray-900 text-white fixed top-0 left-0 bottom-0 flex flex-col">
                <div className="p-4 border-b border-gray-800 text-xl font-bold">Technician Portal</div>
                <nav className="flex-1 p-2">
                    <button onClick={() => setActiveTab("list")} className={`w-full text-left px-3 py-3 rounded flex items-center gap-3 ${activeTab === "list" ? "bg-gray-800 text-white" : "hover:bg-gray-800 text-gray-300"}`}>
                        <FaList /> Maintenance List
                    </button>
                    <button onClick={() => setActiveTab("settings")} className={`w-full text-left px-3 py-3 rounded flex items-center gap-3 mt-2 ${activeTab === "settings" ? "bg-gray-800 text-white" : "hover:bg-gray-800 text-gray-300"}`}>
                        <FaUserCog /> Settings
                    </button>
                    <div className="mt-6 border-t border-gray-800 pt-4">
                        <button onClick={handleLogout} className="w-full text-left px-3 py-3 rounded flex items-center gap-3 hover:bg-red-800 text-red-300">
                            <FaSignOutAlt /> Logout
                        </button>
                    </div>
                </nav>
                <div className="p-4 border-t border-gray-800 text-xs text-gray-400">
                    <div>Logged in as</div>
                    <div className="mt-1 font-medium">{techUser?.fullname || "Technician"}</div>
                </div>
            </aside>

            <main className="flex-1 ml-64 p-6">
                {activeTab === "list" ? (
                    <>
                        <header className="flex items-center justify-between mb-6">
                            <h1 className="text-2xl font-semibold text-gray-800">Maintenance Appointments</h1>
                            <div className="text-sm text-gray-600">Total: {appointments.length}</div>
                        </header>

                        <div className="bg-white shadow rounded overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-50 text-left text-xs text-gray-600 uppercase">
                                    <tr>
                                        <th className="px-4 py-3">#</th>
                                        <th className="px-4 py-3">Vehicle</th>
                                        <th className="px-4 py-3">Branch</th>
                                        <th className="px-4 py-3">Date & Time</th>
                                        <th className="px-4 py-3">Technician</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="7" className="px-4 py-6 text-center"><FaSpinner className="animate-spin" /> Loading...</td></tr>
                                    ) : appointments.length === 0 ? (
                                        <tr><td colSpan="7" className="px-4 py-6 text-center text-gray-500">No appointments found.</td></tr>
                                    ) : appointments.map((a, idx) => (
                                        <tr key={a.appointmentId} className="border-t hover:bg-gray-50">
                                            <td className="px-4 py-3">#{idx + 1}</td>
                                            <td className="px-4 py-3">{a.vehicleName}</td>
                                            <td className="px-4 py-3">{a.branchName}</td>
                                            <td className="px-4 py-3">
                                                <div>{a.appointmentDate}</div>
                                                <div className="text-xs text-gray-500">{a.appointmentTime}</div>
                                            </td>
                                            <td className="px-4 py-3">{a.technicianAssigned}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded text-xs ${a.status === "IN_PROGRESS" ? "bg-yellow-100 text-yellow-800" : a.status === "ASSIGNED" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}>{a.status}</span>
                                            </td>
                                            <td className="px-4 py-3 flex gap-2">
                                                <button onClick={() => handleStartMaintenance(a.appointmentId)} disabled={startingId === a.appointmentId || a.status === "IN_PROGRESS"} className={`px-2 py-1 text-xs rounded ${startingId === a.appointmentId || a.status === "IN_PROGRESS" ? "bg-gray-300 text-gray-700 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
                                                    <FaPlay /> Start
                                                </button>
                                                <button onClick={() => handleReport(a)} className="px-2 py-1 text-xs rounded flex items-center gap-1 bg-orange-600 text-white hover:bg-orange-700">
                                                    <FaClipboardList /> Report
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <div className="bg-white shadow rounded p-6">
                        <h2 className="text-xl font-semibold mb-4">Technician Settings</h2>
                        {loadingProfile ? (
                            <div className="text-gray-500">Loading profile...</div>
                        ) : techProfile ? (
                            <div className="space-y-3 text-gray-700">
                                <p><strong>Name:</strong> {techProfile.fullname}</p>
                                <p><strong>Email:</strong> {techProfile.email}</p>
                                <p><strong>Phone:</strong> {techProfile.phone}</p>
                                <p><strong>Role:</strong> {techProfile.role}</p>
                                <p><strong>Address:</strong> {techProfile.address || "—"}</p>
                                <p><strong>DOB:</strong> {techProfile.dob || "—"}</p>
                            </div>
                        ) : (
                            <p className="text-gray-500">No profile data available.</p>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
