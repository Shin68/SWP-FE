import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL, PAGE_URLS } from "../../App/config";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: "",
    phone: "",
    dob: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear errors when user types
    if (error) setError("");
  };

  const validateForm = () => {
    const { fullname, phone, dob, email, address, password, confirmPassword } = formData;

    if (!fullname || !phone || !dob || !email || !address || !password || !confirmPassword) {
      setError("Please fill in all required fields.");
      return false;
    }

    if (fullname.trim().length < 3) {
      setError("Full name must be at least 3 characters long.");
      return false;
    }

    if (!/^0\d{9}$/.test(phone)) {
      setError("Phone must start with 0 and be exactly 10 digits.");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Invalid email format.");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    const dobDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - dobDate.getFullYear();
    
    if (dobDate >= today) {
      setError("Date of birth must be in the past.");
      return false;
    }

    if (age < 18) {
      setError("You must be at least 18 years old to register.");
      return false;
    }

    if (address.trim().length < 10) {
      setError("Please provide a complete address.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const { fullname, phone, dob, email, address, password } = formData;

    const registerRequest = {
      phone,
      password,
      fullname,
      email,
      address,
      dob,
    };

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, registerRequest);
      
      console.log("Registration successful:", response.data);
      
      setMessage("Registration successful! Redirecting to login...");
      setFormData({
        fullname: "",
        phone: "",
        dob: "",
        email: "",
        address: "",
        password: "",
        confirmPassword: "",
      });
      
      setTimeout(() => navigate(PAGE_URLS.LOGIN), 2000);
    } catch (err) {
      console.error("Registration error:", err);
      
      if (err.response) {
        // Server responded with error
        const errorMsg = err.response.data?.message || err.response.data || "Registration failed.";
        setError(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
      } else if (err.request) {
        // Request made but no response
        setError("Cannot connect to server. Please make sure the backend is running.");
      } else {
        // Something else happened
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
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
          <Input 
            label="Full Name" 
            name="fullname" 
            value={formData.fullname} 
            onChange={handleChange}
            placeholder="Enter your full name"
            disabled={loading}
          />
          <Input 
            label="Phone Number" 
            name="phone" 
            type="tel" 
            value={formData.phone} 
            onChange={handleChange}
            placeholder="0xxxxxxxxx"
            disabled={loading}
          />
          <Input 
            label="Date of Birth" 
            name="dob" 
            type="date" 
            value={formData.dob} 
            onChange={handleChange}
            disabled={loading}
          />
          <Input 
            label="Email" 
            name="email" 
            type="email" 
            value={formData.email} 
            onChange={handleChange}
            placeholder="your.email@example.com"
            disabled={loading}
          />
          <Input 
            label="Address" 
            name="address" 
            value={formData.address} 
            onChange={handleChange}
            placeholder="Enter your complete address"
            disabled={loading}
          />
          <Input 
            label="Password" 
            name="password" 
            type="password" 
            value={formData.password} 
            onChange={handleChange}
            placeholder="At least 6 characters"
            disabled={loading}
          />
          <Input 
            label="Confirm Password" 
            name="confirmPassword" 
            type="password" 
            value={formData.confirmPassword} 
            onChange={handleChange}
            placeholder="Re-enter your password"
            disabled={loading}
          />

          <div className="flex justify-center gap-4 pt-4">
            <button 
              type="button"
              onClick={() => navigate(PAGE_URLS.LOGIN)}
              className="w-1/3 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition"
              disabled={loading}
            >
              Back to Login
            </button>
            <button 
              type="submit" 
              className="w-1/3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition disabled:bg-gray-500 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>

        {message && (
          <div className="mt-6 p-4 bg-green-900 border border-green-500 rounded-lg text-center">
            <p className="text-green-300 font-medium">{message}</p>
          </div>
        )}
        {error && (
          <div className="mt-6 p-4 bg-red-900 border border-red-500 rounded-lg text-center">
            <p className="text-red-300 font-medium">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Input({ label, name, type = "text", value, onChange, placeholder = "", disabled = false }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <input
        required
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full p-3 rounded-lg bg-gray-600 text-white border border-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition disabled:bg-gray-700 disabled:cursor-not-allowed"
      />
    </div>
  );
}
