// src/pages/restaurant/RestaurantSignup.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../assets/RePlate.png";

export default function RestaurantSignup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/restaurant/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        alert("✅ Restaurant account created!");
        navigate("/restaurant/login");
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("⚠️ Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4FFF4] flex justify-center items-center px-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-md p-6">
        <div className="flex flex-col items-center space-y-2 mb-6">
          <img src={logo} alt="RePlate Logo" className="w-40 h-auto" />
          <h2 className="text-lg font-bold text-gray-800">
            Restaurant Partner Signup
          </h2>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Restaurant Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g., COBS Bread"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 
                         focus:ring-2 focus:ring-green-400 focus:outline-none text-gray-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Restaurant email"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 
                         focus:ring-2 focus:ring-green-400 focus:outline-none text-gray-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Restaurant address"
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
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create a password"
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
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link
            to="/restaurant/login"
            className="text-green-600 hover:underline font-medium"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
