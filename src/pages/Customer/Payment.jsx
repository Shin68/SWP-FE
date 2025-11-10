import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../App/config";

export default function Payment() {
    const navigate = useNavigate();
    const { appointmentId } = useParams();
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState("VNPAY");
    const [processing, setProcessing] = useState(false);

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchPaymentInfo = async () => {
            if (!token) {
                navigate("/");
                return;
            }

            try {
                const res = await axios.get(
                    `${API_BASE_URL}/payment/appointment/${appointmentId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setPaymentInfo(res.data);
                console.log("Payment info:", res.data);
                console.log("Payment status:", res.data.status);
            } catch (err) {
                console.error("Error fetching payment info:", err);
                alert("Failed to load payment information!");
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentInfo();
    }, [appointmentId, navigate, token]);

    const handlePayment = async () => {
        if (!paymentMethod) {
            alert("Please select a payment method!");
            return;
        }

        setProcessing(true);

        try {
            if (paymentMethod === "VNPAY") {
                // VNPay payment
                const res = await axios.post(
                    `${API_BASE_URL}/payment/${paymentInfo.paymentId}?paymentMethod=VNPAY`,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                console.log("VNPay response:", res.data);

                if (res.data.vnpUrl) {
                    // Redirect to VNPay
                    window.location.href = res.data.vnpUrl;
                }
            } else if (paymentMethod === "CASH") {
                // Cash payment - just confirm
                if (!window.confirm("Please confirm you will pay in cash when picking up your vehicle.")) {
                    setProcessing(false);
                    return;
                }

                await axios.post(
                    `${API_BASE_URL}/payment/confirm/${paymentInfo.paymentId}`,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                alert("Payment method confirmed! Please bring cash when picking up your vehicle.");
                navigate("/home");
            }
        } catch (err) {
            console.error("Error processing payment:", err);
            alert(err.response?.data?.message || "Payment processing failed!");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-700 flex items-center justify-center text-white">
                <div className="text-center">
                    <div className="animate-spin text-6xl mb-4">⏳</div>
                    <p className="text-xl">Loading payment information...</p>
                </div>
            </div>
        );
    }

    if (!paymentInfo) {
        return (
            <div className="min-h-screen bg-gray-700 flex items-center justify-center text-white">
                <div className="text-center">
                    <div className="text-6xl mb-4">❌</div>
                    <p className="text-xl mb-4">Payment information not found</p>
                    <button
                        onClick={() => navigate("/booking-list")}
                        className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded"
                    >
                        Back to Bookings
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-700 text-white p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold">💳 Payment</h1>
                    <button
                        onClick={() => navigate("/booking-list")}
                        className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded text-sm"
                    >
                        ← Back to Bookings
                    </button>
                </div>

                {/* Payment Info Card */}
                <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">
                        📋 Invoice Details
                    </h2>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Appointment ID:</span>
                            <span className="font-semibold">#{paymentInfo.appointmentId}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Customer:</span>
                            <span className="font-semibold">{paymentInfo.customerName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Vehicle:</span>
                            <span className="font-semibold">{paymentInfo.vehicleInfo}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Appointment Date:</span>
                            <span className="font-semibold">{paymentInfo.appointmentDate}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Status:</span>
                            <span className={`font-semibold px-2 py-1 rounded text-xs ${
                                paymentInfo.status === "COMPLETED" ? "bg-green-600" :
                                paymentInfo.status === "PENDING" ? "bg-yellow-600" :
                                "bg-gray-600"
                            }`}>
                                {paymentInfo.status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Invoice Items Breakdown */}
                {paymentInfo.invoiceItems && paymentInfo.invoiceItems.length > 0 && (
                    <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">
                            🔧 Service Details
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-700">
                                    <tr>
                                        <th className="px-3 py-2 text-left">Service</th>
                                        <th className="px-3 py-2 text-left">Action</th>
                                        <th className="px-3 py-2 text-left">Part</th>
                                        <th className="px-3 py-2 text-right">Labor</th>
                                        <th className="px-3 py-2 text-right">Parts</th>
                                        <th className="px-3 py-2 text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paymentInfo.invoiceItems.map((item, index) => (
                                        <tr key={index} className="border-b border-gray-700">
                                            <td className="px-3 py-3">{item.service}</td>
                                            <td className="px-3 py-3">
                                                <span className="text-xs bg-blue-900 px-2 py-1 rounded">
                                                    {item.actionType}
                                                </span>
                                            </td>
                                            <td className="px-3 py-3 text-gray-400">{item.partName}</td>
                                            <td className="px-3 py-3 text-right">{item.laborCost.toLocaleString()}</td>
                                            <td className="px-3 py-3 text-right">{item.partCost.toLocaleString()}</td>
                                            <td className="px-3 py-3 text-right font-semibold">{item.subtotal.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-gray-700 font-semibold">
                                    <tr>
                                        <td colSpan="3" className="px-3 py-3 text-right">Total Labor:</td>
                                        <td className="px-3 py-3 text-right">{paymentInfo.totalLabor.toLocaleString()} VND</td>
                                        <td colSpan="2"></td>
                                    </tr>
                                    <tr>
                                        <td colSpan="3" className="px-3 py-3 text-right">Total Parts:</td>
                                        <td className="px-3 py-3 text-right">{paymentInfo.totalParts.toLocaleString()} VND</td>
                                        <td colSpan="2"></td>
                                    </tr>
                                    <tr className="text-lg">
                                        <td colSpan="3" className="px-3 py-3 text-right">GRAND TOTAL:</td>
                                        <td colSpan="3" className="px-3 py-3 text-right text-green-400">
                                            {paymentInfo.amount.toLocaleString()} VND
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                )}

                {/* Payment Method Selection */}
                {paymentInfo.status !== "COMPLETED" && (
                    <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">
                            💰 Select Payment Method
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {/* VNPay Option */}
                            <div
                                onClick={() => setPaymentMethod("VNPAY")}
                                className={`cursor-pointer border-2 rounded-lg p-4 transition ${
                                    paymentMethod === "VNPAY"
                                        ? "border-blue-500 bg-blue-900/30"
                                        : "border-gray-600 hover:border-gray-500"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="VNPAY"
                                        checked={paymentMethod === "VNPAY"}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-5 h-5"
                                    />
                                    <div>
                                        <div className="font-semibold text-lg">VNPay</div>
                                        <div className="text-sm text-gray-400">
                                            Pay online via VNPay gateway
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Cash Option */}
                            <div
                                onClick={() => setPaymentMethod("CASH")}
                                className={`cursor-pointer border-2 rounded-lg p-4 transition ${
                                    paymentMethod === "CASH"
                                        ? "border-green-500 bg-green-900/30"
                                        : "border-gray-600 hover:border-gray-500"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="CASH"
                                        checked={paymentMethod === "CASH"}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-5 h-5"
                                    />
                                    <div>
                                        <div className="font-semibold text-lg">💵 Cash</div>
                                        <div className="text-sm text-gray-400">
                                            Pay in cash when picking up vehicle
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handlePayment}
                            disabled={processing || !paymentMethod}
                            className={`w-full py-4 rounded-lg font-bold text-lg transition ${
                                processing || !paymentMethod
                                    ? "bg-gray-600 cursor-not-allowed"
                                    : "bg-green-600 hover:bg-green-700"
                            }`}
                        >
                            {processing ? "Processing..." : `Proceed to Payment (${paymentMethod})`}
                        </button>
                    </div>
                )}

                {/* Already Paid */}
                {paymentInfo.status === "COMPLETED" && (
                    <div className="bg-green-900/30 border-2 border-green-500 rounded-lg p-8 text-center">
                        <div className="text-6xl mb-4">✅</div>
                        <h2 className="text-2xl font-bold mb-2">Payment Completed!</h2>
                        <p className="text-gray-300 mb-6">
                            Thank you for your payment. Your vehicle is ready for pickup.
                        </p>
                        <button
                            onClick={() => navigate("/booking-list")}
                            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg"
                        >
                            Back to Bookings
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
