import BottomNav from "../components/BottomNav";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between pb-24">

      {/* Top Section */}
      <div className="px-6 pt-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-sm font-medium text-gray-600">Profile</h1>

          <div className="flex items-center gap-1">
            <span className="text-xl font-bold">2⭐</span>
          </div>
        </div>

        {/* Avatar + Email + Location */}
        <div className="flex flex-col items-center space-y-2 mb-6">
          <div className="w-28 h-28 rounded-full border-4 border-green-400 flex items-center justify-center">
            <div className="w-28 h-28 flex items-center justify-center text-6xl leading-none">
              🙂
            </div>
          </div>

          <p className="text-gray-900 font-medium underline">
            contact@dscode.tech.com
          </p>

          <p className="text-gray-600 text-sm">Alberta,Calgary</p>

          {/* Buttons */}
          <div className="flex gap-4 mt-2">
            <button onClick={() => navigate("/")} className="bg-[#EF7D7D] px-6 py-2 text-white rounded-xl text-sm">
              log out
            </button>

            <button className="bg-[#6ECF68] px-6 py-2 text-white rounded-xl text-sm">
              Edit
            </button>
          </div>
        </div>

        {/* History Title */}
        <h2 className="text-sm font-medium text-gray-800 mb-2">History</h2>

        {/* History List (scrollable) */}
        <div className="border border-black rounded-xl p-4 space-y-3 max-h-64 overflow-y-auto">

          {/* Existing */}
          <HistoryItem name="McDonalds" date="07/22/2025" />
          <HistoryItem name="COBS Bread" date="07/01/2025" />
          <HistoryItem name="McDonalds" date="06/12/2025" />
          <HistoryItem name="COBS Bread" date="05/30/2025" />

          {/* ✅ Added More To Test Scrolling */}
          <HistoryItem name="Subway" date="05/12/2025" />
          <HistoryItem name="Tim Hortons" date="04/28/2025" />
          <HistoryItem name="Pizza Hut" date="04/11/2025" />
          <HistoryItem name="Starbucks" date="03/21/2025" />
          <HistoryItem name="Save On Foods" date="03/04/2025" />
          <HistoryItem name="A&W" date="02/17/2025" />
          <HistoryItem name="KFC" date="01/29/2025" />
          <HistoryItem name="Wendy's" date="01/10/2025" />
          <HistoryItem name="Taco Bell" date="12/28/2024" />
        </div>
      </div>

      {/* ✅ Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

/* Helper Component */
function HistoryItem({ name, date }) {
  return (
    <div className="flex justify-between items-center bg-white shadow-sm rounded-xl px-4 py-3">
      <span className="text-sm font-medium">{name}</span>
      <span className="text-xs text-gray-600">{date}</span>
    </div>
  );
}
