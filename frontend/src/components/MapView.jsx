import "mapbox-gl/dist/mapbox-gl.css";
import {
  Map,
  Marker,
  Popup,
  Source,
  Layer,
  NavigationControl,
} from "react-map-gl";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LocateFixed, ChevronLeft, Search } from "lucide-react";
import BottomNav from "../components/BottomNav";

// Helper: Haversine distance (in km)
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function MapView() {
  const [restaurants, setRestaurants] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [nearby, setNearby] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMarker, setSearchMarker] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const mapRef = useRef(null);
  const navigate = useNavigate();

  // 🧠 Claim food function
  const handleClaim = async (restaurantId) => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      alert("Please log in first.");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:5000/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, restaurant_id: restaurantId }),
      });

      const data = await res.json();

      if (data.success) {
        // ✅ Save claim data safely
        localStorage.setItem(
          "claim_data",
          JSON.stringify({
            claim_id: data.claim_id,
            restaurant_id: data.restaurant.id,
            restaurant_name: data.restaurant.name,
            food_type: data.restaurant.food_type,
            tokens_left: data.restaurant.tokens_left,
            user_id: userId,
          })
        );

        // ✅ Re-fetch restaurants to refresh tokens_left
        fetch("http://127.0.0.1:5000/restaurants")
          .then((res) => res.json())
          .then((updated) => {
            const normalized = (updated.restaurants || []).map((r, i) => ({
              id: r.id ?? i + 1,
              name: r.name || "Unnamed Restaurant",
              food: r.food_type || "Assorted meals",
              lat: r.lat ?? 51.046 + Math.random() * 0.01,
              lon: r.lon ?? -114.07 + Math.random() * 0.01,
              tokens_left: r.tokens_left ?? 0,
              address: r.address || "No address listed",
            }));
            setRestaurants(normalized);
            computeNearby(
              userLocation || searchMarker || { lat: 51.046, lon: -114.07 }
            );
          })
          .catch((err) => console.error("Error refreshing restaurants:", err));

        navigate("/qrpage");
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      console.error("Error claiming food:", err);
      alert("⚠️ Server error while claiming.");
    }
  };

  // 🗺️ Fetch restaurants
  useEffect(() => {
    async function loadRestaurants() {
      try {
        const res = await fetch("http://127.0.0.1:5000/restaurants");
        const data = await res.json();
        const normalized = (data.restaurants || []).map((r, i) => ({
          id: r.id ?? i + 1,
          name: r.name || "Unnamed Restaurant",
          food: r.food_type || "Assorted meals",
          lat: r.lat ?? 51.046 + Math.random() * 0.01,
          lon: r.lon ?? -114.07 + Math.random() * 0.01,
          tokens_left: r.tokens_left ?? 0,
          address: r.address || "No address listed",
        }));
        setRestaurants(normalized);
      } catch (err) {
        console.warn("⚠️ Failed to load restaurants:", err);
      } finally {
        setLoading(false);
      }
    }
    loadRestaurants();

    // 🕒 Optional: auto-refresh every 10s
    const interval = setInterval(loadRestaurants, 10000);
    return () => clearInterval(interval);
  }, []);

  // 📍 Locate user
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        setUserLocation(coords);
        mapRef.current?.flyTo({
          center: [coords.lon, coords.lat],
          zoom: 14.5,
          speed: 1.2,
        });
        computeNearby(coords);
      },
      (err) => {
        console.error("Error getting location:", err);
        alert("Could not get your location.");
      }
    );
  };

  // 🔍 Compute nearest restaurants
  const computeNearby = (coords) => {
    const sorted = restaurants
      .map((r) => ({
        ...r,
        distance: getDistance(coords.lat, coords.lon, r.lat, r.lon),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 4);
    setNearby(sorted);
  };

  if (loading) return <div className="text-center p-8">Loading map...</div>;

  return (
    <div className="relative w-full h-screen">
      {/* MAP */}
      <Map
        ref={mapRef}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        initialViewState={{
          latitude: 51.047,
          longitude: -114.07,
          zoom: 13.5,
          pitch: 25,
        }}
        mapStyle="mapbox://styles/mapbox/light-v11"
        style={{ width: "100%", height: "100%" }}
      >
        <Source
          id="mapbox-dem"
          type="raster-dem"
          url="mapbox://mapbox.mapbox-terrain-dem-v1"
          tileSize={512}
          maxzoom={14}
        />
        <Layer
          id="sky"
          type="sky"
          paint={{
            "sky-type": "atmosphere",
            "sky-atmosphere-sun": [0.0, 0.0],
            "sky-atmosphere-sun-intensity": 15,
          }}
        />
        <NavigationControl position="top-right" />

        {/* Restaurant markers */}
        {restaurants.map((r) => (
          <Marker key={r.id} latitude={r.lat} longitude={r.lon} anchor="bottom">
            <div
              onClick={() => setSelected(r)}
              className="cursor-pointer group relative flex flex-col items-center"
            >
              <div className="w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-lg ring-2 ring-white group-hover:scale-125 transition-transform" />
              <span className="absolute top-6 bg-white text-gray-800 text-xs px-2 py-1 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                {r.name}
              </span>
            </div>
          </Marker>
        ))}

        {/* User marker */}
        {userLocation && (
          <Marker
            latitude={userLocation.lat}
            longitude={userLocation.lon}
            anchor="center"
          >
            <div className="w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-md animate-pulse"></div>
          </Marker>
        )}

        {/* Popup */}
        {selected && (
          <Popup
            latitude={selected.lat}
            longitude={selected.lon}
            closeOnClick={false}
            onClose={() => setSelected(null)}
            anchor="top"
          >
            <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 w-[240px] p-4">
              <button
                onClick={() => setSelected(null)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition"
              >
                ✕
              </button>
              <h3 className="font-semibold text-gray-900 mb-1">
                {selected.name}
              </h3>
              <p className="text-gray-600 mb-1">{selected.food}</p>
              <p className="text-green-600 text-sm font-medium mb-1">
                🍱 {selected.tokens_left} food left
              </p>
              <p className="text-gray-500 text-xs mb-4">
                📍 {selected.address}
              </p>
              <button
                onClick={() => handleClaim(selected.id)}
                className="w-full py-2 bg-[#6ECF68] text-white text-sm rounded-xl hover:bg-[#5BBA58] transition-all"
              >
                Claim Food
              </button>
            </div>
          </Popup>
        )}
      </Map>

      {/* 🧹 Destroy WebGL when leaving */}
      <script>
        {`
          window.addEventListener('beforeunload', () => {
            const mapElement = document.querySelector('.mapboxgl-map');
            if (mapElement && mapElement._map) {
              mapElement._map.remove();
            }
          });
        `}
      </script>

      {/* Locate Me Button */}
      <button
        onClick={handleLocateMe}
        className="absolute bottom-24 right-4 bg-white p-3 rounded-full shadow-lg border border-gray-200 hover:bg-gray-100 transition-all"
        title="Locate Me"
      >
        <LocateFixed className="text-green-600 w-6 h-6" />
      </button>

      {/* Sidebar */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-md p-4 w-64 border border-gray-200">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-gray-800 font-semibold text-sm">
            Nearby Restaurants
          </h2>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-500 hover:text-gray-700"
          >
            <ChevronLeft
              className={`w-5 h-5 transition-transform ${
                sidebarOpen ? "" : "rotate-180"
              }`}
            />
          </button>
        </div>

        {nearby.length > 0 && (
          <ul className="space-y-2 max-h-[60vh] overflow-y-auto">
            {nearby.map((r) => (
              <li
                key={r.id}
                onClick={() => {
                  mapRef.current?.flyTo({
                    center: [r.lon, r.lat],
                    zoom: 15,
                    speed: 1.2,
                  });
                  setSelected(r);
                }}
                className="cursor-pointer border border-gray-100 rounded-lg p-3 hover:bg-green-50 transition"
              >
                <p className="font-semibold text-gray-900">{r.name}</p>
                <p className="text-xs text-gray-600">{r.food}</p>
                <p className="text-xs text-green-600">
                  {r.distance?.toFixed(2)} km away
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
