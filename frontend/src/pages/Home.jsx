import { useState, useEffect } from "react";
import BottomNav from "../components/BottomNav";
import { apiRequest } from "../api";
import { useNavigate } from "react-router-dom";

const dummyRestaurants = [
  {
    id: 1,
    name: "McDonalds",
    distance: "3933 University Ave NW",
    tokens: 2,
    url: "https://maps.app.goo.gl/1aHmrmqsDPxLFgwA6",
  },
  {
    id: 2,
    name: "COBS Bread",
    distance: "4023 University Ave NW",
    tokens: 2,
    url: "https://maps.app.goo.gl/c9hnPkUkzxST78Gr9",
  },
  {
    id: 3,
    name: "Save On Foods",
    distance: "4163 University Ave NW",
    tokens: 2,
    url: "https://maps.app.goo.gl/t8yEPh4gmR4Vqt6K6",
  },
  {
    id: 4,
    name: "KFC",
    distance: "5012 16 Ave NW",
    tokens: 2,
    url: "https://maps.app.goo.gl/tbCArdZCErFS55gs6",
  },
  {
    id: 5,
    name: "Starbucks",
    distance: "402 Collegiate Blvd NW",
    tokens: 2,
    url: "https://maps.app.goo.gl/UYZmCFYuPw2Esvn67",
  },
  {
    id: 6,
    name: "Subway",
    distance: "85 Bowridge Dr NW",
    tokens: 2,
    url: "https://maps.app.goo.gl/CwnB3zVD7DywUnwa7",
  },
  {
    id: 7,
    name: "Tim Hortons",
    distance: "6428 Bowness Rd NW",
    tokens: 2,
    url: "https://maps.app.goo.gl/9PMzmMxysMdtaDXk7",
  },
  {
    id: 8,
    name: "Pizza Hut",
    distance: "5012 16 Ave NW",
    tokens: 2,
    url: "https://maps.app.goo.gl/iS9kP3TgTomdfpn17",
  },
  {
    id: 9,
    name: "A&W",
    distance: "5120 Shaganappi Trail NW",
    tokens: 2,
    url: "https://maps.app.goo.gl/MumwXLRcedbSDQor5",
  },
];

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userTokens, setUserTokens] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/profile");
  };

  // 🧭 Fetch restaurants and user info from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiRequest("/restaurants");
        setRestaurants(res);

        // get user data from login
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setUserTokens(parsed.tokens || 0);
        }
      } catch (err) {
        console.error("Failed to fetch restaurants:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredRestaurants = dummyRestaurants.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🥡 Claim food (future endpoint)
  const handleClaim = async (restaurantId) => {
    alert(`Claim clicked for restaurant #${restaurantId} (coming soon)`);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#f4fff4] flex justify-center items-center">
        <p className="text-gray-600 text-lg">Loading restaurants...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F4FFF4] flex flex-col pb-20">
      {/* Header Bar */}
      <div className="bg-white shadow-sm px-6 py-4 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <button onClick={handleProfileClick} className="focus:outline-none">
            <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
          </button>
          <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
            <span className="text-2xl">⭐</span>
            <span className="text-lg font-bold text-amber-600">2</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-2xl shadow-md p-4 text-center">
            <div className="text-3xl mb-1">🍱</div>
            <p className="text-2xl font-bold text-[#6ECF68]">62</p>
            <p className="text-xs text-gray-500">Meals Saved</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-4 text-center">
            <div className="text-3xl mb-1">🏪</div>
            <p className="text-2xl font-bold text-[#6ECF68]">15</p>
            <p className="text-xs text-gray-500">Restaurants</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-4 text-center">
            <div className="text-3xl mb-1">📍</div>
            <p className="text-2xl font-bold text-[#6ECF68]">9</p>
            <p className="text-xs text-gray-500">Nearby</p>
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
            {filteredRestaurants.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}

            {filteredRestaurants.length === 0 && (
              <div className="text-center py-8">
                <div className="text-5xl mb-3">🔍</div>
                <p className="text-gray-500">No restaurants found matching "{searchTerm}"</p>
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
      cobs: "🥖",
      "save on": "🛒",
      kfc: "🍗",
      starbucks: "☕",
      subway: "🥪",
      "tim hortons": "☕",
      pizza: "🍕",
      "a&w": "🍔",
    };

    const lowerName = name.toLowerCase();
    for (const [key, emoji] of Object.entries(emojiMap)) {
      if (lowerName.includes(key)) return emoji;
    }
    return "🍽️";
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
          <div className="flex items-center gap-1 mt-1">
            <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-xs text-gray-500">{restaurant.distance}</p>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-amber-500">⭐</span>
            <p className="text-xs text-gray-600 font-medium">{restaurant.tokens} tokens</p>
          </div>
        </div>
      </div>
      <a
        href={restaurant.url}
        target="_blank"
        rel="noreferrer"
        className="bg-[#6ECF68] text-white px-5 py-2 rounded-xl text-sm font-semibold 
                   hover:bg-[#5BBA58] transition-all shadow-sm"
      >
        VIEW
      </a>
    </div>
  );

}
