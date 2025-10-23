import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PAGE_URLS } from "../../App/config";
import { getAvailableTechnicians } from "../../utils/accountData";

export default function SelectTechnician() {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const [selected, setSelected] = useState(null);

  const technicians = getAvailableTechnicians();

  const handleConfirm = () => {
    if (selected) {
      const selectedTechnician = technicians.find(tech => tech.id === selected);
      console.log(`Assigned technician ${selectedTechnician.name} to booking ${bookingId}`);
      // In a real app, this would update the database
      navigate(PAGE_URLS.STAFF_BOOKING_LIST);
    } else {
      alert("Please select a technician first");
    }
  };

  return (
    <div className="min-h-screen bg-gray-700 flex flex-col items-center text-white p-4">
      <h1 className="text-2xl font-bold mb-4">Select Technician for Booking #{bookingId}</h1>

      <div className="bg-white text-gray-900 rounded-lg shadow-md w-full max-w-2xl">
        {technicians.length > 0 ? (
          technicians.map((tech) => (
            <div
              key={tech.id}
              onClick={() => setSelected(tech.id)}
              className={`p-4 border-b cursor-pointer transition-colors ${
                selected === tech.id ? "bg-blue-500 text-white" : "hover:bg-gray-100"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-lg">{tech.name}</p>
                  <p className="text-sm">{tech.level}</p>
                  <p className="text-sm text-gray-600">{tech.specialization}</p>
                  <p className="text-xs text-gray-500">{tech.experience} experience</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">⭐ {tech.rating}</p>
                  <p className="text-xs text-gray-500">{tech.reviews} reviews</p>
                  <p className="text-xs text-gray-500">{tech.currentAppointments} current jobs</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            No available technicians at the moment
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-6">
        <button
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded"
          onClick={() => navigate(PAGE_URLS.STAFF_BOOKING_LIST)}
        >
          Cancel
        </button>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded disabled:bg-gray-400"
          onClick={handleConfirm}
          disabled={!selected || technicians.length === 0}
        >
          Confirm Assignment
        </button>
      </div>
    </div>
  );
}
