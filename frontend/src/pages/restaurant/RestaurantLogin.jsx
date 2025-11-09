// src/pages/restaurant/RestaurantLogin.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../assets/RePlate.png"; // adjust path if needed

export default function RestaurantLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/restaurant/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        // ✅ Save to localStorage
        localStorage.setItem("restaurant_id", data.id);
        localStorage.setItem("restaurant_name", data.name);
        localStorage.setItem("restaurant_address", data.address);

        alert("✅ Login successful!");
        navigate("/restaurant/dashboard");
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("⚠️ Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4FFF4] flex justify-center items-center px-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-md p-6">
        {/* Logo */}
        <div className="flex flex-col items-center space-y-2 mb-6">
          <img src={logo} alt="RePlate Logo" className="w-40 h-auto" />
          <h2 className="text-lg font-bold text-gray-800">
            Restaurant Partner Login
          </h2>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your restaurant email"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 
                         focus:ring-2 focus:ring-green-400 focus:outline-none text-gray-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 
                         focus:ring-2 focus:ring-green-400 focus:outline-none text-gray-700"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#6ECF68] text-white font-semibold rounded-xl py-3 
                       hover:bg-[#5BBA58] transition-all mt-3"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don’t have a restaurant account?{" "}
          <Link
            to="/restaurant/signup"
            className="text-green-600 hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
