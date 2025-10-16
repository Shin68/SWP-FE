import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaCog } from "react-icons/fa";

export default function BookingDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const booking = location.state?.booking;

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-700 text-white flex items-center justify-center">
        <p>No booking data found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-700 text-white">
      {/* Header */}
      <header className="bg-gray-800 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="/img/logo.jpg" alt="Logo" className="h-10 w-10" />
          <span className="font-bold text-lg">EV</span>
        </div>

        <div className="flex gap-4 items-center relative">
          <button
            onClick={() => navigate("/home")}
            className="text-white hover:text-gray-300"
          >
            <FaHome size={20} />
          </button>

          <span>🔔</span>

          {/* ⚙️ Settings */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white hover:text-gray-300"
            >
              <FaCog size={20} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white text-black rounded shadow-lg z-50">
                <button
                  onClick={() => {
                    navigate("/profile-view");
                    setMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                >
                  View Profile
                </button>
                <button
                  onClick={() => {
                    navigate("/login");
                    setMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-red-600 font-bold hover:bg-red-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Booking detail */}
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Booking Details</h2>

        <div className="bg-gray-600 p-4 rounded-lg space-y-3">
          <div>
            <p className="font-semibold">Dealer</p>
            <p>{booking.dealer}</p>
          </div>
          <div>
            <p className="font-semibold">Service</p>
            <p>{booking.service}</p>
          </div>
          <div>
            <p className="font-semibold">Date</p>
            <p>{booking.date}</p>
          </div>
          <div>
            <p className="font-semibold">Time</p>
            <p>{booking.time}</p>
          </div>
          <div>
            <p className="font-semibold">Status</p>
            <p>{booking.status}</p>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
            onClick={() => navigate("/booking-list")}
          >
            ← Back
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            onClick={() => navigate("/home")}
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
