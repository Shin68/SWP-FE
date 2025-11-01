import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaStar, FaArrowRight, FaHome, FaCog, FaPhoneAlt } from "react-icons/fa";
import axios from "axios";
import { PAGE_URLS } from "../../App/config";

export default function Dealer() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const selectedVehicle = loggedInUser?.vehicles?.[0];
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [loadingDealer, setLoadingDealer] = useState(false);

  useEffect(() => {
    const fetchDealers = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/admin/service-centers");
        setDealers(res.data);
      } catch (err) {
        console.error("Error fetching dealers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDealers();
  }, []);

  const openDealerModal = async (dealer) => {
    setLoadingDealer(true);
    setSelectedDealer(null);
    try {
      const res = await axios.get(`http://localhost:8080/api/admin/service-centers/${dealer.id}`);
      setSelectedDealer(res.data);
    } catch (err) {
      console.error(err);
      alert("Cannot fetch dealer info");
    } finally {
      setLoadingDealer(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-700 text-white pb-8">
      {/* Header */}
      <header className="bg-gray-800 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="/img/logo.jpg" alt="Logo" className="h-10 w-10" />
          <span className="font-bold text-lg">EV</span>
        </div>
        <div className="flex gap-4 items-center relative">
          <button onClick={() => navigate("/home")}><FaHome size={20} /></button>
          <span>🔔</span>
          <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)}><FaCog size={20} /></button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white text-black rounded shadow-lg z-50">
                <button
                  onClick={() => { navigate("/profile-view"); setMenuOpen(false); }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                >
                  View Profile
                </button>
                <button
                  onClick={() => { localStorage.removeItem("loggedInUser"); setMenuOpen(false); navigate("/"); }}
                  className="block w-full text-left px-4 py-2 text-red-600 font-bold hover:bg-red-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
          <img src="/img/avt.jpg" alt="User" className="h-8 w-8 rounded-full border border-gray-400" />
        </div>
      </header>

      {/* Dealer list */}
      <div className="bg-gray-600 mx-4 mt-4 rounded-lg p-4">
        {dealers.map((dealer) => (
          <div
            key={dealer.id}
            className="flex justify-between items-center border-b border-gray-400 py-3 last:border-none"
          >
            <div>
              <h2 className="font-semibold">{dealer.name}</h2>
              <div className="flex items-center text-yellow-400 text-sm mt-1">
                {[...Array(5)].map((_, i) => (<FaStar key={i} />))}
                <span className="text-gray-300 ml-2">{dealer.rating?.toFixed(1) || 5.0}</span>
              </div>
              <div className="flex items-center text-sm text-gray-200 mt-1">
                <FaMapMarkerAlt className="text-red-500 mr-2" />
                <span>{dealer.location || "No address"}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FaPhoneAlt /> <span>{dealer.contactNumber || "No phone"}</span>
            </div>
            <button
              className="text-red-500 hover:text-red-400 text-xl"
              onClick={() => openDealerModal(dealer)}
            >
              <FaArrowRight />
            </button>
          </div>
        ))}
      </div>

      {/* Dealer Detail Modal */}
      {selectedDealer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-700 text-white p-6 rounded-lg w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-300 hover:text-white"
              onClick={() => setSelectedDealer(null)}
            >
              ✕
            </button>
            {loadingDealer ? (
              <div className="flex justify-center items-center py-10">Loading...</div>
            ) : (
              <>
                <h2 className="text-lg font-bold text-center mb-2">{selectedDealer.name}</h2>
                {selectedDealer.address && (
                  <p className="text-center text-sm mb-2">{selectedDealer.address}</p>
                )}
                <div className="text-center text-sm mb-2">
                  Rating: {selectedDealer.rating?.toFixed(1) || 5.0} ({selectedDealer.reviews || 0} reviews)
                </div>
                {selectedDealer.contactNumber && (
                  <div className="flex items-center justify-center gap-2 mb-2 text-sm">
                    <FaPhoneAlt /> {selectedDealer.contactNumber}
                  </div>
                )}

                {/* Date & Time */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white mb-1 font-medium">Select Date</label>
                    <input
                      type="date"
                      className="w-full p-2 border border-gray-400 rounded bg-gray-700 text-white"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  <div>
                    <label className="block text-white mb-1 font-medium">Select Time</label>
                    <select
                      className="w-full p-2 border border-gray-400 rounded bg-gray-700 text-white"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                    >
                      <option value="">-- Select Time --</option>
                      {Array.from({ length: 9 }, (_, i) => {
                        const hour = 9 + i;
                        const formatted = hour.toString().padStart(2, "0") + ":00";
                        return (
                          <option key={hour} value={formatted}>
                            {formatted}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                <div className="flex justify-between mt-4">
                  <button
                    className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800"
                    onClick={() => setSelectedDealer(null)}
                  >
                    ← Back
                  </button>
                  <button
                    disabled={!scheduleDate || !scheduleTime}
                    className={`px-4 py-2 rounded text-white 
    ${!scheduleDate || !scheduleTime
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700"}`}
                    onClick={() => {
                      if (!scheduleDate || !scheduleTime) return;
                      navigate(PAGE_URLS.CONFIRM_BOOKING, {
                        state: {
                          dealer: selectedDealer,
                          vehicleId: selectedVehicle.id,
                          date: scheduleDate,
                          time: scheduleTime
                        }
                      });
                    }}
                  >
                    Next →
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
