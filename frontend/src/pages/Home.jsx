import { useState, useEffect } from "react";
import BottomNav from "../components/BottomNav";
import { apiRequest } from "../api";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userTokens, setUserTokens] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/profile");
  };

  // Fetch restaurants and user info from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch restaurants from backend
        const restaurantsData = await apiRequest("/restaurants");
        setRestaurants(restaurantsData);

        // Get user data from localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setUserTokens(parsed.tokens || 0);
        }
      } catch (err) {
        console.error("Failed to fetch restaurants:", err);
        setError("Failed to load restaurants. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter restaurants: only show those with tokens > 0 AND match search term
  const filteredRestaurants = restaurants.filter((r) =>
    r.tokens_left > 0 &&
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate stats based on actual data
  const totalMealsSaved = restaurants.reduce((sum, r) => sum + (r.tokens_left || 0), 0);
  const availableRestaurants = restaurants.filter(r => r.tokens_left > 0).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4fff4] flex justify-center items-center">
        <p className="text-gray-600 text-lg">Loading restaurants...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f4fff4] flex justify-center items-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#6ECF68] text-white px-6 py-2 rounded-xl"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4FFF4] flex flex-col pb-20">
      {/* Header Bar */}
      <div className="bg-white shadow-sm px-6 py-4 sticky top-0 z-10">
        <div className="flex justify-between items-center">
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
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-2xl shadow-md p-4 text-center">
            <div className="text-3xl mb-1">🍱</div>
            <p className="text-2xl font-bold text-[#6ECF68]">{totalMealsSaved}</p>
            <p className="text-xs text-gray-500">Meals Available</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-4 text-center">
            <div className="text-3xl mb-1">🏪</div>
            <p className="text-2xl font-bold text-[#6ECF68]">{restaurants.length}</p>
            <p className="text-xs text-gray-500">Total Restaurants</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-4 text-center">
            <div className="text-3xl mb-1">📍</div>
            <p className="text-2xl font-bold text-[#6ECF68]">{availableRestaurants}</p>
            <p className="text-xs text-gray-500">Available Now</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
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
            <input
              type="text"
              placeholder="Search restaurants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-4 py-3 
                         focus:ring-2 focus:ring-green-400 focus:outline-none text-gray-700 shadow-sm"
            />
          </div>
        </div>

        {/* Restaurants Section */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#6ECF68]" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              Available Now
            </h2>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {filteredRestaurants.length} restaurants
            </span>
          </div>

          {/* Restaurant List */}
          <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
            {filteredRestaurants.length > 0 ? (
              filteredRestaurants.map((r) => (
                <RestaurantCard key={r.id} restaurant={r} />
              ))
            ) : (
              <div className="text-center py-8">
                <div className="text-5xl mb-3">
                  {searchTerm ? "🔍" : "😔"}
                </div>
                <p className="text-gray-500">
                  {searchTerm
                    ? `No available restaurants found matching "${searchTerm}"`
                    : "No restaurants with available servings at the moment"
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

/* Restaurant Card Component */
function RestaurantCard({ restaurant }) {
  const getRestaurantEmoji = (name) => {
    const emojiMap = {
      mcdonalds: "🍔",
      "mcdonald": "🍔",
      cobs: "🥖",
      "save on": "🛒",
      kfc: "🍗",
      starbucks: "☕",
      subway: "🥪",
      "tim hortons": "☕",
      "tim horton": "☕",
      pizza: "🍕",
      "a&w": "🍔",
      burger: "🍔",
      chicken: "🍗",
      coffee: "☕",
      sandwich: "🥪",
      bakery: "🥖",
    };

    const lowerName = name.toLowerCase();
    for (const [key, emoji] of Object.entries(emojiMap)) {
      if (lowerName.includes(key)) return emoji;
    }
    return "🍽️";
  };

  // Generate Google Maps URL using lat/lon if available
  const getMapUrl = () => {
    if (restaurant.lat && restaurant.lon) {
      return `https://www.google.com/maps?q=${restaurant.lat},${restaurant.lon}`;
    } else if (restaurant.address) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address)}`;
    }
    return "#";
  };

  return (
    <div className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 
                    rounded-xl px-4 py-3 transition-all border border-gray-200">
      <div className="flex items-center gap-3 flex-1">
        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl shadow-sm">
          {getRestaurantEmoji(restaurant.name)}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-800">{restaurant.name}</p>

          {/* Address */}
          <div className="flex items-center gap-1 mt-1">
            <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-xs text-gray-500">{restaurant.address || "Address not available"}</p>
          </div>

          {/* Food Type */}
          {restaurant.food_type && (
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs">🍽️</span>
              <p className="text-xs text-gray-600">{restaurant.food_type}</p>
            </div>
          )}

          {/* Tokens Left */}
          <div className="flex items-center gap-1 mt-1">
            <span className="text-amber-500">⭐</span>
            <p className="text-xs text-gray-600 font-medium">
              {restaurant.tokens_left} {restaurant.tokens_left === 1 ? 'serving' : 'servings'} left
            </p>
          </div>
        </div>
      </div>

      <a
        href={getMapUrl()}
        target="_blank"
        rel="noreferrer"
        className="px-5 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm 
                   bg-[#6ECF68] text-white hover:bg-[#5BBA58]"
      >
        VIEW
      </a>
    </div>
  );
}