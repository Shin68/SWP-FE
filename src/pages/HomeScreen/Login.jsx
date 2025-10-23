import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PAGE_URLS } from "../../App/config";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      // ✅ Gửi request tới Spring Boot BE
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        phone,
        password,
      });

      console.log("🔹 Login response:", res.data);


      const data = res.data;
      const token = data.token;
      const user = {
        id: data.id,
        fullname: data.fullname,
        phone: data.phone,
        email: data.email,
        role: data.role,
      };

      // ✅ Lưu vào localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setMessage("Login successful!");

      // ✅ Điều hướng theo role
      setTimeout(() => {
        switch (user.role) {
          case "ADMIN":
            navigate(PAGE_URLS.ADMIN_DASHBOARD);
            break;
          case "STAFF":
            navigate(PAGE_URLS.STAFF_BOOKING_LIST);
            break;
          case "TECHNICIAN":
            navigate(PAGE_URLS.STAFF_SELECT_TECHNICIAN);
            break;
          default:
            navigate(PAGE_URLS.HOME);
            break;
        }
      }, 500);

    } catch (err) {
      console.error("❌ Login error:", err);

      if (err.response) {
        if (err.response.status === 401) {
          setMessage("Sai số điện thoại hoặc mật khẩu!");
        } else if (err.response.status === 404) {
          setMessage("Không tìm thấy API /api/auth/login (404)");
        } else {
          setMessage("Lỗi server, vui lòng thử lại sau!");
        }
      } else {
        setMessage("Không kết nối được đến máy chủ!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-700 flex items-center justify-center text-white">
      {/* Logo */}
      <img
        src="/img/logo.jpg"
        alt="Company Logo"
        className="absolute top-5 left-6 w-16 h-16 object-cover rounded-lg border border-gray-300 shadow-md bg-white"
      />

      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 rounded bg-gray-600 text-white border border-gray-500 focus:outline-none focus:border-blue-500"
              placeholder="Enter your phone number"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded bg-gray-600 text-white border border-gray-500 focus:outline-none focus:border-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Login
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center text-sm ${message.includes("successful")
                ? "text-green-400"
                : "text-red-400"
              }`}
          >
            {message}
          </p>
        )}

        {/* Register */}
        <div className="text-center mt-6">
          <p className="text-gray-300">
            Don’t have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-blue-400 hover:text-blue-500 font-semibold"
            >
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
