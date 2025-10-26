import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PAGE_URLS } from "../../App/config";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: "",
    phone: "",
    dob: "",
    email: "",
    address: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullname, phone, dob, email, address, password } = formData;

    // Phan quyen
    if (!fullname || !phone || !dob || !email || !address || !password)
      return setError("Please fill in all required fields.");

    if (password.length < 6)
      return setError("Password must be at least 6 characters long.");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setError("Invalid email format.");

    if (!/^0\d{9}$/.test(phone))
      return setError("Phone must start with 0 and be 10 digits.");

    if (new Date(dob) >= new Date())
      return setError("Invalid DOB (must be in the past).");

    const registerRequest = {
      phone,
      password,
      fullname,
      email,
      address,
      dob,
    };

    try {
      await axios.post("http://localhost:8080/api/auth/register", registerRequest);
      setMessage("Registration successful! Redirecting...");
      setError("");
      setTimeout(() => navigate(PAGE_URLS.LOGIN), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-700 flex flex-col items-center justify-center text-white relative px-10">
      <img src="/img/logo.jpg" alt="Logo"
        className="absolute top-6 left-8 h-14 w-14 object-cover"
      />

      <div className="bg-gray-800 p-10 rounded-2xl shadow-2xl w-full max-w-2xl">
        <h2 className="text-3xl font-bold mb-8 text-center">Register Account</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Full Name" name="fullname" value={formData.fullname} onChange={handleChange} />
          <Input label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
          <Input label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} />
          <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
          <Input label="Address" name="address" value={formData.address} onChange={handleChange} />
          <Input label="Password" name="password" type="password" value={formData.password} onChange={handleChange} />

          <div className="flex justify-center pt-4">
            <button type="submit" className="w-1/3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg">
              Register
            </button>
          </div>
        </form>

        {message && <p className="mt-6 text-center text-sm text-green-400">{message}</p>}
        {error && <p className="mt-6 text-center text-sm text-red-400">{error}</p>}
      </div>
    </div>
  );
}

function Input({ label, name, type = "text", value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <input
        required
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-3 rounded-lg bg-gray-600 text-white border border-gray-500 focus:outline-none"
      />
    </div>
  );
}
