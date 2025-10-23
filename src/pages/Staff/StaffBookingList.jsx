
import { useNavigate } from "react-router-dom";
import { PAGE_URLS } from "../../App/config";

export default function StaffBookingList() {
  const navigate = useNavigate();
  const bookings = [
    {
      id: 1,
      name: "Nguyen Van A",
      phone: "09315162819",
      time: "30/09/2025 - 14:00",
      status: "Under Maintenance",
      assigned: true,
    },
    {
      id: 2,
      name: "Vo Van B",
      phone: "08376920164",
      time: "04/10/2025 - 9:00",
      status: "In Progress",
      assigned: false,
    },
    {
      id: 3,
      name: "Nguyen Le C",
      phone: "03682991423",
      time: "05/10/2025 - 14:00",
      status: "Booked",
      assigned: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-200 p-6">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">Appointment List</h1>
      <button
        className="mb-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        onClick={() => navigate(PAGE_URLS.CREATE_STAFF_ACCOUNT)}
      >
        Create Staff Account
      </button>

      <div className="bg-white shadow-md rounded-lg p-4 space-y-4">
        {bookings.map((b) => (
          <div key={b.id} className="border-b pb-4">
            <p><strong>Vehicle Owner:</strong> {b.name} - phone: <a href={`tel:${b.phone}`} className="text-blue-600">{b.phone}</a></p>
            <p><strong>Time:</strong> {b.time}</p>
            <p><strong>Status:</strong> {b.status}</p>

            <div className="flex flex-wrap gap-2 mt-2">
              <button className="text-green-600 hover:underline">Update Status</button>
              <button
                className="text-blue-600 hover:underline"
                onClick={() => navigate(`${PAGE_URLS.SELECT_TECHNICIAN}/${b.id}`)}
              >
                {b.assigned ? "Selected" : "Select Technician"}
              </button>
              <button className="text-gray-600 hover:underline">View Details</button>
              <button className="text-red-600 hover:underline">Send Notification</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
