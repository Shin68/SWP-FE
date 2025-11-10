import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../App/config";

export default function TechnicianReport() {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    
    // State
    const [details, setDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [maintenancePlans, setMaintenancePlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [odometer, setOdometer] = useState("");
    const [generating, setGenerating] = useState(false);
    const [appointment, setAppointment] = useState(null);
    const [reportStatus, setReportStatus] = useState(null); // DRAFT, SENT, APPROVED, REJECTED
    const [sending, setSending] = useState(false);
    const [quotation, setQuotation] = useState(null);
    const [customerFeedback, setCustomerFeedback] = useState(null);

    // Fetch appointment info
    const fetchAppointment = async () => {
        try {
            const res = await axios.get(
                `${API_BASE_URL}/staff/appointments`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const appt = res.data.find(a => a.appointmentId === parseInt(appointmentId));
            setAppointment(appt);
            
            // Check if rejected (has customer feedback)
            if (appt && appt.customerFeedback) {
                setCustomerFeedback(appt.customerFeedback);
                setReportStatus('REJECTED'); // UI status for display
            }
        } catch (err) {
            console.error("❌ Failed to fetch appointment:", err);
        }
    };

    // Fetch maintenance plans
    const fetchMaintenancePlans = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/admin/maintenance-plans`);
            setMaintenancePlans(res.data || []);
            console.log("✅ Loaded", res.data.length, "maintenance plans");
        } catch (err) {
            console.error("❌ Failed to fetch maintenance plans:", err);
        }
    };

    // Fetch existing report details
    const fetchDetails = async () => {
        setLoading(true);
        try {
            const res = await axios.get(
                `${API_BASE_URL}/technician/appointment/${appointmentId}/report-details`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("✅ Fetched report details:", res.data);
            setDetails(res.data || []);
            
            // Determine report status based on details
            if (res.data && res.data.length > 0) {
                setReportStatus("DRAFT"); // Has details but not sent
            }
        } catch (err) {
            // If appointment has no report yet, that's okay - it will be created when generating
            if (err.response?.status === 500 || err.message?.includes("No report found")) {
                console.log("⚠️ Appointment has no report yet - will be created when generating");
                setDetails([]);
            } else {
                console.error("❌ Failed to fetch report details:", err);
                console.error("❌ Fetch error details:", err.response?.data, err.response?.status);
                setDetails([]);
            }
        } finally {
            setLoading(false);
        }
    };

    // Fetch quotation/cost report status
    const fetchQuotation = async () => {
        try {
            const res = await axios.get(
                `${API_BASE_URL}/customer/totalcost/${appointmentId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setQuotation(res.data);
            
            // Update status based on quotation
            if (res.data?.customerApproved === true) {
                setReportStatus("APPROVED");
            } else if (res.data?.customerApproved === false) {
                setReportStatus("REJECTED");
            } else if (res.data) {
                setReportStatus("SENT");
            }
        } catch (err) {
            console.log("No quotation yet");
        }
    };

    useEffect(() => {
        fetchAppointment();
        fetchMaintenancePlans();
        fetchDetails();
        fetchQuotation();
    }, [appointmentId]);

    // Find best matching plan based on odometer
    const findBestPlan = (km) => {
        const odometerValue = parseInt(km);
        if (isNaN(odometerValue) || odometerValue <= 0) {
            alert("Please enter a valid odometer reading");
            return null;
        }

        // Find plans with intervalKm >= odometer, then pick the smallest one
        const eligiblePlans = maintenancePlans
            .filter(p => p.intervalKm >= odometerValue)
            .sort((a, b) => a.intervalKm - b.intervalKm);

        if (eligiblePlans.length > 0) {
            return eligiblePlans[0];
        }

        // If no plan >= odometer, pick the highest plan
        const sortedPlans = [...maintenancePlans].sort((a, b) => b.intervalKm - a.intervalKm);
        return sortedPlans[0] || null;
    };

    // Handle odometer input and auto-select plan
    const handleOdometerChange = (value) => {
        setOdometer(value);
        if (value && parseInt(value) > 0) {
            const bestPlan = findBestPlan(value);
            if (bestPlan) {
                setSelectedPlan(bestPlan);
                console.log(`✅ Auto-selected plan: ${bestPlan.intervalKm}km with ${bestPlan.items?.length || 0} items`);
            }
        } else {
            setSelectedPlan(null);
        }
    };

    // Generate report details from selected plan
    const handleGenerateFromPlan = async () => {
        if (!selectedPlan) {
            alert("Please enter odometer reading first");
            return;
        }

        if (!selectedPlan.items || selectedPlan.items.length === 0) {
            alert("Selected plan has no maintenance items");
            return;
        }

        setGenerating(true);
        try {
            const url = `${API_BASE_URL}/technician/${appointmentId}/details/by-km`;
            console.log(`🔧 Generating report from plan ${selectedPlan.id} (${selectedPlan.intervalKm}km)`);
            console.log(`📍 API URL:`, url);
            console.log(`📤 Sending payload:`, {
                currentKm: parseInt(odometer)
            });
            console.log(`🔑 Token available:`, token ? 'Yes' : 'No');
            console.log(`📋 AppointmentId:`, appointmentId);
            
            // Call backend API to generate report details based on plan
            const res = await axios.post(
                url,
                { 
                    currentKm: parseInt(odometer)
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log("✅ Report generated successfully:", res.data);
            const items = res.data?.items || res.data || [];
            const itemCount = items.length;
            
            // Show success message first
            alert(`✅ Generated ${itemCount} maintenance tasks from ${selectedPlan.intervalKm}km plan!`);
            
            // Refresh the list to display the new details
            await fetchDetails();
        } catch (err) {
            console.error("❌ Failed to generate report:", err);
            console.error("❌ Error response:", err.response?.data);
            console.error("❌ Error status:", err.response?.status);
            
            // Check if it's just a fetch error after successful generation
            if (err.message === "Network Error" || err.code === "ERR_NETWORK") {
                console.log("⚠️ Network error, but checking if report was created...");
                // Try to fetch details anyway
                try {
                    await fetchDetails();
                    // If fetch succeeds, report was actually created
                    alert(`✅ Report generated successfully! Refresh to see ${selectedPlan.items.length} tasks.`);
                    return;
                } catch (fetchErr) {
                    console.error("❌ Also failed to fetch details:", fetchErr);
                }
            }
            
            const errorMsg = err.response?.data?.message 
                || err.response?.data 
                || err.message 
                || "Unknown error";
            alert("Failed to generate report: " + errorMsg);
        } finally {
            setGenerating(false);
        }
    };

    // Update individual detail
    const handleUpdateDetail = async (detailId, updatedData) => {
        setUpdatingId(detailId);
        try {
            await axios.patch(
                `${API_BASE_URL}/technician/reports/details/${detailId}`,
                updatedData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchDetails();
            alert("Detail updated successfully!");
        } catch (err) {
            console.error("❌ Failed to update detail:", err);
            alert("Failed to update detail!");
        } finally {
            setUpdatingId(null);
        }
    };

    // Send report to customer for approval
    const handleSendToCustomer = async () => {
        if (!details || details.length === 0) {
            alert("⚠️ Please generate report details first!");
            return;
        }

        const confirm = window.confirm(
            `📤 Send this report to customer for approval?\n\n` +
            `Report includes ${details.length} maintenance tasks.\n` +
            `Customer will be able to approve or reject this report.`
        );

        if (!confirm) return;

        setSending(true);
        try {
            await axios.post(
                `${API_BASE_URL}/technician/${appointmentId}/send-report`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("✅ Report sent to customer successfully!\n\nWaiting for customer approval...");
            setReportStatus("SENT");
            fetchQuotation();
        } catch (err) {
            console.error("❌ Failed to send report:", err);
            alert("Failed to send report: " + (err.response?.data?.message || err.message));
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Technician Report</h1>
                            {/* Report Status Badge */}
                            {reportStatus && (
                                <div className="mt-2">
                                    {reportStatus === "DRAFT" && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-800">
                                            📝 Draft - Not Sent
                                        </span>
                                    )}
                                    {reportStatus === "SENT" && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                            📤 Sent - Waiting for Customer Approval
                                        </span>
                                    )}
                                    {reportStatus === "APPROVED" && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                            ✅ Approved by Customer
                                        </span>
                                    )}
                                    {reportStatus === "REJECTED" && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                            ❌ Rejected by Customer - Needs Revision
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => navigate(-1)}
                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                            ← Back
                        </button>
                    </div>
                    <div className="text-sm text-gray-600">
                        <p><strong>Appointment ID:</strong> #{appointmentId}</p>
                        {appointment && (
                            <>
                                <p><strong>Customer:</strong> {appointment.customerId}</p>
                                <p><strong>Vehicle:</strong> {appointment.vehicleId}</p>
                                <p><strong>Date:</strong> {appointment.appointmentDate} at {appointment.appointmentTime}</p>
                            </>
                        )}
                    </div>

                </div>

                {/* Customer Feedback Alert - Shows when rejected */}
                {customerFeedback && (
                    <div className="bg-red-50 border-2 border-red-400 rounded-lg p-6 mb-6">
                        <div className="flex items-start gap-3">
                            <span className="text-3xl">⚠️</span>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-red-800 mb-2">
                                    Customer Rejected This Report
                                </h3>
                                <div className="bg-white border border-red-200 rounded p-4">
                                    <p className="text-sm font-semibold text-gray-700 mb-2">
                                        Customer's Feedback:
                                    </p>
                                    <p className="text-gray-800 italic">
                                        "{customerFeedback}"
                                    </p>
                                </div>
                                <p className="text-sm text-red-700 mt-3">
                                    Please review the feedback and revise the report accordingly. 
                                    After editing, send the updated report to the customer again.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                

                {/* Odometer Input & Plan Selection */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">🚗 Vehicle Odometer & Maintenance Plan</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {/* Odometer Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Current Odometer (km) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={odometer}
                                onChange={(e) => handleOdometerChange(e.target.value)}
                                placeholder="e.g., 7000"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Enter the current kilometer reading
                            </p>
                        </div>

                        {/* Selected Plan Display */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Auto-Selected Plan
                            </label>
                            <div className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                                {selectedPlan ? (
                                    <div>
                                        <div className="font-semibold text-blue-600">
                                            {selectedPlan.intervalKm.toLocaleString()}km Plan
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            {selectedPlan.items?.length || 0} maintenance tasks
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-gray-400 text-sm">No plan selected</div>
                                )}
                            </div>
                        </div>

                        {/* Generate Button */}
                        <div className="flex items-end">
                            <button
                                onClick={handleGenerateFromPlan}
                                disabled={!selectedPlan || generating}
                                className={`w-full px-6 py-2 rounded-lg font-semibold ${
                                    selectedPlan && !generating
                                        ? 'bg-green-600 hover:bg-green-700 text-white'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                {generating ? '⏳ Generating...' : '✨ Generate Report'}
                            </button>
                        </div>
                    </div>

                    {/* Plan Info with Full Task List */}
                    {selectedPlan && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 className="font-semibold text-blue-800 mb-2">
                                📋 Selected Plan: {selectedPlan.intervalKm.toLocaleString()}km Maintenance
                            </h3>
                            <p className="text-sm text-blue-700 mb-3">
                                This plan includes {selectedPlan.items?.length || 0} maintenance tasks. Review below and click "Generate Report" to add them to the report.
                            </p>
                            
                            {/* Plan Items Table Preview */}
                            <div className="bg-white rounded-lg overflow-hidden border border-blue-200 mt-3">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-blue-100">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-blue-800">#</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-blue-800">Task Name</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-blue-800">Part Type</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-blue-100">
                                        {selectedPlan.items?.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-blue-50">
                                                <td className="px-4 py-2 text-gray-700">{idx + 1}</td>
                                                <td className="px-4 py-2 text-gray-900 font-medium">{item.taskName}</td>
                                                <td className="px-4 py-2 text-gray-600">{item.partType || "—"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Report Details Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">📝 Service Report Details</h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    Review and edit maintenance tasks below
                                </p>
                            </div>
                            {/* Send to Customer Button */}
                            {details.length > 0 && reportStatus !== "SENT" && reportStatus !== "APPROVED" && (
                                <button
                                    onClick={handleSendToCustomer}
                                    disabled={sending}
                                    className={`px-6 py-2 rounded-lg font-semibold ${
                                        sending
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                                    }`}
                                >
                                    {sending ? '📤 Sending...' : '📤 Send to Customer'}
                                </button>
                            )}
                        </div>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <p className="mt-4 text-gray-600">Loading report details...</p>
                        </div>
                    ) : details.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="text-gray-400 text-6xl mb-4">📋</div>
                            <p className="text-gray-600 text-lg mb-2">No service details yet</p>
                            <p className="text-gray-500 text-sm">
                                Enter the vehicle odometer above and click "Generate Report" to auto-create maintenance tasks
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Part Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Part ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Part Unit Price</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Part Cost</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Labor Cost</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {details.map((detail, idx) => (
                                        <DetailRow
                                            key={detail.id}
                                            detail={detail}
                                            index={idx}
                                            updating={updatingId === detail.id}
                                            onUpdate={handleUpdateDetail}
                                        />
                                    ))}
                                </tbody>
                                <tfoot className="bg-gray-50">
                                    <tr>
                                        <td colSpan="8" className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                                            Total Part Cost:
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">
                                            {details.reduce((sum, d) => sum + (d.partCost || 0), 0).toLocaleString()} VND
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                            {details.reduce((sum, d) => sum + (d.laborCost || 0), 0).toLocaleString()} VND
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-green-600">
                                            {details.reduce((sum, d) => sum + (d.totalCost || 0), 0).toLocaleString()} VND
                                        </td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Detail Row Component with inline editing
function DetailRow({ detail, index, updating, onUpdate }) {
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        partId: detail.partId || "",
        actionType: detail.actionType || "",
        conditionStatus: detail.conditionStatus || "",
        quantity: detail.quantity || 1,
        laborCost: detail.laborCost || 0,
    });

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSave = () => {
        onUpdate(detail.id, formData);
        setEditing(false);
    };

    const handleCancel = () => {
        setFormData({
            partId: detail.partId || "",
            actionType: detail.actionType || "",
            conditionStatus: detail.conditionStatus || "",
            quantity: detail.quantity || 1,
            laborCost: detail.laborCost || 0,
        });
        setEditing(false);
    };

    // Calculate costs - use backend data if available, otherwise calculate
    const quantity = detail.quantity || 0;
    const partCost = detail.partCost || 0; // Backend already calculated this
    const partUnitPrice = quantity > 0 ? partCost / quantity : 0;
    const laborCost = detail.laborCost || 0;
    const subtotal = detail.totalCost || (partCost + laborCost);

    return (
        <tr className={editing ? 'bg-blue-50' : 'hover:bg-gray-50'}>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {index + 1}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {detail.service || detail.maintenanceItem?.taskName || "N/A"}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {detail.part?.name || "-"}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                {editing ? (
                    <input
                        type="number"
                        value={formData.partId}
                        onChange={(e) => handleChange('partId', e.target.value)}
                        className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                ) : (
                    <span className="text-sm text-gray-900">{detail.partId || "-"}</span>
                )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                {editing ? (
                    <input
                        type="text"
                        value={formData.actionType}
                        onChange={(e) => handleChange('actionType', e.target.value)}
                        className="w-32 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                ) : (
                    <span className="text-sm text-gray-900">{detail.actionType || "-"}</span>
                )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                {editing ? (
                    <input
                        type="text"
                        value={formData.conditionStatus}
                        onChange={(e) => handleChange('conditionStatus', e.target.value)}
                        className="w-32 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                ) : (
                    <span className="text-sm text-gray-900">{detail.conditionStatus || "-"}</span>
                )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                {editing ? (
                    <input
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => handleChange('quantity', parseInt(e.target.value))}
                        className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                ) : (
                    <span className="text-sm text-gray-900">{detail.quantity || 1}</span>
                )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {partUnitPrice.toLocaleString()} VND
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                {partCost.toLocaleString()} VND
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                {editing ? (
                    <input
                        type="number"
                        value={formData.laborCost}
                        onChange={(e) => handleChange('laborCost', parseFloat(e.target.value))}
                        className="w-24 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                ) : (
                    <span className="text-sm text-gray-900">{detail.laborCost?.toLocaleString() || "0"} VND</span>
                )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                {subtotal.toLocaleString()} VND
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
                {editing ? (
                    <div className="flex gap-2">
                        <button
                            onClick={handleSave}
                            disabled={updating}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
                        >
                            {updating ? '...' : 'Save'}
                        </button>
                        <button
                            onClick={handleCancel}
                            className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setEditing(true)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Edit
                    </button>
                )}
            </td>
        </tr>
    );
}
