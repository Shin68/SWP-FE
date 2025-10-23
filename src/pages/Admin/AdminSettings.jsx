// src/pages/Admin/AdminSettings.jsx
import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import axios from "../../api/axios";

export default function AdminSettings() {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");

  const handleChange = async () => {
    if (newPass !== confirm) { setMsg("New password and confirm not match"); return; }
    try {
      // Swagger shows endpoints: POST /api/auth/reset-password or /api/auth/change?
      // According to earlier list, there's PATCH or POST endpoints; we assume:
      await api.post("/auth/reset-password", {
        oldPassword: oldPass,
        newPassword: newPass,
      });
      setMsg("Password changed");
    } catch (e) {
      console.error(e);
      setMsg("Change failed");
    }
  };

  return (
    <AdminLayout>
      <div>
        <h2 className="text-xl font-bold mb-4">Settings</h2>
        <div className="max-w-md bg-white p-4 rounded">
          <label className="block mb-2">Old password</label>
          <input className="w-full p-2 mb-3 border" type="password" value={oldPass} onChange={(e) => setOldPass(e.target.value)} />
          <label className="block mb-2">New password</label>
          <input className="w-full p-2 mb-3 border" type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} />
          <label className="block mb-2">Confirm password</label>
          <input className="w-full p-2 mb-3 border" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          <div className="flex gap-2">
            <button onClick={handleChange} className="bg-blue-600 px-3 py-1 text-white rounded">Change</button>
          </div>
          {msg && <div className="mt-2 text-sm">{msg}</div>}
        </div>
      </div>
    </AdminLayout>
  );
}
