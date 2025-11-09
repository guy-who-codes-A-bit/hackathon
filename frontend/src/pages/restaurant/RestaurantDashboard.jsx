import { useEffect, useState } from "react";
import { RefreshCcw, Edit3 } from "lucide-react";

export default function RestaurantDashboard() {
  const [restaurant, setRestaurant] = useState(null);
  const [foodType, setFoodType] = useState("");
  const [tokensLeft, setTokensLeft] = useState(0);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const restaurantId = localStorage.getItem("restaurant_id");
  const restaurantName = localStorage.getItem("restaurant_name");

  // Fetch restaurant info
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
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRestaurant();
  }, []);

  // Update offer (food type + tokens)
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
        fetchRestaurant(); // refresh display
      } else {
        setStatus(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error("Error updating offer:", err);
      setStatus("Server error. Try again later.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4FFF4] flex items-center justify-center">
        <p className="text-gray-600">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4FFF4] flex justify-center py-6 px-3">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-md p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {restaurantName || "RePlate Partner"}
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
            <RefreshCcw size={16} className="text-gray-600" />
          </button>
        </div>

        {/* Current Offer Card */}
        <div className="border border-green-100 rounded-2xl p-4 bg-[#F9FFF9] mb-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">
            Current Offer
          </h2>
          {restaurant?.food_type ? (
            <div>
              <p className="text-gray-700 mb-1">
                🍽️ <span className="font-medium">{restaurant.food_type}</span>
              </p>
              <p className="text-gray-600 mb-1">
                🍱 Tokens Left:{" "}
                <span className="font-medium">{restaurant.tokens_left}</span>
              </p>
            </div>
          ) : (
            <p className="text-gray-500 text-sm italic">No active offer yet.</p>
          )}
        </div>

        {/* Update Section */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Update Food Type
          </label>
          <input
            type="text"
            value={foodType}
            onChange={(e) => setFoodType(e.target.value)}
            placeholder="e.g., Coffee & Pastry"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-3 focus:ring-2 focus:ring-green-400 outline-none"
          />

          <label className="block text-gray-700 font-medium mb-2">
            Tokens Available
          </label>
          <input
            type="number"
            value={tokensLeft}
            onChange={(e) => setTokensLeft(e.target.value)}
            placeholder="e.g., 5"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-5 focus:ring-2 focus:ring-green-400 outline-none"
          />

          <button
            onClick={handleUpdateOffer}
            className="w-full bg-[#6ECF68] text-white font-semibold rounded-xl py-3 hover:bg-[#5BBA58] transition flex items-center justify-center gap-2"
          >
            <Edit3 size={16} />
            Update Offer
          </button>

          {status && (
            <p className="text-center text-sm mt-4 text-gray-700">{status}</p>
          )}
        </div>
      </div>
    </div>
  );
}
