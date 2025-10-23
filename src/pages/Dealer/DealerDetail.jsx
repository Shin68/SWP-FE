import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaPhoneAlt, FaClock, FaArrowRight, FaHome, FaCog } from "react-icons/fa";
import { PAGE_URLS } from "../../App/config";


export default function DealerDetail() {
  const routerLocation = useLocation();
  const navigate = useNavigate();
  const dealer = routerLocation.state?.dealer || {
    name: "Saigon Anh Phat",
    rating: 5.0,
    reviews: 388,
    address: "123 A Street, B Ward, Ho Chi Minh City",
    phone: "02838118324",
    hours: "7:00 - 17:30",
  };
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

          {/* ⚙️ Settings Menu */}
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

      {/* Dealer info card */}
      <div className="p-4">
        <div className="bg-gray-100 text-gray-900 p-6 rounded-lg mx-auto max-w-md">
          <h2 className="text-lg font-bold text-center mb-2">{dealer.name}</h2>
          <div className="text-center text-sm mb-3">
            ⭐ {dealer.rating} <span className="text-gray-600">({dealer.reviews} reviews)</span>
          </div>

          <button
            className="bg-red-600 hover:bg-red-700 text-white w-full py-2 rounded mb-4"
            onClick={() => navigate(PAGE_URLS.SELECT_VEHICLE, { state: { dealer } })}
          >
            Book Service
          </button>

          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <FaMapMarkerAlt className="mt-1 text-red-500" />
              <div>
                <p className="font-medium">Location</p>
                <p>{dealer.address}</p>
              </div>
              <FaArrowRight className="ml-auto text-red-500" />
            </div>
            <hr />
            <div className="flex items-start gap-2">
              <FaClock className="mt-1 text-gray-600" />
              <div>
                <p className="font-medium">Working Hours</p>
                <p>{dealer.hours}</p>
              </div>
            </div>
            <hr />
            <div className="flex items-start gap-2">
              <FaPhoneAlt className="mt-1 text-gray-600" />
              <div>
                <p className="font-medium">Phone Number</p>
                <p>{dealer.phone}</p>
              </div>
            </div>
          </div>

          <button className="mt-5 w-full border border-gray-400 text-gray-700 py-2 rounded hover:bg-gray-200">
            🤍 Add to My Dealers
          </button>
        </div>

        <button
          onClick={() => navigate('/dealer')}
          className="mt-6 bg-gray-900 text-white px-4 py-2 rounded block mx-auto"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
