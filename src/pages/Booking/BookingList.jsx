import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function BookingList() {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:8080/api/customer/${JSON.parse(localStorage.getItem("user"))?.id}/appointments`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setBookings(res.data || []);
            } catch (err) {
                console.error("Cannot fetch bookings:", err);
                alert("Cannot fetch bookings!");
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [token]);

    if (loading) return <div className="p-6 text-white">Loading bookings...</div>;
    if (!bookings.length)
        return <div className="p-6 text-white text-center">No bookings found.</div>;

    return (
        <div className="min-h-screen bg-gray-700 text-white p-6">
            <h1 className="text-2xl font-semibold mb-4">My Bookings</h1>
            <div className="space-y-3">
                {bookings.map((b) => (
                    <div key={b.id} className="bg-gray-600 rounded p-4 flex justify-between items-center">
                        <div>
                            <div>
                                <b>Dealer:</b> {b.dealer?.name || "Unknown Dealer"}
                            </div>
                            <div>
                                <b>Vehicle:</b> {b.vehicle?.brand || "Unknown"} {b.vehicle?.model || ""}
                            </div>
                            <div>
                                <b>Date:</b> {b.appointmentDate || "N/A"} <b>Time:</b> {b.appointmentTime || "N/A"}
                            </div>
                            <div>
                                <b>Status:</b> {b.status || "Unknown"}
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
