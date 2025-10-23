import React, { useEffect, useState } from "react";
import api from "../../api.js";
import { useNavigate } from "react-router-dom";

export default function BookingSection() {
    const [plans, setPlans] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMaintenancePlans = async () => {
            try {
                const res = await api.get("/customer/maintenance-plans");
                setPlans(res.data);
            } catch (error) {
                console.error("Failed to load maintenance plans", error);
            }
        };
        fetchMaintenancePlans();
    }, []);

    return (
        <div className="bg-gray-600 p-6 rounded-xl mt-4">
            <h3 className="text-lg font-semibold mb-3">Maintenance Plans</h3>
            <div className="space-y-3">
                {plans.length > 0 ? (
                    plans.map((plan) => (
                        <div key={plan.id} className="bg-gray-500 p-3 rounded-md">
                            <p>📍 Interval: {plan.intervalKm} km / {plan.intervalMonths} months</p>
                            <ul className="list-disc list-inside text-sm mt-2">
                                {plan.items.map((item) => (
                                    <li key={item.id}>{item.taskName} — {item.partType}</li>
                                ))}
                            </ul>
                        </div>
                    ))
                ) : (
                    <p>No maintenance plan available.</p>
                )}
            </div>

            <button
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 mt-4 rounded-lg"
                onClick={() => navigate("/dealer")}
            >
                Book Service →
            </button>
        </div>
    );
}
