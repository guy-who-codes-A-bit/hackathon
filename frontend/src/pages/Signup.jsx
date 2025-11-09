import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../api";
import { useState } from "react";
import logo from "../assets/RePlate.png";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    const res = await apiRequest("/signup", "POST", { name, email, password });
    if (res.success) {
      setMessage("✅ Account created! Redirecting...");
      setTimeout(() => navigate("/login"), 1000);
    } else setMessage("❌ " + res.message);
  };

  return (
    <div className="min-h-screen bg-[#F4FFF4] flex justify-center items-center">
      <div className="w-full max-w-sm px-6 py-8 bg-white rounded-2xl shadow-md">
        {/* Logo */}
        <div className="flex flex-col items-center space-y-2 mb-6">
          <img src={logo} alt="RePlate Logo" className="w-65 h-40" />
        </div>

        {/* Form Section */}
        <div className="space-y-5">
          {/* Name field */}
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-800">
              Name
            </label>
            <input
              type="name"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 
                         focus:ring-2 focus:ring-green-400 focus:outline-none text-gray-700"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email field */}
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-800">
              Your Email
            </label>
            <input
              type="email"
              defaultValue="contact@dscode.tech.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 
                         focus:ring-2 focus:ring-green-400 focus:outline-none text-gray-700"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password field */}
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-800">
              Password
            </label>
            <input
              type="password"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 
                         focus:ring-2 focus:ring-green-400 focus:outline-none text-gray-700"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Continue button */}
          <button
            onClick={handleSignup}
            className="w-full bg-[#6ECF68] text-white font-semibold rounded-xl py-3 
                       hover:bg-[#5BBA58] transition-all"
          >
            Continue
          </button>

          {/* Google Login */}
          <p className="mt-6 text-center text-sm text-gray-700">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
      <p>{message}</p>
    </div>
  );
}
