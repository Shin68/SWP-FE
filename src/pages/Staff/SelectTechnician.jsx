import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { PAGE_URLS } from "../../App/config";

export default function SelectTechnician() {
  const navigate = useNavigate();
  const { bookingId: appointmentId } = useParams();
  const [technicians, setTechnicians] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTechnicians = async () => {
      if (!token) {
        console.warn("⚠️ Missing token");
        setLoading(false);
        return;
      }

      try {
        console.log("📡 Fetching technicians...");
        const res = await axios.get(
          "http://localhost:8080/api/admin/users/role/TECHNICIAN",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTechnicians(res.data || []);
        console.log("✅ Technician list:", res.data);
      } catch (err) {
        console.error("❌ Error fetching technicians:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTechnicians();
  }, [token]);

  // ✅ Gửi API assign/reassign technician
  const handleAssignTechnician = async () => {
    if (!selected) return alert("Please select a technician first");

    try {
      setSubmitting(true);
      console.log(`🚀 Assigning technician ${selected} to appointment ${appointmentId}`);

      const url = `http://localhost:8080/api/staff/${appointmentId}/assign?technicianId=${selected}`;

      const res = await axios.put(url, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Assign success:", res.data);
      alert("Technician assigned (or updated) successfully!");
      navigate(PAGE_URLS.STAFF_DASHBOARD);
    } catch (err) {
      console.error("❌ Error assigning technician:", err);
      const message =
        err.response?.data?.message ||
        `Failed (status ${err.response?.status})`;
      alert(`❌ Failed to assign technician.\n${message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col items-center text-white p-6">
      <h1 className="text-2xl font-bold mb-4">
        Select Technician for Appointment #{appointmentId}
      </h1>

      {loading ? (
        <div className="text-gray-300 py-10">Loading technicians...</div>
      ) : (
        <div className="bg-white text-gray-900 rounded-lg shadow-md w-full max-w-3xl">
          {technicians.length > 0 ? (
            technicians.map((tech) => (
              <div
                key={tech.id}
                onClick={() => setSelected(tech.id)}
                className={`p-4 border-b cursor-pointer transition-colors ${selected === tech.id
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-100"
                  }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-lg">{tech.fullname}</p>
                    <p className="text-sm">{tech.email}</p>
                    <p className="text-xs text-gray-500">{tech.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">Role: TECHNICIAN</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              No available technicians at the moment.
            </div>
          )}
        </div>
      )}

      <div className="flex gap-4 mt-6">
        <button
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded"
          onClick={() => navigate(PAGE_URLS.STAFF_DASHBOARD)}
        >
          Cancel
        </button>
        <button
          className={`px-6 py-2 rounded text-white ${selected
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-gray-500 cursor-not-allowed"
            }`}
          onClick={handleAssignTechnician}
          disabled={!selected || submitting}
        >
          {submitting ? "Assigning..." : "Confirm Assignment"}
        </button>
      </div>
    </div>
  );
}
