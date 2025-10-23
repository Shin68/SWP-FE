// src/pages/Admin/AdminUsers.jsx
import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import axios from "../../api/axios";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ fullname: "", phone: "", email: "", role: "CUSTOMER", password: "" });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data || []);
    } catch (e) {
      console.error(e);
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      // For creating staff/admin use endpoint POST /api/admin/users (swagger)
      await api.post("/admin/users", form);
      setShowAdd(false);
      loadUsers();
    } catch (e) {
      console.error(e);
      alert("Failed to add user");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete user?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      loadUsers();
    } catch (e) {
      console.error(e);
      alert("Fail delete");
    }
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Users & Staff</h2>
          <div>
            <button onClick={() => { setForm({ fullname: "", phone: "", email: "", role: "STAFF", password: "" }); setShowAdd(true); }} className="bg-blue-600 px-3 py-1 rounded">Add Staff</button>
          </div>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="w-full bg-white text-left rounded">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">#</th>
                <th className="p-2">Name</th>
                <th className="p-2">Phone</th>
                <th className="p-2">Email</th>
                <th className="p-2">Role</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.id} className="border-b">
                  <td className="p-2">{i + 1}</td>
                  <td className="p-2">{u.fullname || u.name}</td>
                  <td className="p-2">{u.phone}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">{u.role}</td>
                  <td className="p-2">
                    <button onClick={() => window.alert(JSON.stringify(u, null, 2))} className="mr-2 text-sm">View</button>
                    <button onClick={() => handleDelete(u.id)} className="text-sm text-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Add Modal */}
        {showAdd && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded w-96">
              <h3 className="font-bold mb-3">Add Staff / User</h3>
              <input className="w-full p-2 mb-2 border" placeholder="Full name" value={form.fullname} onChange={(e) => setForm({ ...form, fullname: e.target.value })} />
              <input className="w-full p-2 mb-2 border" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <input className="w-full p-2 mb-2 border" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <select className="w-full p-2 mb-2 border" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="STAFF">STAFF</option>
                <option value="TECHNICIAN">TECHNICIAN</option>
                <option value="ADMIN">ADMIN</option>
                <option value="CUSTOMER">CUSTOMER</option>
              </select>
              <input className="w-full p-2 mb-2 border" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowAdd(false)} className="px-3 py-1 border">Cancel</button>
                <button onClick={handleAdd} className="px-3 py-1 bg-blue-600 text-white">Create</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
