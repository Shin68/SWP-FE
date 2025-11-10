import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaList, FaSignOutAlt, FaUserCog, FaSpinner } from "react-icons/fa";
import axios from "axios";
import { PAGE_URLS, API_BASE_URL } from "../../App/config";

export default function StaffDashboard() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [staffProfile, setStaffProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [activeTab, setActiveTab] = useState("list");
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Items per page

  // ✅ Lấy user + token từ localStorage
  const storedUser = localStorage.getItem("user");
  const staffUser = storedUser ? JSON.parse(storedUser) : null;
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!staffUser || !staffUser.id || !token) {
      console.warn("⚠️ Missing staff info or token — redirecting to login");
      navigate(PAGE_URLS.LOGIN);
      return;
    }
  }, [navigate, staffUser, token]);

  // ✅ Fetch danh sách lịch hẹn
  useEffect(() => {
    if (activeTab !== "list" || !token) return;

    const source = axios.CancelToken.source();
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        console.log("📡 Fetching appointments...");
        const res = await axios.get(`${API_BASE_URL}/staff/appointments`, {
          headers: { Authorization: `Bearer ${token}` },
          cancelToken: source.token,
        });

        console.log("✅ Appointments response:", res.data);
        const list = Array.isArray(res.data) ? res.data : [];
        const enriched = [];

        for (const item of list) {
          const {
            appointmentId,
            customerId,
            vehicleId,
            serviceCenterId,
            status,
            appointmentDate,
            appointmentTime,
            technicianAssigned,
          } = item;

          let customerName = "---";
          let customerPhone = "---";
          let vehicleName = "---";
          let branchName = "---";

          try {
            const cusRes = await axios.get(
              `${API_BASE_URL}/auth/profile/${customerId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const profile = cusRes.data || {};
            customerName = profile.fullname || "---";
            customerPhone = profile.phone || "---";
          } catch {
            console.warn(`❌ Customer ${customerId} not found`);
          }

          try {
            const vehRes = await axios.get(
              `${API_BASE_URL}/customer/vehicle/details/${vehicleId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const v = vehRes.data || {};
            vehicleName = `${v.brand || ""} ${v.model || ""}`.trim() || "---";
          } catch {
            console.warn(`❌ Vehicle ${vehicleId} not found`);
          }

          try {
            const cenRes = await axios.get(
              `${API_BASE_URL}/admin/service-centers/${serviceCenterId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const c = cenRes.data || {};
            branchName = c.name || "---";
          } catch {
            console.warn(`❌ Service center ${serviceCenterId} not found`);
          }

          enriched.push({
            appointmentId,
            customerName,
            customerPhone,
            vehicleName,
            branchName,
            status,
            appointmentDate,
            appointmentTime,
            technicianAssigned,
          });
        }

        setAppointments(enriched);
        setCurrentPage(1); // Reset to first page when data changes
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("🔄 Request canceled:", err.message);
        } else {
          console.error("❌ Error fetching appointments:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
    return () => source.cancel("Component unmounted");
  }, [activeTab, token, refreshKey]);

  // ✅ Fetch profile staff khi mở tab Settings
  useEffect(() => {
    if (activeTab !== "settings" || !staffUser?.id || !token) return;

    const fetchProfile = async () => {
      setLoadingProfile(true);
      try {
        console.log("📡 Fetching staff profile...");
        const res = await axios.get(
          `${API_BASE_URL}/auth/profile/${staffUser.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("✅ Staff profile:", res.data);
        setStaffProfile(res.data);
      } catch (err) {
        console.error("❌ Error fetching staff profile:", err);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [activeTab, staffUser?.id, token]);

  const handleAssign = (id) => {
    console.log("➡️ Navigate to assign technician for", id);
    navigate(`${PAGE_URLS.SELECT_TECHNICIAN}/${id}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate(PAGE_URLS.LOGIN);
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAppointments = appointments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(appointments.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t">
        <div className="flex items-center text-sm text-gray-600">
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, appointments.length)} of {appointments.length} entries
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-100 border'
            }`}
          >
            Previous
          </button>
          
          {startPage > 1 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className="px-3 py-1 rounded bg-white text-gray-700 hover:bg-gray-100 border"
              >
                1
              </button>
              {startPage > 2 && <span className="px-2">...</span>}
            </>
          )}

          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => handlePageChange(number)}
              className={`px-3 py-1 rounded ${
                currentPage === number
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border'
              }`}
            >
              {number}
            </button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="px-2">...</span>}
              <button
                onClick={() => handlePageChange(totalPages)}
                className="px-3 py-1 rounded bg-white text-gray-700 hover:bg-gray-100 border"
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-100 border'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    );
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
            onClick={() => setActiveTab("list")}
            className={`w-full text-left px-3 py-3 rounded flex items-center gap-3 ${activeTab === "list" ? "bg-gray-800 text-white" : "hover:bg-gray-800 text-gray-300"
              }`}
          >
            <FaList /> <span>Appointment List</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full text-left px-3 py-3 rounded flex items-center gap-3 mt-2 ${activeTab === "settings" ? "bg-gray-800 text-white" : "hover:bg-gray-800 text-gray-300"
              }`}
          >
            <FaUserCog /> <span>Settings</span>
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

      {/* Main Area */}
      <main className="flex-1 ml-64 p-6">
        {activeTab === "list" ? (
          <>
            <header className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-semibold text-gray-800">
                Appointment Management
              </h1>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  Total: {appointments.length} appointments
                </div>
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages || 1}
                </div>
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
                    <tr>
                      <td colSpan="8" className="px-4 py-6 text-center">
                        <div className="inline-flex items-center gap-2">
                          <FaSpinner className="animate-spin" /> Loading...
                        </div>
                      </td>
                    </tr>
                  ) : appointments.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-4 py-6 text-center text-gray-500">
                        No appointments found.
                      </td>
                    </tr>
                  ) : (
                    currentAppointments.map((a, idx) => (
                      <tr key={a.appointmentId} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3 align-top">#{indexOfFirstItem + idx + 1}</td>
                        <td className="px-4 py-3 align-top">
                          <div className="font-medium">{a.customerName}</div>
                          <div className="text-xs text-gray-500">{a.customerPhone}</div>
                        </td>
                        <td className="px-4 py-3 align-top">{a.vehicleName}</td>
                        <td className="px-4 py-3 align-top">{a.branchName}</td>
                        <td className="px-4 py-3 align-top">
                          <div>{a.appointmentDate}</div>
                          <div className="text-xs text-gray-500">{a.appointmentTime}</div>
                        </td>
                        <td className="px-4 py-3 align-top">
                          {a.technicianAssigned && a.technicianAssigned !== "None"
                            ? a.technicianAssigned
                            : "—"}
                        </td>
                        <td className="px-4 py-3 align-top">
                          <span
                            className={`px-2 py-1 rounded text-xs ${a.status === "IN_PROGRESS"
                                ? "bg-yellow-100 text-yellow-800"
                                : a.status === "PENDING"
                                  ? "bg-blue-100 text-blue-800"
                                  : a.status === "ASSIGNED"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                              }`}
                          >
                            {a.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 align-top">
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
              {renderPagination()}
            </div>
          </>
        ) : (
          <div className="bg-white shadow rounded p-6">
            <h2 className="text-xl font-semibold mb-4">Staff Settings</h2>
            {staffProfile ? (
              <div className="space-y-3 text-gray-700">
                <p><strong>Name:</strong> {staffProfile.fullname}</p>
                <p><strong>Email:</strong> {staffProfile.email}</p>
                <p><strong>Phone:</strong> {staffProfile.phone}</p>
                <p><strong>Role:</strong> {staffProfile.role}</p>
                <p><strong>Address:</strong> {staffProfile.address || "—"}</p>
                <p><strong>DOB:</strong> {staffProfile.dob || "—"}</p>
              </div>
            ) : (
              <p className="text-gray-500">No profile data available.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
