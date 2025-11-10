import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../App/config";

export default function BookingList() {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            const storedUser = JSON.parse(localStorage.getItem("user"));
            const token = localStorage.getItem("token");

            if (!storedUser || !token) {
                console.log("No user or token found, redirecting to login");
                setLoading(false);
                navigate("/");
                return;
            }

            try {
                console.log(`Fetching bookings for user ${storedUser.id}`);
                const res = await axios.get(
                    `${API_BASE_URL}/customer/${storedUser.id}/appointments`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                console.log("Bookings fetched:", res.data);
                setBookings(res.data || []);
            } catch (err) {
                console.error("Cannot fetch bookings:", err);
                console.error("Error response:", err.response?.data);
                console.error("Error status:", err.response?.status);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [navigate]);

    if (loading) return (
        <div className="min-h-screen bg-gray-700 flex items-center justify-center text-white">
            Loading bookings...
        </div>
    );
    
    if (!bookings.length) {
        return (
            <div className="min-h-screen bg-gray-700 text-white p-6">
                <h1 className="text-2xl font-semibold mb-4">My Bookings</h1>
                <div className="bg-gray-600 rounded p-6 text-center">
                    <p className="text-gray-300 mb-4">No bookings found.</p>
                    <button 
                        onClick={() => navigate("/home")}
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-700 text-white p-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-semibold">My Bookings</h1>
                <button 
                    onClick={() => navigate("/home")}
                    className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded text-sm"
                >
                    ← Back to Home
                </button>
            </div>
            <div className="space-y-3">
                {bookings.map((b) => (
                    <div key={b.id} className="bg-gray-600 rounded p-4 flex justify-between items-center">
                        <div>
                            <div className="mb-2">
                                <span className="text-gray-400">Appointment ID:</span> <b>#{b.id}</b>
                            </div>
                            <div className="mb-1">
                                <b>Date:</b> {b.appointmentDate || "N/A"} <b>Time:</b> {b.appointmentTime || "N/A"}
                            </div>
                            <div className="mb-1">
                                <b>Technician:</b> {b.technicianAssigned || "Not assigned"}
                            </div>
                            <div>
                                <b>Status:</b> <span className={`font-semibold ${
                                    b.status === 'COMPLETED' ? 'text-green-400' :
                                    b.status === 'PENDING' ? 'text-yellow-400' :
                                    b.status === 'IN_PROGRESS' ? 'text-blue-400' :
                                    'text-orange-400'
                                }`}>{b.status || "Unknown"}</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            {b.status === "REPORT_SENT" && (
                                <button
                                    onClick={() => navigate(`/technician-report/${b.id}`)}
                                    className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                                >
                                    View Report
                                </button>
                            )}
                            {b.status === "CUSTOMER_CONFIRMED" && (
                                <div className="text-green-400 text-sm">Waiting for staff review</div>
                            )}
                            {b.status === "DONE" && (
                                <button
                                    onClick={() => navigate(`/technician-report/${b.id}`)}
                                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                                >
                                    View Report
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
