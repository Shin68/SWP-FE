import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaHome, FaCog, FaArrowLeft, FaUser, FaCar, FaWrench, FaCalendar, FaEdit } from "react-icons/fa";

export default function TechnicianAppointmentDetail() {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    // Load appointment data from localStorage
    const storedBookings = localStorage.getItem('staffBookings');
    if (storedBookings) {
      const bookings = JSON.parse(storedBookings);
      const foundAppointment = bookings.find(b => b.id === parseInt(bookingId));
      setAppointment(foundAppointment);
    }
  }, [bookingId]);

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

  if (!appointment) {
    return (
      <div className="min-h-screen bg-gray-700 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Loading appointment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-700 text-white">
      {/* Header */}
      <header className="bg-gray-800 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/technician")}
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
                    navigate("/login");
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
                <button
                  onClick={() => navigate(`/technician/maintenance-report/${appointment.id}`)}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded mb-2"
                >
                  Create Maintenance Report
                </button>
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
                  <p className="text-sm text-gray-400">Assigned By</p>
                  <p className="font-medium">{appointment.assignedBy}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="bg-gray-800 rounded-lg p-6 mt-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Work Notes</h2>
              <button className="text-blue-400 hover:text-blue-300">
                <FaEdit size={16} />
              </button>
            </div>
            <textarea
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
              rows="4"
              placeholder="Add work notes here..."
            ></textarea>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => navigate(`/technician/maintenance-report/${appointment.id}`)}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded"
            >
              Create Maintenance Report
            </button>
            <button
              onClick={() => console.log("Update status", appointment.id)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
            >
              Update Status
            </button>
            <button
              onClick={() => navigate("/technician")}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded"
            >
              Back to Appointments
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}