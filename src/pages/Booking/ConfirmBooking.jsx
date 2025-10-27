import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ConfirmBooking() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!state) {
            navigate(-1);
            return;
        }

        const fetchVehicle = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:8080/api/customer/vehicle/details/${state.vehicleId}`
                );
                setVehicle(res.data);
            } catch (err) {
                console.error("Error fetching vehicle:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchVehicle();
    }, [state, navigate]);

    if (!state) return null;
    const { dealer, date, time, vehicleId } = state;

    const handleConfirmBooking = async () => {
        if (!vehicleId || !dealer?.id || !date || !time) {
            alert("Missing required information!");
            return;
        }

        try {
            await axios.post(
                `http://localhost:8080/api/customer/appointment/create/${vehicleId}/${dealer.id}`,
                {
                    appointmentDate: date,
                    appointmentTime: time
                }
            );
            alert("Booking created successfully!");
            navigate("/home");
        } catch (err) {
            console.error("Error creating booking:", err);
            alert("Cannot create booking. Please try again.");
        }
    };


    if (loading) return <div className="text-white p-6">Loading...</div>;
    if (!vehicle) return <div className="text-white p-6">Vehicle not found</div>;

    return (
        <div className="min-h-screen bg-gray-700 text-white p-6">
            <h1 className="text-xl font-bold mb-4 text-center">Confirm Booking</h1>
            <div className="bg-gray-600 rounded p-4 space-y-3">
                <div><b>Dealer:</b> {dealer?.name}</div>
                <div><b>Address:</b> {dealer?.address || dealer?.location}</div>
                <div><b>Vehicle:</b> {vehicle.brand} {vehicle.model}</div>
                <div><b>Date:</b> {date}</div>
                <div><b>Time:</b> {time}</div>
            </div>

            <div className="flex justify-between mt-6">
                <button
                    onClick={() => navigate(-1)}
                    className="bg-gray-800 px-4 py-2 rounded"
                >
                    ← Back
                </button>

                <button
                    className="bg-red-600 px-4 py-2 rounded"
                    onClick={handleConfirmBooking}
                >
                    Confirm
                </button>
            </div>
        </div>
    );
}
