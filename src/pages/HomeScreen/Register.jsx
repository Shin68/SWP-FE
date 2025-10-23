import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api.js";
import { PAGE_URLS } from "../../App/config.js";

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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { fullname, phone, dob, email, address, password, confirmPassword } = formData;

        console.log("Submitting registration form with data:", formData);

        // Validate required fields
        if (!fullname || !phone || !dob || !email || !address || !password || !confirmPassword) {
            setError("Please fill in all required fields.");
            setMessage("");
            return;
        }

        // Validate password match
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setMessage("");
            return;
        }

        // Validate password length
        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            setMessage("");
            return;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Invalid email address.");
            setMessage("");
            return;
        }

        // Validate phone
        const phoneRegex = /^0\d{9}$/;
        if (!phoneRegex.test(phone)) {
            setError("Phone number must have 10 digits and start with 0.");
            setMessage("");
            return;
        }

        // Validate date of birth
        const dobDate = new Date(dob);
        const today = new Date();
        if (isNaN(dobDate.getTime()) || dobDate >= today) {
            setError("Invalid date of birth (must be before today).");
            setMessage("");
            return;
        }

        // Prepare request
        const registerRequest = {
            phone,
            password,
            fullname,
            email,
            role: "CUSTOMER",
            address,
            dob,
        };

        console.log("Register request payload:", registerRequest);

        try {
            const response = await api.post("/auth/register", registerRequest);
            console.log("Register API response:", response.data);

            setMessage(response.data.message || "Registration successful! Please log in.");
            setError("");

            setTimeout(() => navigate(PAGE_URLS.LOGIN), 1500);
        } catch (err) {
            console.error("Register API error:", err.response || err);

            const errorMessage = err.response?.data?.message || "Registration failed. Please try again.";
            setError(errorMessage);
            setMessage("");
        }
    };

    return (
        <div className="min-h-screen bg-gray-700 flex flex-col items-center justify-center text-white relative px-10">
            <img
                src="/img/logo.jpg"
                alt="Logo"
                className="absolute top-6 left-8 h-14 w-14 object-cover"
            />

            <div className="bg-gray-800 p-10 rounded-2xl shadow-2xl w-full max-w-2xl">
                <h2 className="text-3xl font-bold mb-8 text-center">Register Account</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Full Name</label>
                        <input
                            type="text"
                            name="fullname"
                            value={formData.fullname}
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg bg-gray-600 text-white border border-gray-500 focus:outline-none focus:border-blue-500"
                            placeholder="Enter your full name"
                            required
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg bg-gray-600 text-white border border-gray-500 focus:outline-none focus:border-blue-500"
                            placeholder="Enter your phone number"
                            required
                        />
                    </div>

                    {/* Date of Birth */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Date of Birth</label>
                        <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg bg-gray-600 text-white border border-gray-500 focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg bg-gray-600 text-white border border-gray-500 focus:outline-none focus:border-blue-500"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg bg-gray-600 text-white border border-gray-500 focus:outline-none focus:border-blue-500"
                            placeholder="Enter your address"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg bg-gray-600 text-white border border-gray-500 focus:outline-none focus:border-blue-500"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg bg-gray-600 text-white border border-gray-500 focus:outline-none focus:border-blue-500"
                            placeholder="Re-enter your password"
                            required
                        />
                    </div>

                    {/* Button */}
                    <div className="flex justify-center pt-4">
                        <button
                            type="submit"
                            className="w-1/3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all"
                        >
                            Register
                        </button>
                    </div>
                </form>

                {/* Messages */}
                {message && <p className="mt-6 text-center text-sm text-green-400">{message}</p>}
                {error && <p className="mt-6 text-center text-sm text-red-400">{error}</p>}
            </div>
        </div>
    );
}
