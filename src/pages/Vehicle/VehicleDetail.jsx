import React from "react";
import BookingSection from "./BookingSection";
import { FaHome, FaCog } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function VehicleDetail() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-700 text-white">
      <header className="bg-gray-800 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="/img/logo.jpg" alt="Logo" className="h-10 w-10" />
          <span className="font-bold text-lg">EV</span>
        </div>
        <div className="flex gap-4 items-center">
          <button onClick={() => navigate("/home")} className="text-white hover:text-gray-300">
            <FaHome size={20} />
          </button>
          <FaCog size={20} className="cursor-pointer hover:text-gray-300" />
        </div>
      </header>

      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Vehicle Details</h2>
        <div className="bg-gray-600 p-4 rounded-lg mb-6">
          <p>Model: Felix 2025</p>
          <p>License Plate: 59X4-12969</p>
          <p>VIN: VF8E1ABC03456789</p>
        </div>
        <BookingSection />
      </div>
    </div>
  );
}
