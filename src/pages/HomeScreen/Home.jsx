import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaCog, FaStar, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import axios from "axios";
import { PAGE_URLS, API_BASE_URL } from "../../App/config";

export default function Home() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dealers, setDealers] = useState([]);
  const [dealerLoading, setDealerLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [pendingQuotations, setPendingQuotations] = useState([]);
  const [quotationsLoading, setQuotationsLoading] = useState(true);
  const [pendingReports, setPendingReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (!storedUser) {
        navigate("/");
        return;
      }

      try {
        const res = await axios.get(`${API_BASE_URL}/auth/profile/${storedUser.id}`);
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

  useEffect(() => {
    const fetchDealers = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/admin/service-centers`);
        setDealers(res.data); // giả sử res.data là mảng dealer
      } catch (err) {
        console.error("Failed to fetch dealers:", err);
        setDealers([]);
      } finally {
        setDealerLoading(false);
      }
    };

    fetchDealers();
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if (!storedUser || !token) {
        setBookingsLoading(false);
        return;
      }

      try {
        console.log(`Fetching bookings for user ${storedUser.id}`);
        const res = await axios.get(
          `${API_BASE_URL}/customer/${storedUser.id}/appointments`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Bookings response:", res.data);
        // Get only the latest 3 bookings
        setBookings((res.data || []).slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        console.error("Error details:", err.response?.data);
        setBookings([]);
      } finally {
        setBookingsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    const fetchPendingQuotations = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if (!storedUser || !token) {
        setQuotationsLoading(false);
        return;
      }

      try {
        console.log(`Fetching quotations for user ${storedUser.id}`);
        // Get all appointments first
        const appointmentsRes = await axios.get(
          `${API_BASE_URL}/customer/${storedUser.id}/appointments`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // For each appointment, check if there's a pending quotation
        const quotationsPromises = (appointmentsRes.data || []).map(async (appointment) => {
          try {
            const quotRes = await axios.get(
              `${API_BASE_URL}/customer/totalcost/${appointment.id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            
            // Only return if quotation exists and is pending (customerApproved === null)
            if (quotRes.data && quotRes.data.customerApproved === null) {
              return {
                appointmentId: appointment.id,
                appointmentDate: appointment.appointmentDate,
                appointmentTime: appointment.appointmentTime,
                totalCost: quotRes.data.totalCost,
                itemCount: quotRes.data.reportDetails?.length || 0
              };
            }
            return null;
          } catch (err) {
            // No quotation for this appointment
            return null;
          }
        });

        const results = await Promise.all(quotationsPromises);
        const pending = results.filter(q => q !== null);
        setPendingQuotations(pending);
        console.log("Pending quotations:", pending);
      } catch (err) {
        console.error("Failed to fetch quotations:", err);
        setPendingQuotations([]);
      } finally {
        setQuotationsLoading(false);
      }
    };

    fetchPendingQuotations();
  }, []);

  useEffect(() => {
    const fetchPendingReports = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if (!storedUser || !token) {
        setReportsLoading(false);
        return;
      }

      try {
        console.log(`Fetching pending reports for user ${storedUser.id}`);
        const appointmentsRes = await axios.get(
          `${API_BASE_URL}/customer/${storedUser.id}/appointments`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // Filter appointments with status COMPLETED (report sent, waiting for review)
        const pending = (appointmentsRes.data || []).filter(
          appt => appt.status === 'COMPLETED'
        );
        
        setPendingReports(pending);
        console.log("Pending reports:", pending);
      } catch (err) {
        console.error("Failed to fetch pending reports:", err);
        setPendingReports([]);
      } finally {
        setReportsLoading(false);
      }
    };

    fetchPendingReports();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
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
          
          {/* Notification Bell */}
          <div className="relative">
            <span className="text-2xl cursor-pointer">🔔</span>
            {pendingReports.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {pendingReports.length}
              </span>
            )}
          </div>

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
                  <div>
                    <div className="font-medium">{vehicle.brand} {vehicle.model}</div>
                    <div className="text-xs text-gray-400">
                      Year: {vehicle.year ?? 'N/A'} - {(vehicle.odometer ?? 0).toLocaleString()} km
                    </div>
                  </div>
                </div>
                <button
                  className="text-sm text-gray-300 hover:text-white"
                  onClick={() =>
                    navigate("/vehicle-detail", { state: { vehicleId: vehicle.id } })
                  }
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

      {/* Bookings Section */}
      <section className="bg-gray-600 mx-4 mt-4 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">My Bookings</h3>
        {bookingsLoading ? (
          <div className="text-center text-gray-400 py-4">Loading bookings...</div>
        ) : bookings.length > 0 ? (
          <div className="flex flex-col gap-2 mb-3">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-gray-500 rounded-md p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-gray-200">
                      Appointment #{booking.id}
                    </div>
                    <div className="text-xs text-gray-300 mt-1">
                      📅 {booking.appointmentDate || "N/A"} at {booking.appointmentTime || "N/A"}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      👨‍🔧 {booking.technicianAssigned || "Not assigned"}
                    </div>
                  </div>
                  <div className={`text-xs font-semibold px-2 py-1 rounded ${
                    booking.status === 'COMPLETED' ? 'bg-green-600' :
                    booking.status === 'PENDING' ? 'bg-yellow-600' :
                    booking.status === 'IN_PROGRESS' ? 'bg-blue-600' :
                    'bg-gray-700'
                  }`}>
                    {booking.status || "Unknown"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-4">No bookings yet</div>
        )}
        <button
          onClick={() => navigate(PAGE_URLS.BOOKING_LIST)}
          className="w-full bg-gray-800 hover:bg-gray-900 text-sm py-2 rounded"
        >
          View All Bookings
        </button>
      </section>

      {/* Pending Reports - Action Required */}
      {pendingReports.length > 0 && (
        <section className="bg-red-600 mx-4 mt-4 rounded-lg p-4 border-2 border-yellow-400">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🔔</span>
            <h3 className="text-lg font-semibold">Reports Ready for Review - Action Required!</h3>
          </div>
          {reportsLoading ? (
            <div className="text-center text-white py-4">Loading reports...</div>
          ) : (
            <div className="flex flex-col gap-3">
              {pendingReports.map((report) => (
                <div key={report.id} className="bg-white text-gray-900 rounded-md p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-semibold text-lg">
                        Appointment #{report.id}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        📅 {report.appointmentDate} at {report.appointmentTime}
                      </div>
                      <div className="text-sm text-gray-600">
                        👨‍🔧 Technician: {report.technicianAssigned}
                      </div>
                    </div>
                    <div className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded">
                      ⏳ Waiting for Review
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/report-viewer/${report.id}`)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
                  >
                    📄 View PDF Report & Approve/Reject
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Pending Quotations Section */}
      {pendingQuotations.length > 0 && (
        <section className="bg-orange-600 mx-4 mt-4 rounded-lg p-4 border-2 border-yellow-400">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">⚠️</span>
            <h3 className="text-lg font-semibold">Pending Quotations - Action Required!</h3>
          </div>
          {quotationsLoading ? (
            <div className="text-center text-white py-4">Loading quotations...</div>
          ) : (
            <div className="flex flex-col gap-3">
              {pendingQuotations.map((quotation) => (
                <div key={quotation.appointmentId} className="bg-white text-gray-900 rounded-md p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-semibold text-lg">
                        Appointment #{quotation.appointmentId}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        📅 {quotation.appointmentDate} at {quotation.appointmentTime}
                      </div>
                      <div className="text-sm text-gray-600">
                        📋 {quotation.itemCount} maintenance tasks
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Total Cost</div>
                      <div className="text-xl font-bold text-blue-600">
                        {(quotation.totalCost || 0).toLocaleString()} VND
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/quotation/${quotation.appointmentId}`)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition"
                  >
                    📝 Review & Approve Quotation
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Dealer Section */}
      <section className="bg-gray-600 mx-4 mt-4 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold mb-3">Nearby Dealers</h3>

        {dealerLoading ? (
          <p className="text-white">Loading dealers...</p>
        ) : dealers.length === 0 ? (
          <p className="text-white">No dealers found.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {dealers.map((dealer) => (
              <div key={dealer.id} className="bg-white text-gray-900 p-4 rounded-md flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <img src={dealer.image || "/img/ev.jpg"} alt={dealer.name} className="h-8 w-8" />
                  <div>
                    <h4 className="font-semibold">{dealer.name}</h4>
                    <div className="flex text-yellow-500">
                      {[...Array(dealer.rating || 5)].map((_, i) => <FaStar key={i} />)}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-sm">
                  <FaMapMarkerAlt className="mt-1" />
                  <p>{dealer.location}</p> {/* location = address */}
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <FaPhoneAlt /> <span>{dealer.contactNumber}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
