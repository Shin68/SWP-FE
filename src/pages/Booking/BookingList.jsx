import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../App/config";

export default function BookingList() {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");

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

    const paymentPendingCount = bookings.filter(b => b.status === "PAYMENT_PENDING").length;
    const quotationPendingCount = bookings.filter(b => b.status === "QUOTATION_SENT").length;
    
    const filteredBookings = activeTab === "all" 
        ? bookings 
        : activeTab === "payment"
        ? bookings.filter(b => b.status === "PAYMENT_PENDING")
        : bookings.filter(b => b.status === "QUOTATION_SENT");

    return (
        <div className="min-h-screen bg-gray-700 text-white p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-semibold">My Bookings</h1>
                    {/* Notification Bell */}
                    <div className="relative">
                        <span className="text-3xl cursor-pointer" title="Payment & Quotation Notifications">🔔</span>
                        {(paymentPendingCount + quotationPendingCount) > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
                                {paymentPendingCount + quotationPendingCount}
                            </span>
                        )}
                    </div>
                </div>
                <button 
                    onClick={() => navigate("/home")}
                    className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded text-sm"
                >
                    ← Back to Home
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => setActiveTab("all")}
                    className={`px-4 py-2 rounded ${activeTab === "all" ? "bg-blue-600" : "bg-gray-600 hover:bg-gray-500"}`}
                >
                    All Bookings ({bookings.length})
                </button>
                <button
                    onClick={() => setActiveTab("payment")}
                    className={`px-4 py-2 rounded relative ${activeTab === "payment" ? "bg-red-600" : "bg-gray-600 hover:bg-gray-500"}`}
                >
                    💰 Payment Required
                    {paymentPendingCount > 0 && (
                        <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                            {paymentPendingCount}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab("quotation")}
                    className={`px-4 py-2 rounded relative ${activeTab === "quotation" ? "bg-yellow-600" : "bg-gray-600 hover:bg-gray-500"}`}
                >
                    📋 Quotation Pending
                    {quotationPendingCount > 0 && (
                        <span className="ml-2 bg-yellow-500 text-white text-xs font-bold rounded-full px-2 py-1">
                            {quotationPendingCount}
                        </span>
                    )}
                </button>
            </div>

            {/* Payment Pending Alert */}
            {activeTab === "payment" && paymentPendingCount > 0 && (
                <div className="bg-red-900 border-l-4 border-red-500 p-4 mb-4 rounded">
                    <div className="flex items-center gap-2">
                        <span className="text-3xl">⚠️</span>
                        <div>
                            <h3 className="font-bold text-lg">Payment Required!</h3>
                            <p className="text-sm text-gray-300">You have {paymentPendingCount} appointment(s) waiting for payment. Please complete payment to pick up your vehicle.</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-3">
                {filteredBookings.length === 0 ? (
                    <div className="bg-gray-600 rounded p-8 text-center">
                        <p className="text-gray-300">No bookings found in this category.</p>
                    </div>
                ) : (
                    filteredBookings.map((b) => (
                        <div 
                            key={b.id} 
                            className={`bg-gray-600 rounded p-4 flex justify-between items-center ${
                                b.status === "PAYMENT_PENDING" ? "border-l-4 border-red-500" :
                                b.status === "QUOTATION_SENT" ? "border-l-4 border-yellow-500" : ""
                            }`}
                        >
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
                                    <b>Status:</b> <span className={`font-semibold px-2 py-1 rounded text-xs ${
                                        b.status === 'COMPLETED' ? 'bg-green-600 text-white' :
                                        b.status === 'PAID' ? 'bg-green-700 text-white' :
                                        b.status === 'PAYMENT_PENDING' ? 'bg-red-600 text-white' :
                                        b.status === 'PENDING' ? 'bg-yellow-600 text-white' :
                                        b.status === 'IN_PROGRESS' ? 'bg-blue-600 text-white' :
                                        b.status === 'QUOTATION_SENT' ? 'bg-yellow-500 text-white' :
                                        b.status === 'APPROVED' ? 'bg-green-500 text-white' :
                                        'bg-orange-600 text-white'
                                    }`}>{b.status || "Unknown"}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                {b.status === "QUOTATION_SENT" && (
                                    <button
                                        onClick={() => navigate(`/report-viewer/${b.id}`)}
                                        className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-sm font-semibold"
                                    >
                                        📋 View Report & Approve/Reject
                                    </button>
                                )}
                                {b.status === "PAYMENT_PENDING" && (
                                    <div className="flex flex-col gap-2">
                                        <div className="bg-red-700 px-3 py-2 rounded text-center">
                                            <div className="text-xs text-gray-300">Maintenance Complete!</div>
                                            <div className="font-bold text-lg">💰 Payment Required</div>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/payment/${b.id}`)}
                                            className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded text-sm font-semibold"
                                        >
                                            💳 Pay Now
                                        </button>
                                    </div>
                                )}
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
                                {(b.status === "DONE" || b.status === "COMPLETED" || b.status === "PAID") && (
                                    <button
                                        onClick={() => navigate(`/technician-report/${b.id}`)}
                                        className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                                    >
                                        📄 View Report
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
