import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../App/config";

export default function PaymentReturn() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [processing, setProcessing] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const processVNPayReturn = async () => {
            try {
                // Lấy tất cả query parameters từ VNPay
                const params = {};
                searchParams.forEach((value, key) => {
                    params[key] = value;
                });

                console.log("VNPay return params:", params);

                // Gọi backend để xử lý kết quả từ VNPay
                const queryString = searchParams.toString();
                const response = await axios.get(
                    `${API_BASE_URL}/payment/vnpay-callback?${queryString}`
                );

                console.log("Payment callback response:", response.data);

                if (response.data.success) {
                    setSuccess(true);
                    setPaymentInfo(response.data);
                    
                    // Bắt đầu countdown
                    const timer = setInterval(() => {
                        setCountdown((prev) => {
                            if (prev <= 1) {
                                clearInterval(timer);
                                navigate("/booking-list");
                                return 0;
                            }
                            return prev - 1;
                        });
                    }, 1000);

                    return () => clearInterval(timer);
                } else {
                    setError(response.data.message || "Payment verification failed");
                }
            } catch (err) {
                console.error("Error processing payment return:", err);
                setError(err.response?.data?.message || "Failed to process payment");
            } finally {
                setProcessing(false);
            }
        };

        processVNPayReturn();
    }, [searchParams, navigate]);

    // Processing state
    if (processing) {
        return (
            <div className="min-h-screen bg-gray-700 flex items-center justify-center text-white">
                <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-8 text-center">
                    <div className="text-6xl mb-6 animate-spin">⏳</div>
                    <h1 className="text-2xl font-bold mb-4">Processing Payment...</h1>
                    <p className="text-gray-300">
                        Please wait while we verify your payment with VNPay.
                    </p>
                    <div className="mt-6">
                        <div className="animate-pulse flex space-x-2 justify-center">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Success state
    if (success) {
        return (
            <div className="min-h-screen bg-gray-700 flex items-center justify-center text-white">
                <div className="max-w-2xl w-full bg-gray-800 rounded-lg shadow-lg p-8">
                    {/* Success Icon */}
                    <div className="text-center mb-6">
                        <div className="text-8xl mb-4 animate-bounce">✅</div>
                        <h1 className="text-4xl font-bold text-green-400 mb-2">
                            Payment Successful!
                        </h1>
                        <p className="text-gray-300 text-lg">
                            Your payment has been processed successfully
                        </p>
                    </div>

                    {/* Payment Details */}
                    <div className="bg-gray-700 rounded-lg p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">
                            📋 Payment Details
                        </h2>
                        <div className="space-y-3">
                            {paymentInfo?.paymentId && (
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Payment ID:</span>
                                    <span className="font-semibold">#{paymentInfo.paymentId}</span>
                                </div>
                            )}
                            {paymentInfo?.appointmentId && (
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Appointment ID:</span>
                                    <span className="font-semibold">#{paymentInfo.appointmentId}</span>
                                </div>
                            )}
                            {paymentInfo?.amount && (
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Amount Paid:</span>
                                    <span className="font-semibold text-green-400">
                                        {paymentInfo.amount.toLocaleString()} VND
                                    </span>
                                </div>
                            )}
                            {paymentInfo?.transactionNo && (
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Transaction No:</span>
                                    <span className="font-mono text-sm">{paymentInfo.transactionNo}</span>
                                </div>
                            )}
                            {paymentInfo?.payDate && (
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Payment Date:</span>
                                    <span className="font-semibold">{paymentInfo.payDate}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Success Message */}
                    <div className="bg-green-900/30 border-2 border-green-500 rounded-lg p-6 mb-6">
                        <div className="flex items-start gap-4">
                            <div className="text-4xl">🎉</div>
                            <div>
                                <h3 className="text-lg font-bold text-green-400 mb-2">
                                    Thank You for Your Payment!
                                </h3>
                                <p className="text-gray-300 text-sm mb-2">
                                    Your vehicle is now ready for pickup. We've sent a confirmation email to your registered address.
                                </p>
                                <p className="text-gray-300 text-sm">
                                    Please bring a valid ID when picking up your vehicle.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4 text-center">
                            <p className="text-gray-300">
                                Redirecting to your bookings in <span className="font-bold text-blue-400 text-xl">{countdown}</span> seconds...
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => navigate("/booking-list")}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition"
                            >
                                View My Bookings
                            </button>
                            <button
                                onClick={() => navigate("/home")}
                                className="flex-1 bg-gray-600 hover:bg-gray-500 px-6 py-3 rounded-lg font-semibold transition"
                            >
                                Go to Home
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    return (
        <div className="min-h-screen bg-gray-700 flex items-center justify-center text-white">
            <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-8">
                <div className="text-center mb-6">
                    <div className="text-8xl mb-4">❌</div>
                    <h1 className="text-3xl font-bold text-red-400 mb-2">
                        Payment Failed
                    </h1>
                    <p className="text-gray-300">
                        {error || "Something went wrong with your payment"}
                    </p>
                </div>

                <div className="bg-red-900/30 border-2 border-red-500 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-300">
                        Your payment could not be processed. Please try again or contact support if the problem persists.
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => navigate("/booking-list")}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold"
                    >
                        Back to Bookings
                    </button>
                    <button
                        onClick={() => window.history.back()}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        </div>
    );
}
