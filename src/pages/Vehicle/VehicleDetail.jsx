import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";

export default function VehicleDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const vehicleName = location.state?.vehicleName;

  const vehicles = [
    {
      name: "Felix2025",
      plate: "59X4-12969",
      model: "Felix2025",
      color: "White",
      distance: "12300km",
      battery: "LFP Battery Type",
      vin: "VF8E1ABC03456789",
      warranty: {
        start: "27/05/2025",
        end: "27/05/2024",
        policy: "Warranty Policy",
      },
      nextCheck: "27/11/2025",
      image: "/img/bike1.jpg",
    },
    {
      name: "Evo Neo",
      plate: "30A-123.45",
      model: "Evo Neo",
      color: "White",
      distance: "15000km",
      battery: "LFP Battery Type",
      vin: "VF8E1ABC03456789",
      warranty: {
        start: "15/10/2024",
        end: "15/10/2026",
        policy: "Warranty Policy",
      },
      nextCheck: "15/10/2025",
      image: "/img/bike2.jpg",
    },
    {
      name: "Klara Neo",
      plate: "51F-999.01",
      model: "Klara Neo",
      color: "White",
      distance: "8000km",
      battery: "LFP Battery Type",
      vin: "VF8E1ABC03456789",
      warranty: {
        start: "01/12/2024",
        end: "01/12/2026",
        policy: "Warranty Policy",
      },
      nextCheck: "15/10/2025",
      image: "/img/bike3.jpg",
    },
  ];

  const vehicle = vehicles.find((v) => v.name === vehicleName) || vehicles[0];

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

      <section className="bg-gray-600 mx-4 mt-4 rounded-lg p-4 flex flex-col sm:flex-row items-center sm:items-start gap-4">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="h-40 w-60 object-cover rounded"
        />
        <div>
          <div className="flex gap-0 left-1">
            <button
              onClick={() => navigate("/dealer")}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded mt-2"
            >
              Book Service
            </button>

          </div>
          <h2 className="font-bold text-lg">{vehicle.model}</h2>
          <p>Model: {vehicle.model}</p>
          <p>Distance Traveled: {vehicle.distance}</p>
          <p>Battery Type: {vehicle.battery}</p>
          <p>VIN (Frame Number): {vehicle.vin}</p>
          <p>Rated Power: 3500W</p>
          <p>
            Warranty Period: {vehicle.warranty.start} - {vehicle.warranty.end}
          </p>
          <a href="#" className="text-red-400 underline">
            Extend Warranty
          </a>
          <br />
          <a href="#" className="text-red-400 underline">
            Warranty Policy
          </a>
        </div>
        <div className="text-center sm:ml-auto">
          <p className="text-lg font-semibold">{vehicle.plate}</p>
        </div>
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
