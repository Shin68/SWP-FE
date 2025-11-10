import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../App/config";

export default function QuotationApproval() {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const [loading, setLoading] = useState(true);
    const [quotation, setQuotation] = useState(null);
    const [details, setDetails] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [feedback, setFeedback] = useState("");

    useEffect(() => {
        fetchQuotation();
    }, [appointmentId]);

    const fetchQuotation = async () => {
        setLoading(true);
        try {
            // Fetch quotation/cost report
            const quotRes = await axios.get(
                `${API_BASE_URL}/customer/totalcost/${appointmentId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setQuotation(quotRes.data);
            setDetails(quotRes.data.reportDetails || []);
        } catch (err) {
            console.error("❌ Failed to fetch quotation:", err);
            alert("Failed to load quotation");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        const confirm = window.confirm(
            "✅ Approve this maintenance report?\n\n" +
            "By approving, you agree to proceed with the maintenance work as outlined."
        );
        if (!confirm) return;

        setSubmitting(true);
        try {
            await axios.post(
                `${API_BASE_URL}/customer/totalcost/${appointmentId}/approve`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("✅ Report approved successfully!\n\nTechnician will now proceed with maintenance.");
            navigate("/home");
        } catch (err) {
            console.error("❌ Failed to approve:", err);
            alert("Failed to approve: " + (err.response?.data?.message || err.message));
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
            "❌ Reject this maintenance report?\n\n" +
            "Your feedback will be sent to the technician for revision."
        );
        if (!confirm) return;

        setSubmitting(true);
        try {
            await axios.post(
                `${API_BASE_URL}/customer/totalcost/${appointmentId}/reject`,
                { feedback: feedback },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("❌ Report rejected.\n\nTechnician will review your feedback and send a revised report.");
            navigate("/home");
        } catch (err) {
            console.error("❌ Failed to reject:", err);
            alert("Failed to reject: " + (err.response?.data?.message || err.message));
        } finally {
            setSubmitting(false);
        }
    };

    const calculateTotal = () => {
        if (!details || details.length === 0) return 0;
        return details.reduce((sum, item) => {
            const partCost = (item.part?.unitPrice || 0) * (item.quantity || 0);
            const laborCost = item.laborCost || 0;
            return sum + partCost + laborCost;
        }, 0);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600">Loading quotation...</p>
                </div>
            </div>
        );
    }

    if (!quotation) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">No quotation found</p>
                    <button
                        onClick={() => navigate("/home")}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        );
    }

    const totalCost = calculateTotal();
    const isApproved = quotation.customerApproved === true;
    const isRejected = quotation.customerApproved === false;
    const isPending = quotation.customerApproved === null;

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Maintenance Quotation</h1>
                            <p className="text-sm text-gray-600 mt-1">Appointment #{appointmentId}</p>
                        </div>
                        <button
                            onClick={() => navigate("/home")}
                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                            ← Back to Home
                        </button>
                    </div>

                    {/* Status Badge */}
                    <div className="mt-4">
                        {isPending && (
                            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                ⏳ Pending Your Approval
                            </span>
                        )}
                        {isApproved && (
                            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                ✅ Approved on {quotation.customerFeedbackDate || "N/A"}
                            </span>
                        )}
                        {isRejected && (
                            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                ❌ Rejected - Waiting for Revision
                            </span>
                        )}
                    </div>
                </div>

                {/* Maintenance Details Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">📋 Maintenance Details</h2>
                        <p className="text-sm text-gray-600 mt-1">Review all maintenance tasks below</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Part</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Part Cost</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Labor Cost</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {details.map((item, idx) => {
                                    const partCost = (item.part?.unitPrice || 0) * (item.quantity || 0);
                                    const laborCost = item.laborCost || 0;
                                    const subtotal = partCost + laborCost;

                                    return (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{idx + 1}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {item.maintenanceItem?.taskName || "N/A"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.part?.name || "-"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.actionType || "-"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.quantity || 0}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {partCost.toLocaleString()} VND
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {laborCost.toLocaleString()} VND
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                                {subtotal.toLocaleString()} VND
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            <tfoot className="bg-gray-50">
                                <tr>
                                    <td colSpan="7" className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                                        Total Cost:
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-blue-600">
                                        {totalCost.toLocaleString()} VND
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                {/* Approval Actions */}
                {isPending && (
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Decision</h3>

                        {/* Feedback textarea for rejection */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Feedback (Required if rejecting)
                            </label>
                            <textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder="Explain what needs to be changed..."
                                rows="4"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <button
                                onClick={handleApprove}
                                disabled={submitting}
                                className={`flex-1 px-6 py-3 rounded-lg font-semibold ${
                                    submitting
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-green-600 hover:bg-green-700 text-white'
                                }`}
                            >
                                {submitting ? 'Processing...' : '✅ Approve & Proceed'}
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={submitting}
                                className={`flex-1 px-6 py-3 rounded-lg font-semibold ${
                                    submitting
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-red-600 hover:bg-red-700 text-white'
                                }`}
                            >
                                {submitting ? 'Processing...' : '❌ Reject & Request Changes'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Previous Feedback Display */}
                {quotation.customerFeedback && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
                        <h3 className="text-lg font-semibold text-yellow-800 mb-2">💬 Your Previous Feedback:</h3>
                        <p className="text-yellow-700">{quotation.customerFeedback}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
