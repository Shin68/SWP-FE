// src/pages/Admin/AdminAppointments.jsx
import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import axios from "../../api/axios";

export default function AdminAppointments() {
  const [appts, setAppts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/appointments");
      setAppts(res.data || []);
    } catch (e) {
      console.error(e);
      alert("Fail load");
    } finally { setLoading(false); }
  };

  return (
    <AdminLayout>
      <div className="flex gap-6">
        <div className="w-2/3">
          <h2 className="text-xl font-bold mb-4">Appointments</h2>
          {loading ? <div>Loading...</div> : (
            <table className="w-full bg-white rounded">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2">#</th>
                  <th className="p-2">Customer</th>
                  <th className="p-2">Vehicle</th>
                  <th className="p-2">Service</th>
                  <th className="p-2">Time</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {appts.map((a, i) => (
                  <tr key={a.id} className="border-b cursor-pointer" onClick={() => setSelected(a)}>
                    <td className="p-2">{i+1}</td>
                    <td className="p-2">{a.customerName || a.customer?.fullname}</td>
                    <td className="p-2">{a.vehicleName || a.vehicle?.name}</td>
                    <td className="p-2">{a.serviceName || a.service?.name}</td>
                    <td className="p-2">{a.time || a.appointmentTime}</td>
                    <td className="p-2">{a.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* detail */}
        <div className="w-1/3 bg-white p-4 rounded">
          <h3 className="font-bold mb-2">Detail</h3>
          {!selected ? <div>Select an appointment</div> : (
            <div>
              <p><strong>Customer:</strong> {selected.customerName || selected.customer?.fullname}</p>
              <p><strong>Phone:</strong> {selected.customer?.phone}</p>
              <p><strong>Vehicle:</strong> {selected.vehicleName || selected.vehicle?.name}</p>
              <p><strong>Service(s):</strong> {(selected.services || selected.serviceName || []).toString()}</p>
              <p><strong>Status:</strong> {selected.status}</p>
              <p><strong>Time:</strong> {selected.time || selected.appointmentTime}</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
