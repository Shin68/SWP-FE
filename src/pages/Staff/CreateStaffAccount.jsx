import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PAGE_URLS } from "../../App/config";

export default function CreateStaffAccount() {
  const navigate = useNavigate();
  const [newStaff, setNewStaff] = useState(null);

  const autoCreateStaff = () => {
    const names = ["John Doe", "Jane Smith", "Bob Johnson", "Alice Brown", "Charlie Wilson"];
    const levels = ["Level 1/4 (Apprentice)", "Level 2/4 (Technician)", "Level 3/4 (Senior Technician)", "Level 4/4 (Expert)"];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomLevel = levels[Math.floor(Math.random() * levels.length)];
    const randomRating = (4 + Math.random()).toFixed(1);
    const randomReviews = Math.floor(Math.random() * 100) + 10;

    setNewStaff({
      id: Date.now(),
      name: randomName,
      level: randomLevel,
      rating: parseFloat(randomRating),
      reviews: randomReviews,
    });
  };

  return (
    <div className="min-h-screen bg-gray-700 flex flex-col items-center text-white p-4">
      <h1 className="text-2xl font-bold mb-4">Create Staff Account</h1>

      <button
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded mb-4"
        onClick={autoCreateStaff}
      >
        Auto Create Staff Account
      </button>

      {newStaff && (
        <div className="bg-white text-gray-900 rounded-lg shadow-md p-4 w-full max-w-md">
          <h2 className="text-lg font-semibold mb-2">New Staff Created:</h2>
          <p><strong>Name:</strong> {newStaff.name}</p>
          <p><strong>Level:</strong> {newStaff.level}</p>
          <p><strong>Rating:</strong> ⭐ {newStaff.rating} — {newStaff.reviews} reviews</p>
          <p className="text-sm text-gray-600 mt-2">Note: This is a mock creation. In a real app, this would save to a database.</p>
        </div>
      )}

      <button
        className="mt-4 bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded"
        onClick={() => navigate(PAGE_URLS.STAFF_BOOKING_LIST)}
      >
        Back to Booking List
      </button>
    </div>
  );
}