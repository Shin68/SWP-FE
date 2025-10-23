// src/pages/Admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import api from "../../api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/admin/dashboard/stats");
        setStats(res.data);
      } catch (e) {
        console.error(e);
        setErr("Unauthorized or server error");
      }
    })();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {err && <div className="text-red-500 mb-4">{err}</div>}
      {!stats ? (
        <div>Loading...</div>
      ) : (
        <pre>{JSON.stringify(stats, null, 2)}</pre>
      )}
    </AdminLayout>
  );
}
