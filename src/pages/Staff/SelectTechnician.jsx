import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PAGE_URLS } from "../../App/config";

export default function SelectTechnician() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const technicians = [
    { id: 1, name: "Ho Van Rum", level: "Level 2/4 (Technician)", rating: 4.7, reviews: 78 },
    { id: 2, name: "Mai Que An", level: "Level 3/4 (Senior Technician)", rating: 4.9, reviews: 65 },
    { id: 3, name: "Nguyen Tran Trung Kien", level: "Level 4/4 (Expert)", rating: 5.0, reviews: 90 },
    { id: 4, name: "Tran Thanh Ha", level: "Level 1/4 (Apprentice)", rating: 4.5, reviews: 42 },
    { id: 5, name: "Ho Minh Chau", level: "Level 3/4 (Senior Technician)", rating: 4.8, reviews: 59 },
  ];

  return (
    <div className="min-h-screen bg-gray-700 flex flex-col items-center text-white p-4">
      <h1 className="text-2xl font-bold mb-4">Select Technician</h1>

      <div className="bg-white text-gray-900 rounded-lg shadow-md w-full max-w-md">
        {technicians.map((tech) => (
          <div
            key={tech.id}
            onClick={() => setSelected(tech.id)}
            className={`p-3 border-b cursor-pointer ${
              selected === tech.id ? "bg-red-500 text-white" : "hover:bg-gray-100"
            }`}
          >
            <p className="font-semibold">{tech.name}</p>
            <p className="text-sm">{tech.level}</p>
            <p className="text-sm">⭐ {tech.rating} — {tech.reviews} đánh giá</p>
          </div>
        ))}
      </div>

      <button
        className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded"
        onClick={() => navigate(PAGE_URLS.STAFF_BOOKING_LIST)}
      >
        Confirm
      </button>
    </div>
  );
}
