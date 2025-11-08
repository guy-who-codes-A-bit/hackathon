import "mapbox-gl/dist/mapbox-gl.css";
import { Map, Marker, Popup } from "react-map-gl";
import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import QRCode from "react-qr-code";

export default function MapView() {
  const [restaurants, setRestaurants] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch data from Flask backend
  useEffect(() => {
    fetch("http://127.0.0.1:5000/restaurants")
      .then((res) => res.json())
      .then((data) => {
        setRestaurants(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching restaurants:", err);
        setLoading(false);
      });
  }, []);

  const handleClaim = async (id) => {
    try {
      const res = await fetch("http://127.0.0.1:5000/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurant_id: id }),
      });
      const result = await res.json();

      if (result.success) {
        alert(`✅ ${result.message}! Tokens left: ${result.remaining}`);
        setRestaurants((prev) =>
          prev.map((r) =>
            r.id === id ? { ...r, tokens_left: result.remaining } : r
          )
        );
        setShowQR(true);
      } else {
        alert("❌ Food unavailable or already claimed.");
      }
    } catch (err) {
      console.error("Error claiming food:", err);
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading map...</div>;
  }

  return (
    <div className="w-full h-full">
      <Map
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        initialViewState={{
          latitude: 51.0447,
          longitude: -114.0719,
          zoom: 12,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
      >
        {restaurants.map((r) => (
          <Marker key={r.id} latitude={r.lat} longitude={r.lon} anchor="bottom">
            <button onClick={() => setSelected(r)}>
              <MapPin
                size={28}
                className="text-red-600 hover:scale-125 transition-transform"
              />
            </button>
          </Marker>
        ))}

        {selected && (
          <Popup
            latitude={selected.lat}
            longitude={selected.lon}
            closeOnClick={false}
            onClose={() => {
              setSelected(null);
              setShowQR(false);
            }}
            anchor="top"
          >
            <div className="p-2 text-sm max-w-[200px]">
              <h3 className="font-bold text-green-700">{selected.name}</h3>
              <p>{selected.food}</p>
              <p className="text-green-600 font-semibold">
                {selected.tokens_left} tokens left
              </p>
              <button
                className="mt-2 w-full px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={() => handleClaim(selected.id)}
              >
                Claim Food
              </button>
              {showQR && (
                <div className="mt-3 bg-white p-2 rounded">
                  <QRCode value={`Claim-${selected.name}`} size={80} />
                </div>
              )}
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
