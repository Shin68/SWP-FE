import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHome } from "react-icons/fa";

export default function VehicleDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const vehicleId = state?.vehicleId;

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!vehicleId) return navigate(-1);

    const fetchVehicle = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/customer/vehicle/details/${vehicleId}`
        );
        setVehicle(res.data);
      } catch (err) {
        console.error("Error fetching vehicle:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [vehicleId, navigate]);

  if (loading) return <div className="text-white p-6">Loading...</div>;
  if (!vehicle) return <div className="text-white p-6">Not found</div>;

  return (
    <div className="min-h-screen bg-gray-700 text-white pb-8">
      {/* Header */}
      <header className="bg-gray-800 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="/img/logo.jpg" alt="Logo" className="h-10 w-10" />
          <span className="font-bold text-lg">EV</span>
        </div>

        <div className="flex gap-4 items-center">
          <button
            onClick={() => navigate("/home")}
            className="text-white hover:text-gray-300"
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
          <h2 className="font-bold text-lg">{vehicle.model}</h2>
          <p>Brand: {vehicle.brand}</p>
          <p>Plate: {vehicle.license_plate}</p>
          <p>Odometer: {vehicle.odometer} km</p>
          <p>Year: {vehicle.year}</p>
        </div>
        <button
          onClick={() => navigate("/dealer")}
          className="bg-red-600 px-4 py-2 rounded h-fit"
        >
          Book Service
        </button>
      </section>

      {/* Maintenance Section */}
      <section className="bg-gray-100 text-gray-900 mx-4 mt-4 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">
          Periodic Inspection Information
        </h3>

        {/* Maintenance cycles */}
        <div className="flex justify-center gap-2 mb-4">
          <div className="bg-red-500 text-white px-3 py-1 rounded">Time 1</div>
          <div className="bg-yellow-500 text-white px-3 py-1 rounded">
            Time 2
          </div>
          <div className="bg-gray-300 px-3 py-1 rounded">Time 3</div>
          <div className="bg-gray-300 px-3 py-1 rounded">Time 4</div>
          <div className="bg-gray-300 px-3 py-1 rounded">Time 5</div>
          <div className="bg-gray-300 px-3 py-1 rounded">Time 6</div>
        </div>

        {/* Legend */}
        <div className="flex justify-center items-center gap-4 text-sm mb-2">
          <div className="flex items-center gap-1">
            <span className="w-4 h-4 bg-green-500 rounded"></span> On Time
          </div>
          <div className="flex items-center gap-1">
            <span className="w-4 h-4 bg-red-500 rounded"></span> Overdue
          </div>
          <div className="flex items-center gap-1">
            <span className="w-4 h-4 bg-yellow-400 rounded"></span> Next Time
          </div>
        </div>

        {/* Next check */}
        <div className="text-center mt-3 text-sm">
          <p>
            Next Inspection Expiry Date (Time 2):{" "}
            <span className="font-semibold">{vehicle.nextCheck}</span>
          </p>
        </div>
      </section>

      {/* Repair History */}
      <section className="bg-gray-100 text-gray-900 mx-4 mt-4 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">Repair History</h3>
        <p className="text-center text-gray-600 text-sm">
          No repair information available at EV dealers in Vietnam
        </p>
      </section>
    </div>
  );
}
