import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaCog } from "react-icons/fa";

export default function ServiceBooking() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dealer = location.state?.dealer;
  const [showModal, setShowModal] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");


  const services = [
    "Major Repair",
    "Oil Change",
    "Maintenance",
    "Parts Replacement",
    "Minor Repair",
    "Periodic Inspection",
    "2nd Inspection",
    "Warranty",
    "Service Campaign",
    "Other Vehicle",
  ];

  const toggleService = (service) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

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

          {/* ⚙️ Settings*/}
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
          <img
            src="/img/avt.jpg"
            alt="User"
            className="h-8 w-8 rounded-full border border-gray-400"
          />
        </div>
      </header>

      <div className="p-4">
        <div className="bg-gray-100 text-gray-900 p-6 rounded-lg mx-auto max-w-md">
          {dealer && <h2 className="text-lg font-semibold mb-4">Booking at {dealer.name}</h2>}
          {/* Step progress */}
          <div className="flex justify-between text-sm mb-6">
            {["Select Dealer", "Select Vehicle", "Select Service", "Review"].map((step, i) => (
              <div
                key={i}
                className={`px-3 py-2 rounded ${i < 4 ? "bg-green-400 text-gray-900" : "bg-gray-300 text-gray-600"
                  }`}
              >
                {step}
              </div>
            ))}
          </div>

          {/* Service type selection */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-base">Select Service Type</h3>
              <button
                onClick={() => setShowModal(true)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
              >
                Select Services
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Promotions
            </p>
            <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm mb-3">
              Select Promotion
            </button>

            {/* Display selected services */}
            <div className="bg-gray-200 rounded-md p-3 text-sm text-gray-800 min-h-[60px]">
              {selectedServices.length > 0 ? (
                <ul className="list-disc list-inside">
                  {selectedServices.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              ) : (
                <p>No service types selected.</p>
              )}
            </div>
          </div>

          {/* Image placeholders */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-gray-200 flex flex-col justify-center items-center rounded-md h-24">
              <span className="text-3xl text-gray-500">+</span>
              <p className="text-sm">My Vehicle Condition</p>
            </div>
            <div className="bg-gray-200 flex flex-col justify-center items-center rounded-md h-24">
              <span className="text-3xl text-gray-500">+</span>
              <p className="text-sm">Vehicle Video</p>
            </div>
          </div>

          {/* Date & Time selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Appointment Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2 rounded bg-gray-200 text-gray-900"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Appointment Time</label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full p-2 rounded bg-gray-200 text-gray-900"
            >
              <option value="">Select Time</option>
              {[
                "07:00", "07:30", "08:00", "08:30",
                "09:00", "09:30", "10:00", "10:30",
                "11:00", "11:30", "12:00", "12:30",
                "13:00", "13:30", "14:00", "14:30",
                "15:00", "15:30", "16:00", "16:30",
                "17:00", "17:30"
              ].map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>


          {/* Note + button */}
          <p className="text-xs text-gray-600 mb-3">
            * Estimated service time may change based on advisor's vehicle inspection results.
          </p>
          <button
            className="bg-red-600 hover:bg-red-700 w-full text-white py-2 rounded"
            onClick={() =>
              navigate('/review', {
                state: { dealer, selectedServices, selectedDate, selectedTime },
              })
            }
          >
            Next →
          </button>
        </div>

        <button
          onClick={() => navigate('/dealer-detail', { state: { dealer } })}
          className="mt-6 bg-gray-900 text-white px-4 py-2 rounded block mx-auto"
        >
          ← Back
        </button>
      </div>

      {/* MODAL: Select Services */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white text-gray-900 rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4 text-center">Select Service Types</h3>
            <p className="text-sm text-gray-600 mb-4 text-center">
              Please select service types. You can choose multiple for one appointment.
            </p>
            <div className="max-h-60 overflow-y-auto mb-4">
              {services.map((service) => (
                <label key={service} className="flex items-center gap-2 py-1 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(service)}
                    onChange={() => toggleService(service)}
                  />
                  {service}
                </label>
              ))}
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="border border-gray-400 text-gray-700 px-4 py-1 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
