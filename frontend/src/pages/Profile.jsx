import BottomNav from "../components/BottomNav";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F4FFF4] flex flex-col pb-20">
      {/* Header Bar */}
      <div className="bg-white shadow-sm px-6 py-4 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
          <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
            <span className="text-2xl">⭐</span>
            <span className="text-lg font-bold text-amber-600">2</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative mb-4">
              <div className="w-32 h-32 rounded-full bg-linear-to-br from-green-400 to-green-600 
                              flex items-center justify-center shadow-lg">
                <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center">
                  <span className="text-6xl">🙂</span>
                </div>
              </div>
              {/* Edit Icon Badge */}

            </div>

            {/* User Info */}
            <h2 className="text-xl font-bold text-gray-800 mb-1">John Doe</h2>
            <p className="text-gray-600 text-sm mb-1 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              contact@dscode.tech.com
            </p>
            <p className="text-gray-500 text-sm flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd" />
              </svg>
              Calgary, Alberta
            </p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#6ECF68]">24</p>
              <p className="text-xs text-gray-500">Meals Saved</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#6ECF68]">12</p>
              <p className="text-xs text-gray-500">Restaurants</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#6ECF68]">48</p>
              <p className="text-xs text-gray-500">Tokens</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl 
                               hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Profile
            </button>
            <button className="flex-1 bg-[#EF7D7D] text-white font-semibold py-3 rounded-xl 
                               hover:bg-[#E56B6B] transition-all flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Log Out
            </button>
          </div>
        </div>

        {/* History Section */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#6ECF68]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd" />
              </svg>
              Order History
            </h2>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              13 orders
            </span>
          </div>

          {/* History List */}
          <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
            <HistoryItem name="McDonalds" date="07/22/2025" emoji="🍔" />
            <HistoryItem name="COBS Bread" date="07/01/2025" emoji="🥖" />
            <HistoryItem name="McDonalds" date="06/12/2025" emoji="🍔" />
            <HistoryItem name="COBS Bread" date="05/30/2025" emoji="🥖" />
            <HistoryItem name="Subway" date="05/12/2025" emoji="🥪" />
            <HistoryItem name="Tim Hortons" date="04/28/2025" emoji="☕" />
            <HistoryItem name="Pizza Hut" date="04/11/2025" emoji="🍕" />
            <HistoryItem name="Starbucks" date="03/21/2025" emoji="☕" />
            <HistoryItem name="Save On Foods" date="03/04/2025" emoji="🛒" />
            <HistoryItem name="A&W" date="02/17/2025" emoji="🍔" />
            <HistoryItem name="KFC" date="01/29/2025" emoji="🍗" />
            <HistoryItem name="Wendy's" date="01/10/2025" emoji="🍔" />
            <HistoryItem name="Taco Bell" date="12/28/2024" emoji="🌮" />
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

/* Enhanced History Item Component */
function HistoryItem({ name, date, emoji }) {
  return (
    <div className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 
                    rounded-xl px-4 py-3 transition-all border border-gray-200">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl shadow-sm">
          {emoji}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">{name}</p>
          <p className="text-xs text-gray-500">{date}</p>
        </div>
      </div>
    </div>
  );
}