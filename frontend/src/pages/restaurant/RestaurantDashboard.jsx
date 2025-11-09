import { useEffect, useState } from "react";
import { RefreshCcw, Edit3, Camera, Star } from "lucide-react";
import RestaurantScanner from "./RestaurantScanner";

export default function RestaurantDashboard() {
  const [restaurant, setRestaurant] = useState(null);
  const [foodType, setFoodType] = useState("");
  const [tokensLeft, setTokensLeft] = useState(0);
  const [status, setStatus] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [loading, setLoading] = useState(true);

  const restaurantId = localStorage.getItem("restaurant_id");
  const restaurantName = localStorage.getItem("restaurant_name");

  // 🧭 Fetch restaurant info
  const fetchRestaurant = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/restaurants");
      const data = await res.json();
      const current = data.find((r) => r.id == restaurantId);

      if (current) {
        setRestaurant(current);
        setFoodType(current.food_type || "");
        setTokensLeft(current.tokens_left || 0);
      }
    } catch (err) {
      console.error("Error fetching restaurant:", err);
      setStatus("Failed to load restaurant info.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurant();
  }, []);

  // 🧁 Update Offer
  const handleUpdateOffer = async () => {
    if (!foodType.trim()) {
      setStatus("Please enter a food type.");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:5000/restaurant/update-offer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurant_id: restaurantId,
          food_type: foodType,
          tokens_left: Number(tokensLeft),
        }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus(`✅ ${data.message}`);
        fetchRestaurant();
      } else {
        setStatus(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error("Error updating offer:", err);
      setStatus("Server error. Try again later.");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#F4FFF4] flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading your dashboard...</p>
      </div>
    );

  // ✨ Stats Cards
  const StatCard = ({ icon, label, value }) => (
    <div className="bg-white rounded-2xl shadow-md p-4 text-center">
      <div className="text-3xl mb-1">{icon}</div>
      <p className="text-2xl font-bold text-[#6ECF68]">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F4FFF4] flex flex-col pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-4 sticky top-0 z-10 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {restaurantName || "Restaurant Dashboard"}
          </h1>
          <p className="text-xs text-gray-500">
            {new Date().toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={fetchRestaurant}
          className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-100"
          title="Refresh"
        >
          <RefreshCcw size={18} className="text-gray-600" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            icon="🍱"
            label="Tokens Left"
            value={restaurant?.tokens_left || 0}
          />
          <StatCard
            icon="✅"
            label="Today's Claims"
            value={restaurant?.claims?.length || 0}
          />
          <StatCard icon="⭐" label="Daily Limit" value="10" />
        </div>

        {/* Current Offer Card */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
            🏪 Current Offer
          </h2>
          {restaurant?.food_type ? (
            <div className="text-gray-700 space-y-1">
              <p>
                🍽️ <span className="font-medium">{restaurant.food_type}</span>
              </p>
              <p>
                🍱 Tokens Left:{" "}
                <span className="font-semibold text-[#6ECF68]">
                  {restaurant.tokens_left}
                </span>
              </p>
              <p className="text-xs text-gray-500 italic mt-1">
                Edit your offer anytime below.
              </p>
            </div>
          ) : (
            <p className="text-gray-500 text-sm italic">No active offer yet.</p>
          )}
        </div>

        {/* Offer Update Section */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            ✏️ Update Offer
          </h2>

          <label className="block text-gray-700 font-medium mb-2">
            Food Type
          </label>
          <input
            type="text"
            value={foodType}
            onChange={(e) => setFoodType(e.target.value)}
            placeholder="e.g., Sandwich & Soup Combo"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-3 
                       focus:ring-2 focus:ring-green-400 outline-none"
          />

          <label className="block text-gray-700 font-medium mb-2">
            Tokens Available
          </label>
          <input
            type="number"
            value={tokensLeft}
            onChange={(e) => setTokensLeft(e.target.value)}
            placeholder="e.g., 5"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-5 
                       focus:ring-2 focus:ring-green-400 outline-none"
          />

          <button
            onClick={handleUpdateOffer}
            className="w-full bg-[#6ECF68] text-white font-semibold rounded-xl py-3 
                       hover:bg-[#5BBA58] transition flex items-center justify-center gap-2"
          >
            <Edit3 size={16} />
            Update Offer
          </button>

          {status && (
            <p className="text-center text-sm mt-4 text-gray-700">{status}</p>
          )}
        </div>

        {/* Scanner Section */}
        <div className="bg-white rounded-2xl shadow-md p-6 text-center">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
            <Camera size={18} /> Scan User QR
          </h2>
          {!showScanner ? (
            <button
              onClick={() => setShowScanner(true)}
              className="bg-[#6ECF68] text-white px-6 py-3 rounded-xl font-semibold 
                         hover:bg-[#5BBA58] transition-all shadow-sm"
            >
              Open Scanner
            </button>
          ) : (
            <div className="mt-4">
              <RestaurantScanner />
              <button
                onClick={() => setShowScanner(false)}
                className="mt-4 bg-gray-200 text-gray-800 px-6 py-2 rounded-xl font-semibold 
                           hover:bg-gray-300 transition"
              >
                Close Scanner
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
