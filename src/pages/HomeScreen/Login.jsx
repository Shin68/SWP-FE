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
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        phone,
        password,
      });

      const { token, id, fullname, phone: uPhone, email, role } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify({ id, fullname, phone: uPhone, email, role })
      );

      setTimeout(() => {
        switch (role) {
          case "ADMIN":
            navigate(PAGE_URLS.ADMIN_DASHBOARD);
            break;
          case "STAFF":
            navigate(PAGE_URLS.STAFF_BOOKING_LIST);
            break;
          case "TECHNICIAN":
            navigate(PAGE_URLS.TECHNICIAN_SCREEN);
            break;
          default:
            navigate(PAGE_URLS.HOME);
            break;
        }
      }, 500);
    } catch (err) {
      if (err.response?.status === 401) {
        setMessage("Invalid phone number or password");
      } else if (err.response?.status === 404) {
        setMessage("Inccorrect phone number or password");
      } else {
        setMessage("Server error. Please try again later.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-xl w-full max-w-md shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-8">Sign In</h2>

        <form onSubmit={handleSubmit}>
          <label className="block mb-3 text-sm">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full mb-5 p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none"
            placeholder="Enter phone"
            required
          />

          <label className="block mb-3 text-sm">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-3 p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none"
            placeholder="Enter password"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 font-bold py-3 rounded"
          >
            Login
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center ${message.includes("successful") ? "text-green-400" : "text-red-400"
              }`}
          >
            {message}
          </p>
        )}

        <div className="text-center mt-6">
          <span className="text-gray-300">Don't have an account? </span>
          <button
            onClick={() => navigate("/register")}
            className="text-blue-400 hover:underline"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
