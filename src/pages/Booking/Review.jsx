import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaCog } from "react-icons/fa";

export default function Review() {
  const routerLocation = useLocation();
  const navigate = useNavigate();
  const { dealer, selectedServices, selectedDate, selectedTime } = routerLocation.state || {};
  const [message, setMessage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

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
          <img
            src="/img/avt.jpg"
            alt="User"
            className="h-8 w-8 rounded-full border border-gray-400"
          />
        </div>
      </header>

      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Review Booking</h2>

        <div className="bg-gray-600 p-4 rounded-lg space-y-3">
          <div>
            <p className="font-semibold">Dealer</p>
            <p>{dealer?.name || "N/A"}</p>
          </div>

          <div>
            <p className="font-semibold">Selected Services</p>
            <p>{selectedServices?.length ? selectedServices.join(", ") : "No services selected"}</p>
          </div>

          <div>
            <p className="font-semibold">Appointment Date</p>
            <p>{selectedDate || "Not set"}</p>
          </div>

          <div>
            <p className="font-semibold">Appointment Time</p>
            <p>{selectedTime || "Not set"}</p>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
            onClick={() => navigate("/service-booking", { state: { dealer, selectedServices, selectedDate, selectedTime } })}
          >
            ← Back
          </button>

          <button
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            onClick={() => {
              setMessage("Booking confirmed! Thank you for choosing our service.");
              setTimeout(() => setMessage(""), 3000);
              navigate("/home");
            }}
          >
            Confirm Booking
          </button>

        </div>
        {
          message && (
            <p className="mt-4 text-center text-sm text-green-400">{message}</p>
          )
        }
      </div >
    </div >
  );
}