import { useState, useEffect } from "react";
import BottomNav from "../components/BottomNav";
import { apiRequest } from "../api";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantCount, setRestaurantCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [userTokens, setUserTokens] = useState(0);
  const [mealsSaved, setMealsSaved] = useState(62);
  const [co2Saved, setCo2Saved] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleProfileClick = () => navigate("/profile");

  // 🔄 Fetch restaurants
  const fetchRestaurants = async () => {
    try {
      const res = await apiRequest("/restaurants");
      setRestaurants(res.restaurants || []);
      setRestaurantCount(res.count || 0);
    } catch (err) {
      console.error("Failed to fetch restaurants:", err);
      setError("Failed to load restaurants.");
    } finally {
      setLoading(false);
    }
  };

  // 🧭 Initial load + auto-refresh every 15s
  useEffect(() => {
    fetchRestaurants();
    const interval = setInterval(fetchRestaurants, 15000);
    return () => clearInterval(interval);
  }, []);

  // 🧍 Load user info
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUserTokens(parsed.tokens || 0);
    }
    const saved = localStorage.getItem("mealsSaved");
    if (saved) setMealsSaved(parseInt(saved, 10));
  }, []);

  // ♻️ Auto-update CO2 stat
  useEffect(() => {
    setCo2Saved((mealsSaved * 2.5).toFixed(1));
  }, [mealsSaved]);

  const filteredRestaurants = restaurants.filter(
    (r) =>
      r.tokens_left > 0 &&
      r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4FFF4]">
        <p className="text-gray-500 text-lg">Loading restaurants...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4FFF4]">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchRestaurants}
          className="bg-[#6ECF68] text-white px-6 py-2 rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4FFF4] flex flex-col pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-4 sticky top-0 z-10 flex justify-between items-center">
        <button
          onClick={handleProfileClick}
          className="focus:outline-none hover:bg-gray-100 px-3 py-1 rounded transition"
        >
          <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
        </button>

        <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
          <span className="text-2xl">⭐</span>
          <span className="text-lg font-bold text-amber-600">{userTokens}</span>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <StatCard icon="🍱" value={mealsSaved} label="Meals Saved" />
          <StatCard icon="🏪" value={restaurantCount} label="Restaurants" />
          <StatCard icon="🌱" value={co2Saved} label="CO₂ kg" />
        </div>

        {/* Search */}
        <div className="mb-6 relative">
          <input
            type="text"
            placeholder="Search restaurants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-green-400 focus:outline-none text-gray-700 shadow-sm"
          />
          <svg
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Restaurants */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span className="text-[#6ECF68]">📍</span> Available Now
            </h2>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
              {filteredRestaurants.length} open
            </span>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
            {filteredRestaurants.length > 0 ? (
              filteredRestaurants.map((r) => (
                <RestaurantCard key={r.id} restaurant={r} />
              ))
            ) : (
              <p className="text-gray-500 text-center py-6">No restaurants found.</p>
            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

/* Small reusable subcomponents */
function StatCard({ icon, value, label }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 text-center">
      <div className="text-3xl mb-1">{icon}</div>
      <p className="text-2xl font-bold text-[#6ECF68]">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}

function RestaurantCard({ restaurant }) {
  const getMapUrl = () => {
    if (restaurant.lat && restaurant.lon)
      return `https://www.google.com/maps?q=${restaurant.lat},${restaurant.lon}`;
    if (restaurant.address)
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        restaurant.address
      )}`;
    return "#";
  };

  return (
    <div className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 rounded-xl px-4 py-3 transition-all border border-gray-200">
      <div>
        <p className="text-sm font-semibold text-gray-800">{restaurant.name}</p>
        <p className="text-xs text-gray-500 mt-1">{restaurant.food_type}</p>
        <p className="text-xs text-gray-500 mt-1">
          ⭐ {restaurant.tokens_left} servings left
        </p>
      </div>
      <a
        href={getMapUrl()}
        target="_blank"
        rel="noreferrer"
        className="bg-[#6ECF68] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#5BBA58] transition-all"
      >
        VIEW
      </a>
    </div>
  );
}
