import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaHome, FaCog, FaArrowLeft, FaUser, FaCar, FaWrench, FaClock, FaPhone, FaCalendar } from "react-icons/fa";
import { PAGE_URLS } from "../../App/config";

export default function AppointmentDetail() {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const [menuOpen, setMenuOpen] = useState(false);

  // Mock appointment data - in real app, this would be fetched based on bookingId
  const appointment = {
    id: bookingId,
    customerName: "Nguyen Van A",
    phone: "09315162819",
    email: "nguyenvana@email.com",
    vehicle: "VinFast VF 8",
    vin: "VF8A123456789",
    licensePlate: "30A-12345",
    serviceType: "Maintenance, Oil Change",
    appointmentDate: "2025-10-24",
    appointmentTime: "09:00",
    status: "Under Maintenance",
    priority: "High",
    assigned: true,
    assignedTechnician: "Robert Chen",
    technicianPhone: "0987654321",
    estimatedDuration: "2 hours",
    estimatedCost: "2,500,000 VND",
    notes: "Customer requested premium oil filter. Vehicle has 45,000 km mileage.",
    createdDate: "2025-10-20",
    lastUpdated: "2025-10-24 08:30"
  };

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
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(PAGE_URLS.STAFF_BOOKING_LIST)}
            className="text-white hover:text-gray-300"
          >
            <FaArrowLeft size={20} />
          </button>
          <span className="font-bold text-lg">Appointment Details</span>
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
        <div className="max-w-4xl mx-auto">
          {/* Appointment Header */}
          <div className="bg-gray-800 rounded-lg p-6 mb-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold mb-2">Appointment #{appointment.id}</h1>
                <div className="flex gap-3">
                  <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                  <span className={`px-3 py-1 text-sm rounded-full ${getPriorityColor(appointment.priority)}`}>
                    {appointment.priority} Priority
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Created: {appointment.createdDate}</p>
                <p className="text-sm text-gray-400">Last Updated: {appointment.lastUpdated}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Customer Information */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <FaUser className="text-blue-400" />
                <h2 className="text-xl font-semibold">Customer Information</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400">Name</p>
                  <p className="font-medium">{appointment.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Phone</p>
                  <p className="font-medium">
                    <a href={`tel:${appointment.phone}`} className="text-blue-400 hover:text-blue-300">
                      {appointment.phone}
                    </a>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="font-medium">{appointment.email}</p>
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <FaCar className="text-green-400" />
                <h2 className="text-xl font-semibold">Vehicle Information</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400">Vehicle Model</p>
                  <p className="font-medium">{appointment.vehicle}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">VIN Number</p>
                  <p className="font-medium">{appointment.vin}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">License Plate</p>
                  <p className="font-medium">{appointment.licensePlate}</p>
                </div>
              </div>
            </div>

            {/* Service Information */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <FaWrench className="text-purple-400" />
                <h2 className="text-xl font-semibold">Service Information</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400">Service Type</p>
                  <p className="font-medium">{appointment.serviceType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Estimated Duration</p>
                  <p className="font-medium">{appointment.estimatedDuration}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Estimated Cost</p>
                  <p className="font-medium text-green-400">{appointment.estimatedCost}</p>
                </div>
              </div>
            </div>

            {/* Appointment Schedule */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <FaCalendar className="text-yellow-400" />
                <h2 className="text-xl font-semibold">Appointment Schedule</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400">Date</p>
                  <p className="font-medium">{appointment.appointmentDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Time</p>
                  <p className="font-medium">{appointment.appointmentTime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Assigned Technician</p>
                  <p className="font-medium">
                    {appointment.assigned ? (
                      <span className="text-green-400">
                        {appointment.assignedTechnician} 
                        <a href={`tel:${appointment.technicianPhone}`} className="ml-2 text-blue-400 hover:text-blue-300">
                          <FaPhone className="inline ml-1" size={12} />
                        </a>
                      </span>
                    ) : (
                      <span className="text-red-400">Not Assigned</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="bg-gray-800 rounded-lg p-6 mt-4">
            <h2 className="text-xl font-semibold mb-4">Notes & Instructions</h2>
            <p className="text-gray-300">{appointment.notes}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
              onClick={() => navigate(`${PAGE_URLS.SELECT_TECHNICIAN}/${appointment.id}`)}
            >
              {appointment.assigned ? "Reassign Technician" : "Assign Technician"}
            </button>
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
              onClick={() => console.log("Update status", appointment.id)}
            >
              Update Status
            </button>
            <button
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded"
              onClick={() => console.log("Send notification", appointment.id)}
            >
              Send Notification
            </button>
            <button
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded"
              onClick={() => navigate(PAGE_URLS.STAFF_BOOKING_LIST)}
            >
              Back to List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}