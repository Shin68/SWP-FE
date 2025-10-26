import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaCog, FaStar, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import axios from "axios";

export default function Home() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser) {
        navigate("/");
        return;
      }

      try {
        const res = await axios.get(`http://localhost:8080/api/auth/profile/${storedUser.id}`);
        setCurrentUser(res.data);
        localStorage.setItem("loggedInUser", JSON.stringify(res.data));
      } catch (err) {
        console.error("Error fetching user:", err);

        setCurrentUser(storedUser);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setMenuOpen(false);
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
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
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-600 font-bold hover:bg-red-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Profile Section */}
      <section className="bg-gray-600 mx-4 mt-4 rounded-lg p-4 flex items-center gap-4">
        <img
          src="/img/avt.jpg"
          alt="Avatar"
          className="h-16 w-16 rounded-full border-2 border-white"
        />
        <div>
          <h2 className="text-xl font-semibold">{currentUser?.fullname || 'Guest'}</h2>
          <p className="text-sm text-gray-300">{currentUser?.phone || 'No phone'}</p>
          {currentUser?.role === 'Customer' && (
            <div className="flex gap-4 mt-1 text-xs text-gray-400">
              <span>📅 Member since {currentUser?.joinDate}</span>
              <span>🎯 {currentUser?.totalBookings || 0} bookings</span>
              <span>⭐ {currentUser?.loyaltyPoints || 0} points</span>
            </div>
          )}
        </div>
      </section>

      {/* Vehicles Section */}
      <section className="bg-gray-600 mx-4 mt-4 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">My Vehicles</h3>
        {currentUser?.vehicles?.length > 0 ? (
          <div className="flex flex-col gap-2">
            {currentUser.vehicles.map((vehicle) => (
              <div key={vehicle.id} className="flex justify-between items-center bg-gray-500 rounded-md p-3">
                <div className="flex items-center gap-3">
                  {/* Logo xe đã xoá */}
                  <div>
                    <div className="font-medium">{vehicle.make} {vehicle.model}</div>
                    <div className="text-xs text-gray-400">
                      Year: {vehicle.year ?? 'N/A'} - {(vehicle.mileage ?? 0).toLocaleString()} km
                    </div>
                  </div>
                </div>
                <button
                  className="text-sm text-gray-300 hover:text-white"
                  onClick={() => navigate("/vehicle-detail", { state: { vehicleName: vehicle.model } })}
                >
                  View →
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-4">No vehicles registered</div>
        )}
        <button
          onClick={() => navigate("/vehicle-list")}
          className="mt-3 w-full bg-gray-800 hover:bg-gray-900 text-sm py-2 rounded"
        >
          + Add My Vehicle
        </button>
      </section>


      {/* Promotions Section */}
      <section className="bg-gray-600 mx-4 mt-4 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">Promotions & Vouchers</h3>
        <p className="text-center text-gray-300 py-6">Sorry! No promotions yet.</p>
        <div className="flex justify-center">
          <button className="bg-gray-800 hover:bg-gray-900 px-4 py-2 rounded text-sm">View All Promotions</button>
        </div>
      </section>

      {/* Bookings Section */}
      <section className="bg-gray-600 mx-4 mt-4 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">My Bookings</h3>
        <button
          onClick={() => navigate("/booking-list")}
          className="w-full bg-gray-800 hover:bg-gray-900 text-sm py-2 rounded"
        >
          View My Bookings
        </button>
      </section>

      {/* Dealer Section */}
      <section className="bg-gray-600 mx-4 mt-4 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold mb-3">Nearby Dealers</h3>
        <div className="bg-white text-gray-900 p-4 rounded-md flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <img src="/img/ev.jpg" alt="EV Dealer" className="h-8 w-8" />
            <div>
              <h4 className="font-semibold">Vinfast Thu Duc</h4>
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (<FaStar key={i} />))}
              </div>
            </div>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <FaMapMarkerAlt className="mt-1" />
            <p>No. 1, Le Van Viet Road, Hiep Phu Ward, Thu Duc City</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <FaPhoneAlt /> <span>0971869363</span>
          </div>
          <button className="mt-2 bg-red-600 hover:bg-red-700 text-white text-sm py-2 rounded">
            Call to schedule maintenance
          </button>
        </div>
      </section>
    </div>
  );
}
