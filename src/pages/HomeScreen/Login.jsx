import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAccountByPhone } from "../../utils/accountData";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const account = getAccountByPhone(phone);

    if (account && account.password === password) {
      // Store logged-in user data in localStorage
      localStorage.setItem('loggedInUser', JSON.stringify(account));
      setMessage(`Login successful! Welcome ${account.name} (${account.role})`);
      setTimeout(() => {
        if (account.role === "Technician") {
          navigate("/technician");
        } else if (account.role === "Staff") {
          navigate("/staff/bookings");
        } else if (account.role === "Customer") {
          navigate("/home");
        } else {
          navigate("/home");
        }
      }, 1500);
    } else {
      setMessage("Invalid phone number or password");
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
          <p className="mt-4 text-center text-sm text-green-400">{message}</p>
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