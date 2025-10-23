// src/pages/Admin/AdminParts.jsx
import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import axios from "../../api/axios";

export default function AdminParts() {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/parts");
      setParts(res.data || []);
    } catch (e) {
      console.error(e);
      alert("Failed to load parts");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div>
        <h2 className="text-xl font-bold mb-4">Parts</h2>
        {loading ? <div>Loading...</div> : (
          <table className="w-full bg-white rounded">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">#</th>
                <th className="p-2">Part Name</th>
                <th className="p-2">Part ID</th>
                <th className="p-2">Stock</th>
                <th className="p-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {parts.map((p, i) => (
                <tr key={p.id} className="border-b">
                  <td className="p-2">{i+1}</td>
                  <td className="p-2">{p.name}</td>
                  <td className="p-2">{p.id}</td>
                  <td className="p-2">{p.stock}</td>
                  <td className="p-2">{p.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
