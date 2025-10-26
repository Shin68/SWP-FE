import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaCog, FaWrench } from "react-icons/fa";
import { technicianAccounts } from "../../utils/accountData";

export default function TechnicianScreen() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  
  // Get logged-in technician from localStorage or fallback to first technician
  const [currentTechnician, setCurrentTechnician] = useState(null);
  
  useEffect(() => {
    const userData = localStorage.getItem('loggedInUser');
    if (userData) {
      const user = JSON.parse(userData);
      if (user.role === 'Technician') {
        const fullTechnicianData = technicianAccounts.find(tech => tech.phone === user.phone);
        setCurrentTechnician(fullTechnicianData || technicianAccounts[0]);
      } else {
        setCurrentTechnician(technicianAccounts[0]); // Fallback for testing
      }
    } else {
      setCurrentTechnician(technicianAccounts[0]); // Fallback for testing
    }
  }, []);

  // Load appointments from localStorage
  useEffect(() => {
    if (!currentTechnician) return;
    
    const loadAppointments = () => {
      const storedBookings = localStorage.getItem('staffBookings');
      if (storedBookings) {
        const bookings = JSON.parse(storedBookings);
        console.log('All bookings:', bookings);
        console.log('Current technician:', currentTechnician.name);
        
        // Filter appointments assigned to current technician
        const technicianAppointments = bookings
          .filter(booking => booking.assignedTechnician === currentTechnician.name)
          .map(booking => ({
            ...booking,
            assignedBy: "Staff" // Generic assignment since we don't track who assigned
          }));
        
        console.log('Filtered appointments for technician:', technicianAppointments);
        
        // If no appointments found for this technician, show all for testing
        if (technicianAppointments.length === 0) {
          console.log('No appointments found for this technician, showing all assigned bookings');
          const allAssignedBookings = bookings
            .filter(booking => booking.assigned && booking.assignedTechnician !== "Not Assigned")
            .map(booking => ({
              ...booking,
              assignedBy: "Staff"
            }));
          setAppointments(allAssignedBookings);
        } else {
          setAppointments(technicianAppointments);
        }
      } else {
        console.log('No bookings found in localStorage');
      }
    };

    loadAppointments();
    
    // Listen for storage changes
    const handleStorageChange = () => {
      loadAppointments();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleStorageChange);
    };
  }, [currentTechnician]);

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
              {currentTechnician ? 
                `${currentTechnician.name} • ${currentTechnician.level} • ⭐ ${currentTechnician.rating}` : 
                'Loading technician information...'
              }
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
        {!currentTechnician ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-gray-400">Loading technician information...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Assigned Appointments</h2>
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                >
                  Refresh
                </button>
                <div className="text-sm">
                  <span className="bg-gray-600 px-3 py-1 rounded">
                    Total: {appointments.length} appointments
                  </span>
                </div>
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
                          onClick={() => navigate(`/technician/appointment/${appointment.id}`)}
                        >
                          View
                        </button>
                        <button
                          className="text-orange-400 hover:text-orange-300 text-xs"
                          onClick={() => navigate(`/technician/maintenance-report/${appointment.id}`)}
                        >
                          Maintenance Report
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {appointments.length === 0 && (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-400 text-lg">No appointments assigned to you</p>
            <p className="text-gray-500 text-sm mt-2">
              {currentTechnician ? 
                `Currently logged in as: ${currentTechnician.name}` : 
                'Loading technician information...'
              }
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
            >
              Refresh Data
            </button>
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
}