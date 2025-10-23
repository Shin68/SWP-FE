import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaCog } from "react-icons/fa";

export default function BookingList() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const bookings = [
    {
      id: 1,
      dealer: "VinFast Thu Duc",
      service: "Maintenance, Oil Change",
      date: "2025-10-18",
      time: "09:30",
      status: "Confirmed",
    },
  ];

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
                    navigate("/");
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

      {/* Booking list */}
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">My Bookings</h2>

        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-gray-600 p-4 rounded-lg">
              <h3 className="font-semibold">{booking.dealer}</h3>
              <p>Service: {booking.service}</p>
              <p>Date: {booking.date}</p>
              <p>Time: {booking.time}</p>
              <p>Status: {booking.status}</p>

              <button
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm mt-2"
                onClick={() =>
                  navigate("/booking-detail", { state: { booking } })
                }
              >
                View Details
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate("/home")}
          className="mt-6 bg-gray-900 text-white px-4 py-2 rounded"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
