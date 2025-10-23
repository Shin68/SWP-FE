import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaCog, FaUsers } from "react-icons/fa";
import { PAGE_URLS } from "../../App/config";

export default function StaffBookingList() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  
  // Initialize bookings data
  useEffect(() => {
    const storedBookings = localStorage.getItem('staffBookings');
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    } else {
      // Initialize with default data if not exists
      const defaultBookings = [
        {
          id: 1,
          customerName: "Nguyen Van A",
          phone: "09315162819",
          vehicle: "VinFast VF 8",
          serviceType: "Maintenance, Oil Change",
          appointmentDate: "2025-10-24",
          appointmentTime: "09:00",
          status: "Under Maintenance",
          assigned: true,
          assignedTechnician: "Robert Chen",
          priority: "High"
        },
        {
          id: 2,
          customerName: "Vo Van B",
          phone: "08376920164",
          vehicle: "VinFast VF 9",
          serviceType: "Battery Check",
          appointmentDate: "2025-10-24",
          appointmentTime: "11:30",
          status: "In Progress",
          assigned: true,
          assignedTechnician: "Lisa Anderson",
          priority: "Medium"
        },
        {
          id: 3,
          customerName: "Nguyen Le C",
          phone: "03682991423",
          vehicle: "VinFast VF e34",
          serviceType: "Tire Rotation",
          appointmentDate: "2025-10-24",
          appointmentTime: "14:00",
          status: "Booked",
          assigned: false,
          assignedTechnician: "Not Assigned",
          priority: "Low"
        },
        {
          id: 4,
          customerName: "Tran Thi D",
          phone: "09123456789",
          vehicle: "VinFast VF 5",
          serviceType: "Brake Inspection",
          appointmentDate: "2025-10-25",
          appointmentTime: "10:00",
          status: "Pending",
          assigned: false,
          assignedTechnician: "Not Assigned",
          priority: "High"
        },
        {
          id: 5,
          customerName: "Le Van E",
          phone: "0987654321",
          vehicle: "VinFast VF 8 Plus",
          serviceType: "Software Update",
          appointmentDate: "2025-10-25",
          appointmentTime: "15:30",
          status: "Confirmed",
          assigned: true,
          assignedTechnician: "Thomas Brown",
          priority: "Medium"
        }
      ];
      localStorage.setItem('staffBookings', JSON.stringify(defaultBookings));
      setBookings(defaultBookings);
    }
  }, []);

  // Refresh bookings data when component mounts or when navigating back
  useEffect(() => {
    const handleStorageChange = () => {
      const storedBookings = localStorage.getItem('staffBookings');
      if (storedBookings) {
        setBookings(JSON.parse(storedBookings));
      }
    };

    // Listen for storage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Also check for changes when component gets focus
    const handleFocus = () => {
      const storedBookings = localStorage.getItem('staffBookings');
      if (storedBookings) {
        setBookings(JSON.parse(storedBookings));
      }
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-yellow-100 text-yellow-800";
      case "Pending":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Under Maintenance":
        return "bg-orange-100 text-orange-800";
      case "Booked":
        return "bg-purple-100 text-purple-800";
      case "Confirmed":
        return "bg-teal-100 text-teal-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-orange-100 text-orange-800";
      case "Low":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-700 text-white">
      {/* Header */}
      <header className="bg-gray-800 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FaUsers size={24} />
          <span className="font-bold text-lg">Staff Portal</span>
        </div>

        <div className="flex gap-4 items-center relative">
          <button
            onClick={() => navigate("/home")}
            className="text-white hover:text-gray-300"
          >
            <FaHome size={20} />
          </button>

          <span>🔔</span>

          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white hover:text-gray-300"
            >
              <FaCog size={20} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white text-black rounded shadow-lg z-50">
                <button
                  onClick={() => {
                    navigate("/profile-view");
                    setMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                >
                  View Profile
                </button>
                <button
                  onClick={() => {
                    navigate("/");
                    setMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-red-600 font-bold hover:bg-red-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Appointment Management</h2>
          <div className="flex gap-2 text-sm">
            <span className="bg-gray-600 px-3 py-1 rounded">
              Total: {bookings.length}
            </span>
            <span className="bg-green-600 px-3 py-1 rounded">
              Assigned: {bookings.filter(b => b.assigned).length}
            </span>
            <span className="bg-red-600 px-3 py-1 rounded">
              Unassigned: {bookings.filter(b => !b.assigned).length}
            </span>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Technician
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-700">
                    <td className="px-4 py-3 text-sm">#{booking.id}</td>
                    <td className="px-4 py-3 text-sm">
                      <div>
                        <div className="font-medium">{booking.customerName}</div>
                        <div className="text-gray-400 text-xs">
                          <a href={`tel:${booking.phone}`} className="hover:text-blue-400">
                            {booking.phone}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{booking.vehicle}</td>
                    <td className="px-4 py-3 text-sm">{booking.serviceType}</td>
                    <td className="px-4 py-3 text-sm">
                      <div>
                        <div>{booking.appointmentDate}</div>
                        <div className="text-gray-400 text-xs">{booking.appointmentTime}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`text-xs ${booking.assigned ? 'text-green-400' : 'text-red-400'}`}>
                        {booking.assignedTechnician}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(booking.priority)}`}>
                        {booking.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <button
                          className="text-blue-400 hover:text-blue-300 text-xs"
                          onClick={() => navigate(`/staff/appointment/${booking.id}`)}
                        >
                          View Detail
                        </button>
                        <button
                          className="text-purple-400 hover:text-purple-300 text-xs"
                          onClick={() => navigate(`${PAGE_URLS.SELECT_TECHNICIAN}/${booking.id}`)}
                        >
                          {booking.assigned ? "Reassign" : "Assign Technician"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        
      </div>
    </div>
  );
}