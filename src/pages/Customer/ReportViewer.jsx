import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../App/config";

export default function ReportViewer() {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    
    const [loading, setLoading] = useState(true);
    const [pdfUrl, setPdfUrl] = useState("");
    const [feedback, setFeedback] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [appointment, setAppointment] = useState(null);

    useEffect(() => {
        fetchAppointmentData();
        loadPDF();
    }, [appointmentId]);

    const fetchAppointmentData = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const res = await axios.get(
                `${API_BASE_URL}/customer/${user.id}/appointments`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const appt = res.data.find(a => a.id === parseInt(appointmentId));
            setAppointment(appt);
        } catch (err) {
            console.error("Failed to fetch appointment:", err);
        }
    };

    const loadPDF = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${API_BASE_URL}/customer/appointment/${appointmentId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    responseType: 'blob'
                }
            );
            
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            setPdfUrl(url);
        } catch (err) {
            console.error("Failed to load PDF:", err);
            alert("Failed to load report PDF");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!feedback.trim()) {
            alert("⚠️ Please provide your feedback before approving");
            return;
        }

        const confirm = window.confirm(
            "✅ Approve this service report?\n\n" +
            "By approving, you confirm that the service will proceed as described."
        );
        
        if (!confirm) return;

        setSubmitting(true);
        try {
            await axios.put(
                `${API_BASE_URL}/customer/appointments/${appointmentId}/approve`,
                { feedback: feedback },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("✅ Report approved successfully!\n\nThe service will now proceed.");
            navigate("/home");
        } catch (err) {
            console.error("Failed to approve:", err);
            alert("Failed to approve: " + (err.response?.data || err.message));
        } finally {
            setSubmitting(false);
        }
    };

    const handleReject = async () => {
        if (!feedback.trim()) {
            alert("⚠️ Please provide feedback explaining why you're rejecting this report.");
            return;
        }

        const confirm = window.confirm(
            "❌ Reject this service report?\n\n" +
            "Your feedback will be sent to the technician for revision."
        );
        
        if (!confirm) return;

        setSubmitting(true);
        try {
            await axios.put(
                `${API_BASE_URL}/customer/appointments/${appointmentId}/reject?feedback=${encodeURIComponent(feedback)}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("❌ Report rejected.\n\nTechnician will review your feedback.");
            navigate("/home");
        } catch (err) {
            console.error("Failed to reject:", err);
            alert("Failed to reject: " + (err.response?.data || err.message));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600">Loading report...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Service Report Review</h1>
                            <p className="text-sm text-gray-600 mt-1">Appointment #{appointmentId}</p>
                            {appointment && (
                                <p className="text-sm text-gray-600">
                                    {appointment.appointmentDate} at {appointment.appointmentTime}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={() => navigate("/home")}
                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                            ← Back to Home
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* PDF Viewer - Left side (2/3) */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-800">📄 Service Report PDF</h2>
                            </div>
                            <div className="p-4">
                                {pdfUrl ? (
                                    <iframe
                                        src={pdfUrl}
                                        className="w-full h-[800px] border border-gray-300 rounded"
                                        title="Service Report PDF"
                                    />
                                ) : (
                                    <div className="text-center py-12 text-gray-500">
                                        Failed to load PDF
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Feedback Form - Right side (1/3) */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">💬 Your Feedback</h2>
                            
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Comments / Notes <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    placeholder="Please share your thoughts about this report..."
                                    rows="8"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <p className="mt-2 text-xs text-gray-500">
                                    Required for both approval and rejection
                                </p>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={handleApprove}
                                    disabled={submitting || !feedback.trim()}
                                    className={`w-full px-6 py-3 rounded-lg font-semibold ${
                                        submitting || !feedback.trim()
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-green-600 hover:bg-green-700 text-white'
                                    }`}
                                >
                                    {submitting ? 'Processing...' : '✅ Approve Report'}
                                </button>

                                <button
                                    onClick={handleReject}
                                    disabled={submitting || !feedback.trim()}
                                    className={`w-full px-6 py-3 rounded-lg font-semibold ${
                                        submitting || !feedback.trim()
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-red-600 hover:bg-red-700 text-white'
                                    }`}
                                >
                                    {submitting ? 'Processing...' : '❌ Reject Report'}
                                </button>
                            </div>

                            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-xs text-blue-800">
                                    <strong>ℹ️ Note:</strong> After you approve, the technician will proceed with the service. 
                                    If you reject, the technician will review your feedback and may send a revised report.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
