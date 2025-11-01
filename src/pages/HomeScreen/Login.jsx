import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PAGE_URLS } from "../../App/config";

export default function Login() {
  const navigate = useNavigate();

  // ---------- Login States ----------
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // ---------- Forgot Password States ----------
  const [forgotStep, setForgotStep] = useState(0); // 0:none/login, 1: email, 2: OTP, 3: new password
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ---------- Clear old user ----------
  useEffect(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }, []);

  // ---------- Login ----------
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", { phone, password });
      const { token, user } = res.data;
      const userData = user || res.data;

      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: userData.id,
          fullname: userData.fullname,
          phone: userData.phone,
          email: userData.email,
          role: userData.role,
        })
      );

      setTimeout(() => {
        switch (userData.role) {
          case "ADMIN":
            navigate(PAGE_URLS.ADMIN_DASHBOARD);
            break;
          case "STAFF":
            navigate(PAGE_URLS.STAFF_DASHBOARD);
            break;
          case "TECHNICIAN":
            navigate(PAGE_URLS.TECHNICIAN_DASHBOARD);
            break;
          default:
            navigate(PAGE_URLS.HOME);
        }
      }, 500);
    } catch (err) {
      if (err.response?.status === 401) setMessage("Invalid phone or password");
      else if (err.response?.status === 404) setMessage("Account not found");
      else setMessage("Server error. Please try again later.");
    }
  };

  // ---------- Forgot Password ----------
  const handleSendOtp = async () => {
    if (!forgotEmail) return setMessage("Enter your email first.");
    setMessage("");
    try {
      await axios.post("http://localhost:8080/api/auth/forgot-password", { email: forgotEmail });
      setForgotStep(2);
      setMessage("OTP sent to your email");
    } catch (err) {
      console.error(err);
      setMessage("Failed to send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return setMessage("Enter OTP.");
    setMessage("");
    try {
      await axios.post("http://localhost:8080/api/auth/verify-otp", { email: forgotEmail, otp });
      setForgotStep(3);
      setMessage("OTP verified");
    } catch (err) {
      console.error(err);
      setMessage("OTP verification failed");
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) return setMessage("Enter new password.");
    if (newPassword !== confirmPassword) return setMessage("Passwords do not match.");
    setMessage("");
    try {
      await axios.post("http://localhost:8080/api/auth/reset-password", {
        email: forgotEmail,
        otp,
        newPassword,
      });
      setMessage("Password reset successful");
      setForgotStep(0);
      setForgotEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      setMessage("Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-xl w-full max-w-md shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-8">Sign In</h2>

        {/* ----- Login Form ----- */}
        {forgotStep === 0 && (
          <form onSubmit={handleLogin}>
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

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 font-bold py-3 rounded">
              Login
            </button>
          </form>
        )}

        {/* ----- Forgot Password: Step 1 (Enter Email) ----- */}
        {forgotStep === 1 && (
          <div>
            <label className="block mb-3 text-sm">Enter your email</label>
            <input
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="w-full mb-3 p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none"
              placeholder="Email"
            />
            <button onClick={handleSendOtp} className="w-full bg-blue-600 hover:bg-blue-700 font-bold py-3 rounded mb-2">
              Send OTP
            </button>
            <button onClick={() => setForgotStep(0)} className="w-full bg-gray-600 hover:bg-gray-500 font-bold py-3 rounded">
              Cancel
            </button>
          </div>
        )}

        {/* ----- Forgot Password: Step 2 (OTP) ----- */}
        {forgotStep === 2 && (
          <div>
            <label className="block mb-3 text-sm">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full mb-3 p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none"
              placeholder="OTP"
            />
            <button onClick={handleVerifyOtp} className="w-full bg-blue-600 hover:bg-blue-700 font-bold py-3 rounded mb-2">
              Verify OTP
            </button>
            <button onClick={() => setForgotStep(0)} className="w-full bg-gray-600 hover:bg-gray-500 font-bold py-3 rounded">
              Cancel
            </button>
          </div>
        )}

        {/* ----- Forgot Password: Step 3 (New Password) ----- */}
        {forgotStep === 3 && (
          <div>
            <label className="block mb-3 text-sm">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full mb-3 p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none"
            />

            <label className="block mb-3 text-sm">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mb-3 p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none"
            />

            <button onClick={handleResetPassword} className="w-full bg-blue-600 hover:bg-blue-700 font-bold py-3 rounded mb-2">
              Reset Password
            </button>
            <button onClick={() => setForgotStep(0)} className="w-full bg-gray-600 hover:bg-gray-500 font-bold py-3 rounded">
              Cancel
            </button>
          </div>
        )}

        {/* ----- Message ----- */}
        {message && <p className="mt-4 text-center text-blue-400">{message}</p>}

        {/* ----- Bottom Options ----- */}
        {forgotStep === 0 && (
          <div className="text-center mt-6">
            <button onClick={() => setForgotStep(1)} className="text-blue-400 hover:underline mb-2">
              Forgot password?
            </button>
            <div>
              <span className="text-gray-300">Don't have an account? </span>
              <button onClick={() => navigate("/register")} className="text-blue-400 hover:underline">
                Register
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
