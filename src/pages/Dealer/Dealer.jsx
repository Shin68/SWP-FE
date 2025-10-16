import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaStar, FaArrowRight, FaHome, FaCog } from "react-icons/fa";


export default function DealerList() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);


  const dealers = [
    {
      name: "Saigon Anh Phat",
      rating: 5.0,
      reviews: 388,
      address: "123 A Ward, B Ward, Ho Chi Minh City",
    },
    {
      name: "Dong Anh #2",
      rating: 4.8,
      reviews: 239,
      address: "72/1 Truong Chinh Street, Tan Binh District, Ho Chi Minh City",
    },
    {
      name: "Tan Kieu #4",
      rating: 4.9,
      reviews: 428,
      address: "1 Quang Trung Street, Hanh Thong Ward, Ho Chi Minh City",
    },
    {
      name: "Vu Hai #2",
      rating: 4.8,
      reviews: 881,
      address: "23/2 Le Do Tho Street, An Hoi Ward, Go Vap District, Ho Chi Minh City",
    },
    {
      name: "Tan Thoi Moi",
      rating: 4.9,
      reviews: 1023,
      address: "314 Nguyen Oanh Street, Ho Chi Minh City",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-700 text-white pb-8">
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

      {/* Dealer list */}
      <div className="bg-gray-600 mx-4 mt-4 rounded-lg p-4">
        {dealers.map((dealer, index) => (
          <div
            key={index}
            className="flex justify-between items-center border-b border-gray-400 py-3 last:border-none"
          >
            <div>
              <h2 className="font-semibold">{dealer.name}</h2>

              {/* Rating */}
              <div className="flex items-center text-yellow-400 text-sm mt-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} />
                ))}
                <span className="text-gray-300 ml-2">
                  {dealer.rating.toFixed(1)} • {dealer.reviews} reviews
                </span>
              </div>

              {/* Address */}
              <div className="flex items-center text-sm text-gray-200 mt-1">
                <FaMapMarkerAlt className="text-red-500 mr-2" />
                <a href="#" className="text-blue-300 hover:underline">
                  {dealer.address}
                </a>
              </div>
            </div>

            {/* Arrow */}
            <button
              className="text-red-500 hover:text-red-400 text-xl"
              onClick={() => navigate('/dealer-detail', { state: { dealer } })}
            >
              <FaArrowRight />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
