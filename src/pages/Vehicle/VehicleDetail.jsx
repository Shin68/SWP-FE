import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaHome, FaCog } from "react-icons/fa";
import axios from "axios";

export default function VehicleDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const vehicleId = location.state?.vehicleId;

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch vehicles of customer
  useEffect(() => {
    if (!vehicleId) {
      setError("Customer ID not provided.");
      setLoading(false);
      return;
    }

    const fetchVehicles = async () => {
      try {
        console.log("Fetching vehicles for Customer ID:", vehicleId);
        const response = await axios.get(`http://localhost:8080/api/customer/vehicle/details/${vehicleId}`);
        console.log("Vehicle API response:", response.data);

        // Nếu API trả về user object, lấy mảng vehicles
        const vehiclesData = response.data.vehicles || response.data;
        setVehicles(vehiclesData);
        setLoading(false);
      } catch (err) {
        console.error("Vehicle API error:", err.response || err);
        setError("Failed to load vehicle details.");
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [vehicleId]);

  return (
    <div className="min-h-screen bg-gray-700 text-white">
      {/* Header */}
      <header className="bg-gray-800 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="/img/logo.jpg" alt="Logo" className="h-10 w-10" />
          <span className="font-bold text-lg">EV</span>
        </div>
        <div className="flex gap-4 items-center">
          <button onClick={() => navigate("/home")} className="text-white hover:text-gray-300">
            <FaHome size={20} />
          </button>
          <FaCog size={20} className="cursor-pointer hover:text-gray-300" />
        </div>
      </header>

      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Vehicle Details</h2>

        {loading && <p className="text-gray-300">Loading vehicle details...</p>}
        {error && <p className="text-red-400">{error}</p>}

        {vehicles.length > 0 ? (
          vehicles.map((v) => (
            <div key={v.id} className="bg-gray-600 p-4 rounded-lg mb-4">
              <p><strong>Model:</strong> {v.model || "Unknown Model"}</p>
              <p><strong>License Plate:</strong> {v.licensePlate || "N/A"}</p>
              <p><strong>VIN:</strong> {v.vin || "N/A"}</p>
              <p><strong>Brand:</strong> {v.brand || "N/A"}</p>
              <p><strong>Year:</strong> {v.year || "N/A"}</p>
              <p><strong>Odometer:</strong> {v.odometer || "N/A"}</p>
            </div>
          ))
        ) : (
          !loading && <p className="text-gray-300">No vehicles found.</p>
        )}
      </div>
    </div>
  );
}
