import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function PaymentSuccess() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [countdown, setCountdown] = useState(5);

    const status = searchParams.get("status");
    const paymentId = searchParams.get("paymentId");
    const method = searchParams.get("method");

    useEffect(() => {
        if (status === "success") {
            const timer = setInterval(() => {
                setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate("/home");
                    return 0;
                }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [status, navigate]);

    if (status === "success") {
        return (
            <div className="min-h-screen bg-gray-700 flex items-center justify-center text-white">
                <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-8 text-center">
                    <div className="text-8xl mb-6 animate-bounce">✅</div>
                    <h1 className="text-3xl font-bold mb-4 text-green-400">
                        Payment Successful!
                    </h1>
                    <p className="text-gray-300 mb-6">
                        Your payment has been processed successfully.
                    </p>
                    <div className="bg-gray-700 rounded-lg p-4 mb-6">
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-400 mb-1">Payment ID</p>
                                <p className="text-xl font-mono font-bold">#{paymentId}</p>
                            </div>
                            {method && (
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">Payment Method</p>
                                    <p className="text-lg font-semibold">
                                        {method === 'QR' && '📱 QR Code'}
                                        {method === 'VNPAY' && '🏦 VNPay'}
                                        {method === 'CASH' && '💵 Cash'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="bg-green-900/30 border border-green-500 rounded-lg p-4 mb-6">
                        <p className="text-sm">
                            🎉 Thank you for your payment! 
                            {method === 'CASH' 
                                ? ' Please bring cash when picking up your vehicle.' 
                                : ' Your vehicle is ready for pickup.'}
                        </p>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">
                        Redirecting to home in {countdown} seconds...
                    </p>
                    <button
                        onClick={() => navigate("/home")}
                        className="w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold"
                    >
                        Go to Home Now
                    </button>
                </div>
            </div>
        );
    }

    // Payment failed or invalid
    return (
        <div className="min-h-screen bg-gray-700 flex items-center justify-center text-white">
            <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-8 text-center">
                <div className="text-8xl mb-6">❌</div>
                <h1 className="text-3xl font-bold mb-4 text-red-400">
                    Payment Failed
                </h1>
                <p className="text-gray-300 mb-6">
                    Something went wrong with your payment. Please try again.
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={() => navigate("/home")}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold"
                    >
                        Go to Home
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
