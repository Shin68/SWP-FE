import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaList, FaSignOutAlt, FaUserCog, FaSpinner, FaPlay, FaClipboardList, FaBell, FaCheckCircle } from "react-icons/fa";
import axios from "axios";
import { PAGE_URLS, API_BASE_URL } from "../../App/config";

export default function TechnicianDashboard() {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [techProfile, setTechProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [activeTab, setActiveTab] = useState("list");
    const [refreshKey, setRefreshKey] = useState(0);
    const [startingId, setStartingId] = useState(null);
    const [finishingId, setFinishingId] = useState(null);

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
                const res = await axios.get(`${API_BASE_URL}/staff/appointments`, {
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
                        customerFeedback, // Include customer feedback
                    } = item;

                    if (!technicianAssigned || technicianAssigned.toLowerCase() === "none") continue;
                    
                    // Skip completed and paid appointments (but keep REJECTED for notifications)
                    if (status === "COMPLETED" || status === "PAID") continue;

                    let vehicleName = "---";
                    let branchName = "---";
                    try {
                        const vRes = await axios.get(`${API_BASE_URL}/customer/vehicle/details/${vehicleId}`, { headers: { Authorization: `Bearer ${token}` } });
                        const v = vRes.data || {};
                        vehicleName = `${v.brand || ""} ${v.model || ""}`.trim() || "---";
                    } catch { }

                    try {
                        const cRes = await axios.get(`${API_BASE_URL}/admin/service-centers/${serviceCenterId}`, { headers: { Authorization: `Bearer ${token}` } });
                        branchName = cRes.data?.name || "---";
                    } catch { }

                    // Fetch rejection reason if status is REJECTED
                    let rejectionReason = null;
                    if (status === "REJECTED") {
                        try {
                            // Try to get quotation details which may contain rejection reason
                            const quotRes = await axios.get(
                                `${API_BASE_URL}/customer/totalcost/${appointmentId}`,
                                { headers: { Authorization: `Bearer ${token}` } }
                            );
                            rejectionReason = quotRes.data?.customerFeedback || "Customer rejected the quotation";
                        } catch (err) {
                            console.log(`No rejection reason found for appointment ${appointmentId}`);
                            rejectionReason = "Customer rejected the quotation";
                        }
                    }

                    enriched.push({ 
                        appointmentId, 
                        vehicleName, 
                        branchName, 
                        technicianAssigned, 
                        status, 
                        appointmentDate, 
                        appointmentTime,
                        customerFeedback, // Include in enriched data
                        rejectionReason  // Add rejection reason
                    });
                }

                setAppointments(enriched);
                
                // Debug: Check for rejected reports
                const rejectedCount = enriched.filter(a => a.status === "REJECTED").length;
                console.log(`📊 Total appointments: ${enriched.length}, Rejected: ${rejectedCount}`);
                if (rejectedCount > 0) {
                    console.log("🚨 Rejected appointments:", enriched.filter(a => a.status === "REJECTED"));
                }
            } catch (err) {
                if (axios.isCancel(err)) {
                    console.log("🔄 Request canceled:", err.message);
                } else {
                    console.error("Error fetching appointments:", err);
                }
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
                const res = await axios.get(`${API_BASE_URL}/auth/profile/${techUser.id}`, {
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
            await axios.post(
                `${API_BASE_URL}/technician/start-maintenance/${appointmentId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Maintenance work started successfully!");
            setRefreshKey(k => k + 1);
        } catch (err) {
            console.error("Error starting maintenance:", err);
            alert(err.response?.data?.message || "Failed to start maintenance!");
        } finally {
            setStartingId(null);
        }
    };

    // Finish maintenance
    const handleFinishMaintenance = async (appointmentId) => {
        if (!window.confirm("Are you sure you want to finish this maintenance work?")) {
            return;
        }

        setFinishingId(appointmentId);
        try {
            await axios.post(
                `${API_BASE_URL}/technician/finish/${appointmentId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Maintenance work completed! Staff and customer have been notified.");
            setRefreshKey(k => k + 1);
        } catch (err) {
            console.error("Error finishing maintenance:", err);
            alert(err.response?.data?.message || "Failed to finish maintenance!");
        } finally {
            setFinishingId(null);
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
                    <button 
                        onClick={() => setActiveTab("notifications")} 
                        className={`w-full text-left px-3 py-3 rounded flex items-center gap-3 mt-2 relative ${activeTab === "notifications" ? "bg-gray-800 text-white" : "hover:bg-gray-800 text-gray-300"}`}
                    >
                        <FaBell /> Notifications
                        {appointments.filter(a => a.status === "REJECTED").length > 0 && (
                            <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {appointments.filter(a => a.status === "REJECTED").length}
                            </span>
                        )}
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
                            <div className="flex items-center gap-4">
                                {/* Notification Bell */}
                                <div className="relative">
                                    <span className="text-3xl cursor-pointer" title="Rejected Reports">🔔</span>
                                    {appointments.filter(a => a.status === "REJECTED").length > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
                                            {appointments.filter(a => a.status === "REJECTED").length}
                                        </span>
                                    )}
                                </div>
                                <div className="text-sm text-gray-600">Total: {appointments.length}</div>
                            </div>
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
                                                <span className={`px-2 py-1 rounded text-xs ${
                                                    a.status === "IN_PROGRESS" ? "bg-yellow-100 text-yellow-800" : 
                                                    a.status === "APPROVED" ? "bg-green-100 text-green-800" :
                                                    a.status === "ASSIGNED" ? "bg-blue-100 text-blue-800" : 
                                                    a.status === "REJECTED" ? "bg-red-100 text-red-800" :
                                                    a.status === "PAYMENT_PENDING" ? "bg-purple-100 text-purple-800" :
                                                    "bg-gray-100 text-gray-800"
                                                }`}>{a.status}</span>
                                            </td>
                                            <td className="px-4 py-3 flex gap-2">
                                                {a.status === "APPROVED" && (
                                                    <button 
                                                        onClick={() => handleStartMaintenance(a.appointmentId)} 
                                                        disabled={startingId === a.appointmentId} 
                                                        className={`px-2 py-1 text-xs rounded flex items-center gap-1 ${
                                                            startingId === a.appointmentId 
                                                                ? "bg-gray-300 text-gray-700 cursor-not-allowed" 
                                                                : "bg-blue-600 text-white hover:bg-blue-700"
                                                        }`}
                                                    >
                                                        <FaPlay /> Start
                                                    </button>
                                                )}
                                                {a.status === "IN_PROGRESS" && a.status !== "REJECTED" && (
                                                    <button 
                                                        onClick={() => handleFinishMaintenance(a.appointmentId)} 
                                                        disabled={finishingId === a.appointmentId} 
                                                        className={`px-2 py-1 text-xs rounded flex items-center gap-1 ${
                                                            finishingId === a.appointmentId 
                                                                ? "bg-gray-300 text-gray-700 cursor-not-allowed" 
                                                                : "bg-green-600 text-white hover:bg-green-700"
                                                        }`}
                                                    >
                                                        <FaCheckCircle /> Finish
                                                    </button>
                                                )}
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
                ) : activeTab === "notifications" ? (
                    <>
                        <header className="flex items-center justify-between mb-6">
                            <h1 className="text-2xl font-semibold text-gray-800">🔔 Customer Notifications</h1>
                            <div className="text-sm text-gray-600">
                                {appointments.filter(a => a.status === "REJECTED").length} pending feedback(s)
                            </div>
                        </header>

                        {loading ? (
                            <div className="bg-white shadow rounded p-12 text-center">
                                <FaSpinner className="animate-spin inline-block text-3xl text-gray-400" />
                                <p className="mt-4 text-gray-600">Loading notifications...</p>
                            </div>
                        ) : appointments.filter(a => a.status === "REJECTED").length === 0 ? (
                            <div className="bg-white shadow rounded p-12 text-center">
                                <div className="text-6xl mb-4">✅</div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">All Clear!</h3>
                                <p className="text-gray-600">No rejected quotations at the moment.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {appointments.filter(a => a.status === "REJECTED").map(a => (
                                    <div key={a.appointmentId} className="bg-white shadow rounded-lg overflow-hidden border-l-4 border-red-500">
                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
                                                            ❌ Customer Rejected
                                                        </span>
                                                        <span className="text-gray-500 text-sm">
                                                            {a.appointmentDate} at {a.appointmentTime}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-gray-800">
                                                        Appointment #{a.appointmentId}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        🚗 {a.vehicleName} | 🏢 {a.branchName}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Rejection Reason */}
                                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                                                <div className="flex items-start gap-2">
                                                    <span className="text-2xl">💬</span>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-semibold text-yellow-800 mb-2">
                                                            Rejection Reason:
                                                        </p>
                                                        <p className="text-gray-800 italic">
                                                            "{a.rejectionReason || "No reason provided"}"
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            <button
                                                onClick={() => navigate(`${PAGE_URLS.TECHNICIAN_REPORT}/${a.appointmentId}`)}
                                                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
                                            >
                                                <FaClipboardList />
                                                Open Report & Revise
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
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
