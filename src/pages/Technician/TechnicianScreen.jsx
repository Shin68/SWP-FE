import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaCog, FaWrench } from "react-icons/fa";
import { technicianAccounts } from "../../utils/accountData";

export default function TechnicianScreen() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Mock logged-in technician (in real app, this would come from auth context)
  const currentTechnician = technicianAccounts[0]; // Robert Chen

  const appointments = [
    {
      id: 1,
      customerName: "Nguyen Van A",
      phone: "09315162819",
      vehicle: "VinFast VF 8",
      serviceType: "Maintenance, Oil Change",
      assignedBy: "Staff John",
      appointmentDate: "2025-10-24",
      appointmentTime: "09:00",
      status: "In Progress",
      priority: "High"
    },
    {
      id: 2,
      customerName: "Vo Van B",
      phone: "08376920164",
      vehicle: "VinFast VF 9",
      serviceType: "Battery Check",
      assignedBy: "Staff Sarah",
      appointmentDate: "2025-10-24",
      appointmentTime: "11:30",
      status: "Pending",
      priority: "Medium"
    },
    {
      id: 3,
      customerName: "Nguyen Le C",
      phone: "03682991423",
      vehicle: "VinFast VF e34",
      serviceType: "Tire Rotation",
      assignedBy: "Staff Mike",
      appointmentDate: "2025-10-24",
      appointmentTime: "14:00",
      status: "Completed",
      priority: "Low"
    },
    {
      id: 4,
      customerName: "Tran Thi D",
      phone: "09123456789",
      vehicle: "VinFast VF 5",
      serviceType: "Brake Inspection",
      assignedBy: "Staff John",
      appointmentDate: "2025-10-25",
      appointmentTime: "10:00",
      status: "Pending",
      priority: "High"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-yellow-100 text-yellow-800";
      case "Pending":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-100 text-green-800";
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
          <FaWrench size={24} />
          <div>
            <span className="font-bold text-lg">Technician Portal</span>
            <div className="text-xs text-gray-400">
              {currentTechnician.name} • {currentTechnician.level} • ⭐ {currentTechnician.rating}
            </div>
          </div>
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Assigned Appointments</h2>
          <div className="text-sm">
            <span className="bg-gray-600 px-3 py-1 rounded">
              Total: {appointments.length} appointments
            </span>
          </div>
        </div>

        {/* Appointments Table */}
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
                    Assigned By
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Date & Time
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
                {appointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-700">
                    <td className="px-4 py-3 text-sm">#{appointment.id}</td>
                    <td className="px-4 py-3 text-sm">
                      <div>
                        <div className="font-medium">{appointment.customerName}</div>
                        <div className="text-gray-400 text-xs">
                          <a href={`tel:${appointment.phone}`} className="hover:text-blue-400">
                            {appointment.phone}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{appointment.vehicle}</td>
                    <td className="px-4 py-3 text-sm">{appointment.serviceType}</td>
                    <td className="px-4 py-3 text-sm">{appointment.assignedBy}</td>
                    <td className="px-4 py-3 text-sm">
                      <div>
                        <div>{appointment.appointmentDate}</div>
                        <div className="text-gray-400 text-xs">{appointment.appointmentTime}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(appointment.priority)}`}>
                        {appointment.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <button
                          className="text-blue-400 hover:text-blue-300 text-xs"
                          onClick={() => console.log("View details", appointment.id)}
                        >
                          View
                        </button>
                        <button
                          className="text-green-400 hover:text-green-300 text-xs"
                          onClick={() => console.log("Update status", appointment.id)}
                        >
                          Update
                        </button>
                        <button
                          className="text-yellow-400 hover:text-yellow-300 text-xs"
                          onClick={() => console.log("Add notes", appointment.id)}
                        >
                          Notes
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate("/home")}
          className="mt-6 bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}