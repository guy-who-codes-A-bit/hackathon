import { useNavigate } from "react-router-dom";
import { useState } from "react";
import BottomNav from "../components/BottomNav";
import logo from "../assets/RePlate.png";

export default function EditProfile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // existing
  const [email, setEmail] = useState("contact@dscode.tech.com");
  const [editEmail, setEditEmail] = useState(false);
  const [actualPassword, setActualPassword] = useState("123"); // ← example from DB
  const [showPassword, setShowPassword] = useState(false);



  // ✅ NEW: independent state/toggle for NAME
  const [name, setName] = useState(user.name || "Andrew Tan");
  const [editName, setEditName] = useState(false);

  return (
    <div className="min-h-screen bg-[#F4FFF4] flex flex-col pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-4 sticky top-0 z-10 flex justify-between items-center">
        <button onClick={() => navigate("/profile")} className="text-sm text-blue-600 underline">
          <img src={logo} alt="RePlate Logo" className="w-50 h-30" />
        </button>

        <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
          <span className="text-2xl">⭐</span>
          <span className="text-lg font-bold text-amber-600">{user.tokens}</span>
        </div>
      </div>

      {/* Page Body */}
      <div className="px-6 py-6">
        <div className="bg-white shadow-md rounded-2xl p-6 space-y-6">

          {/* EMAIL */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <button
                type="button"
                onClick={() => setEditEmail(v => !v)}
                className="text-sm text-green-600"
              >
                {editEmail ? "lock" : "edit"}
              </button>
            </div>
            <input
              type="email"
              value={user.email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!editEmail}
              className={`w-full rounded-lg px-4 py-3 text-sm ${editEmail ? "bg-white border border-gray-300" : "bg-gray-100"
                }`}
            />
          </div>

          {/* ✅ NAME (separate toggle & state) */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-gray-700">Name</label>
              <button
                type="button"
                onClick={() => setEditName(v => !v)}
                className="text-sm text-green-600"
              >
                {editName ? "lock" : "edit"}
              </button>
            </div>
            <input
              type="text"
              value={user.name}
              onChange={(e) => setName(e.target.value)}
              disabled={!editName}
              className={`w-full rounded-lg px-4 py-3 text-sm ${editName ? "bg-white border border-gray-300" : "bg-gray-100"
                }`}
            />
          </div>

          {/* PASSWORD (reveal while editing) */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="text-sm text-green-600"
              >
                {showPassword ? "lock" : "edit"}
              </button>
            </div>

            <input
              type={showPassword ? "text" : "password"}          // 👈 SWITCHES DISPLAY
              value={actualPassword}                             // 👈 always stores real password
              onChange={(e) => setActualPassword(e.target.value)}
              disabled={!showPassword}                           // 👈 only editable when "edit" pressed
              className={`w-full rounded-lg px-4 py-3 text-sm ${showPassword ? "bg-white border border-gray-300" : "bg-gray-100"
                }`}
            />
          </div>

        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => navigate("/profile")}
            className="flex-1 bg-[#EF7D7D] text-white py-3 rounded-xl font-semibold"
          >
            Cancel
          </button>

          <button className="flex-1 bg-[#6ECF68] text-white py-3 rounded-xl font-semibold">
            Save
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
