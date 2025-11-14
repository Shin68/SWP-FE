// src/pages/Staff/StaffDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaList, FaSignOutAlt, FaUserCog, FaSpinner } from "react-icons/fa";
import axios from "axios";
import { PAGE_URLS, API_BASE_URL } from "../../App/config";

export default function StaffDashboard() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const storedUser = localStorage.getItem("user");
  const staffUser = storedUser ? JSON.parse(storedUser) : null;
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!staffUser || !staffUser.id || !token) {
      navigate(PAGE_URLS.LOGIN);
    }
  }, [navigate, staffUser, token]);

  // Fetch appointments
  useEffect(() => {
    if (!token) return;

    const source = axios.CancelToken.source();
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/staff/appointments`, {
          headers: { Authorization: `Bearer ${token}` },
          cancelToken: source.token,
        });

        const list = Array.isArray(res.data) ? res.data : [];
        const enriched = [];

        for (const item of list) {
          const {
            appointmentId, customerId, vehicleId, serviceCenterId,
            status, appointmentDate, appointmentTime, technicianAssigned
          } = item;

          // Skip appointments that are PAID or COMPLETED
          if (status === 'PAID' || status === 'COMPLETED') {
            continue;
          }

          let customerName = "---", customerPhone = "---";
          let vehicleName = "---", branchName = "---";

          try {
            const cusRes = await axios.get(`${API_BASE_URL}/auth/profile/${customerId}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            customerName = cusRes.data.fullname || "---";
            customerPhone = cusRes.data.phone || "---";
          } catch { }

          try {
            const vehRes = await axios.get(`${API_BASE_URL}/customer/vehicle/details/${vehicleId}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            const v = vehRes.data;
            vehicleName = `${v.brand || ""} ${v.model || ""}`.trim() || "---";
          } catch { }

          try {
            const cenRes = await axios.get(`${API_BASE_URL}/admin/service-centers/${serviceCenterId}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            branchName = cenRes.data.name || "---";
          } catch { }

          enriched.push({
            appointmentId, customerName, customerPhone, vehicleName,
            branchName, status, appointmentDate, appointmentTime, technicianAssigned
          });
        }

        setAppointments(enriched);
      } catch (err) {
        if (!axios.isCancel(err)) console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
    return () => source.cancel();
  }, [token]);

  const handleAssign = (id) => {
    navigate(`${PAGE_URLS.SELECT_TECHNICIAN}/${id}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate(PAGE_URLS.LOGIN);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAppointments = appointments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(appointments.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white fixed top-0 left-0 bottom-0 flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <div className="text-xl font-bold">Staff Portal</div>
        </div>

        <nav className="flex-1 p-2">
          <button
            onClick={() => navigate(PAGE_URLS.STAFF_DASHBOARD)}
            className="w-full text-left px-3 py-3 rounded flex items-center gap-3 bg-gray-800 text-white"
          >
            <FaList /> <span>Appointment List</span>
          </button>

          <button
            onClick={() => navigate(PAGE_URLS.STAFF_PROFILE)}
            className="w-full text-left px-3 py-3 rounded flex items-center gap-3 mt-2 hover:bg-gray-800 text-gray-300"
          >
            <FaUserCog /> <span>My Profile</span>
          </button>

          <div className="mt-6 border-t border-gray-800 pt-4">
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-3 rounded flex items-center gap-3 hover:bg-red-800 text-red-300"
            >
              <FaSignOutAlt /> <span>Logout</span>
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-800 text-xs text-gray-400">
          <div>Logged in as</div>
          <div className="mt-1 font-medium">{staffUser?.fullname || "Staff"}</div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-64 p-6">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Appointment Management</h1>
          <div className="text-sm text-gray-600">
            Total: {appointments.length} | Page {currentPage} / {totalPages || 1}
          </div>
        </header>

        <div className="bg-white shadow rounded overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs text-gray-600 uppercase">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Branch</th>
                <th className="px-4 py-3">Date & Time</th>
                <th className="px-4 py-3">Technician</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" className="text-center py-6"><FaSpinner className="animate-spin inline" /> Loading...</td></tr>
              ) : currentAppointments.length === 0 ? (
                <tr><td colSpan="8" className="text-center py-6 text-gray-500">No appointments found.</td></tr>
              ) : (
                currentAppointments.map((a, idx) => (
                  <tr key={a.appointmentId} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">#{indexOfFirstItem + idx + 1}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{a.customerName}</div>
                      <div className="text-xs text-gray-500">{a.customerPhone}</div>
                    </td>
                    <td className="px-4 py-3">{a.vehicleName}</td>
                    <td className="px-4 py-3">{a.branchName}</td>
                    <td className="px-4 py-3">
                      <div>{a.appointmentDate}</div>
                      <div className="text-xs text-gray-500">{a.appointmentTime}</div>
                    </td>
                    <td className="px-4 py-3">{a.technicianAssigned || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs ${a.status === "IN_PROGRESS" ? "bg-yellow-100 text-yellow-800" :
                          a.status === "PENDING" ? "bg-blue-100 text-blue-800" :
                            a.status === "ASSIGNED" ? "bg-green-100 text-green-800" :
                              "bg-gray-100 text-gray-800"
                        }`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleAssign(a.appointmentId)}
                        className="px-2 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700"
                      >
                        Assign
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 gap-2">
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}
                className="px-3 py-1 border rounded hover:bg-gray-200 disabled:opacity-50">
                Prev
              </button>
              <span className="px-3 py-1">{currentPage} / {totalPages}</span>
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded hover:bg-gray-200 disabled:opacity-50">
                Next
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}