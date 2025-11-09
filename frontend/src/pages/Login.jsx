import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../api";
import { useState } from "react";
import logo from "../assets/RePlate.png";
import googlelogo from "../assets/loginwgoogle.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    window.location.href = "http://127.0.0.1:5000/login/google";
  };

  const handleLogin = async () => {
    const res = await apiRequest("/login", "POST", { email, password });
    if (res.success) {
      // ✅ Store user info together for consistency
      const userData = {
        id: res.user_id,
        name: res.name,
        email: res.email,
        tokens: res.tokens,
        claims_today: res.claims_today,
      };
      localStorage.setItem("user", JSON.stringify(userData));

      // (optional) backward-compatibility
      localStorage.setItem("user_id", res.user_id);
      localStorage.setItem("user_name", res.name);
      localStorage.setItem("tokens", res.tokens);

      navigate("/home");
    } else {
      setMessage("❌ " + res.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4FFF4] flex justify-center items-center">
      <div className="w-full max-w-sm px-6 py-8 bg-white rounded-2xl shadow-md">
        {/* Logo */}
        <div className="flex flex-col items-center space-y-2 mb-6">
          <img src={logo} alt="RePlate Logo" className="w-65 h-40" />
        </div>

        {/* Form */}
        <div className="space-y-5">
          {/* Email */}
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-800">
              Your Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3
                         focus:ring-2 focus:ring-green-400 focus:outline-none text-gray-700"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
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

          {/* Forgot password */}
          <div className="text-right text-sm">
            <Link to="/forgetpassword" className="text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          {/* Continue button */}
          <button
            onClick={handleLogin}
            type="button"
            className="w-full bg-[#6ECF68] text-white font-semibold rounded-xl py-3
                       hover:bg-[#5BBA58] transition-all"
          >
            Continue
          </button>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full py-3 border border-gray-300 rounded-xl flex items-center justify-center
                       hover:bg-gray-50"
          >
            <img src={googlelogo} alt="Login with Google" className="w-40 h-6" />
          </button>
        </div>

        {/* Signup link */}
        <p className="mt-6 text-center text-sm text-gray-700">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>

      {message && (
        <p className="mt-4 text-center text-red-500 absolute bottom-10 w-full">{message}</p>
      )}
    </div>
  );
}
