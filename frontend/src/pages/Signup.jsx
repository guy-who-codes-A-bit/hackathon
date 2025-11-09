import { Link } from "react-router-dom";
import logo from "../assets/RePlate.png";
export default function Signup() {
  return (
    <div className="min-h-screen bg-[#F4FFF4] flex justify-center items-center">
      <div className="w-full max-w-sm px-6 py-8 bg-white rounded-2xl shadow-md">
        {/* Logo */}
        <div className="flex flex-col items-center space-y-2 mb-6">
          <img src={logo} alt="RePlate Logo" className="w-65 h-40" />
        </div>

        {/* Form Section */}
        <div className="space-y-5">
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
            />
          </div>


          {/* Continue button */}
          <button
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
    </div>
  );
}
