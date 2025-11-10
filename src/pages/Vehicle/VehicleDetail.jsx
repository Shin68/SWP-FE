import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHome } from "react-icons/fa";
import { API_BASE_URL } from "../../App/config";

export default function VehicleDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const vehicleId = state?.vehicleId;

  const [vehicle, setVehicle] = useState(null);
  const [maintenanceInfo, setMaintenanceInfo] = useState(null);
  const [serviceHistory, setServiceHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!vehicleId) return navigate(-1);

    const fetchData = async () => {
      try {
        // Fetch vehicle details
        const vehicleRes = await axios.get(
          `${API_BASE_URL}/customer/vehicle/details/${vehicleId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setVehicle(vehicleRes.data);

        // Fetch maintenance/reminder info
        const maintenanceRes = await axios.get(
          `${API_BASE_URL}/customer/vehicle/${vehicleId}/maintenance`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMaintenanceInfo(maintenanceRes.data);

        // Fetch service history
        const historyRes = await axios.get(
          `${API_BASE_URL}/customer/vehicle/${vehicleId}/service-history`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (historyRes.data.success) {
          setServiceHistory(historyRes.data.serviceHistory || []);
        }

      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [vehicleId, navigate, token]);

  if (loading) return (
    <div className="min-h-screen bg-gray-700 text-white flex items-center justify-center">
      <div className="text-xl">Loading vehicle details...</div>
    </div>
  );

  if (!vehicle) return (
    <div className="min-h-screen bg-gray-700 text-white flex items-center justify-center">
      <div className="text-xl">Vehicle not found</div>
    </div>
  );

  // Get reminder status colors
  const getReminderStatus = (reminders, index) => {
    if (!reminders || !reminders[index]) return "bg-gray-300";
    const status = reminders[index].status;
    if (status === "DONE") return "bg-green-500";
    if (status === "MISSED") return "bg-red-500";
    if (status === "PENDING") return "bg-yellow-400";
    return "bg-gray-300";
  };

  const getNextReminder = (reminders) => {
    if (!reminders || reminders.length === 0) return null;
    
    const pending = reminders.find(r => r.status === "PENDING");
    if (pending) return pending;
    
    const missed = reminders.find(r => r.status === "MISSED");
    return missed || reminders[0];
  };

  const nextReminder = maintenanceInfo ? getNextReminder(maintenanceInfo.maintenanceReminders) : null;

  return (
    <div className="min-h-screen bg-gray-700 text-white pb-8">
      {/* Header */}
      <header className="bg-gray-800 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="/img/logo.jpg" alt="Logo" className="h-10 w-10" />
          <span className="font-bold text-lg">EV Service Center</span>
        </div>

        <div className="flex gap-4 items-center">
          <button
            onClick={() => navigate("/home")}
            className="text-white hover:text-gray-300"
            title="Home"
          >
            <FaHome size={20} />
          </button>
          <span>🔔</span>
          <span>⚙️</span>
          <img
            src="/img/avt.jpg"
            alt="User"
            className="h-8 w-8 rounded-full border border-gray-400"
          />
        </div>
      </header>

      {/* Vehicle Info */}
      <section className="bg-gray-600 mx-4 mt-4 rounded-lg p-4 flex gap-4">
        <div className="flex-1">
          <h2 className="font-bold text-xl mb-2">{vehicle.brand} {vehicle.model}</h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p><span className="text-gray-300">License Plate:</span> <span className="font-semibold">{vehicle.license_plate || 'N/A'}</span></p>
            <p><span className="text-gray-300">VIN:</span> <span className="font-semibold">{vehicle.vin || 'N/A'}</span></p>
            <p><span className="text-gray-300">Odometer:</span> <span className="font-semibold">{vehicle.odometer ? vehicle.odometer.toLocaleString() : 'N/A'} km</span></p>
            <p><span className="text-gray-300">Purchase Date:</span> <span className="font-semibold">{vehicle.purchaseDate || 'N/A'}</span></p>
          </div>
        </div>
        <button
          onClick={() => navigate("/dealer")}
          className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded h-fit font-semibold transition"
        >
          📅 Book Service
        </button>
      </section>

      {/* Periodic Inspection Information */}
      <section className="bg-gray-100 text-gray-900 mx-4 mt-4 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">
          🔧 Periodic Inspection Information
        </h3>

        {/* Maintenance cycles */}
        <div className="flex justify-center gap-2 mb-4 flex-wrap">
          {maintenanceInfo && maintenanceInfo.maintenanceReminders ? (
            maintenanceInfo.maintenanceReminders.map((reminder, index) => (
              <div
                key={index}
                className={`${getReminderStatus(maintenanceInfo.maintenanceReminders, index)} text-white px-3 py-1 rounded text-sm font-semibold`}
                title={`${reminder.status} - ${reminder.reminderDate}`}
              >
                Time {index + 1}
              </div>
            ))
          ) : (
            <>
              <div className="bg-gray-300 px-3 py-1 rounded text-sm">Time 1</div>
              <div className="bg-gray-300 px-3 py-1 rounded text-sm">Time 2</div>
              <div className="bg-gray-300 px-3 py-1 rounded text-sm">Time 3</div>
              <div className="bg-gray-300 px-3 py-1 rounded text-sm">Time 4</div>
              <div className="bg-gray-300 px-3 py-1 rounded text-sm">Time 5</div>
              <div className="bg-gray-300 px-3 py-1 rounded text-sm">Time 6</div>
            </>
          )}
        </div>

        {/* Legend */}
        <div className="flex justify-center items-center gap-4 text-sm mb-3">
          <div className="flex items-center gap-1">
            <span className="w-4 h-4 bg-green-500 rounded"></span> Done
          </div>
          <div className="flex items-center gap-1">
            <span className="w-4 h-4 bg-red-500 rounded"></span> Overdue
          </div>
          <div className="flex items-center gap-1">
            <span className="w-4 h-4 bg-yellow-400 rounded"></span> Pending
          </div>
          <div className="flex items-center gap-1">
            <span className="w-4 h-4 bg-gray-300 rounded"></span> Not Set
          </div>
        </div>

        {/* Next check */}
        {nextReminder && (
          <div className={`text-center mt-3 p-3 rounded ${
            nextReminder.status === "MISSED" ? "bg-red-100 border border-red-400" : 
            nextReminder.status === "PENDING" ? "bg-yellow-100 border border-yellow-400" : 
            "bg-gray-200"
          }`}>
            <p className="text-sm">
              {nextReminder.status === "MISSED" ? "⚠️ Overdue Inspection:" : "📅 Next Inspection:"}{" "}
              <span className="font-semibold">{nextReminder.reminderDate}</span>
              {nextReminder.status === "MISSED" && (
                <span className="ml-2 text-red-600 text-xs">(Please schedule service soon!)</span>
              )}
            </p>
          </div>
        )}
      </section>

      {/* Service History */}
      <section className="bg-gray-100 text-gray-900 mx-4 mt-4 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">🛠️ Service History</h3>
        
        {serviceHistory.length === 0 ? (
          <p className="text-center text-gray-600 text-sm py-4">
            No service history available yet
          </p>
        ) : (
          <div className="space-y-3">
            {serviceHistory.map((service, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-semibold text-base">
                      {service.date} {service.time && `at ${service.time}`}
                    </div>
                    <div className="text-sm text-gray-600">
                      {service.serviceCenter || 'Service Center'}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded text-xs font-semibold ${
                    service.status === 'COMPLETED' || service.status === 'PAID' ? 'bg-green-100 text-green-700' :
                    service.status === 'PAYMENT_PENDING' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {service.status}
                  </div>
                </div>

                {service.odometer && (
                  <div className="text-sm text-gray-600 mb-2">
                    📊 Odometer: <span className="font-semibold">{service.odometer.toLocaleString()} km</span>
                  </div>
                )}

                <div className="text-sm mb-2">
                  <span className="font-semibold">Services:</span>{" "}
                  {service.services && service.services.length > 0 ? (
                    service.services.join(", ")
                  ) : (
                    "N/A"
                  )}
                </div>

                {service.technician && (
                  <div className="text-sm text-gray-600 mb-2">
                    👨‍🔧 Technician: {service.technician}
                  </div>
                )}

                {service.totalCost && (
                  <div className="text-sm font-semibold text-green-600 mt-2">
                    💰 Total: {service.totalCost.toLocaleString()} VND
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
