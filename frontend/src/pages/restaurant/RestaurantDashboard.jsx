import { useEffect, useState } from "react";
import { QrCode, UtensilsCrossed, RefreshCw, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";
import logo from "../../assets/RePlate.png";

export default function RestaurantDashboard() {
  const [restaurant, setRestaurant] = useState(null);
  const [foodType, setFoodType] = useState("");
  const [tokensLeft, setTokensLeft] = useState(0);
  const [scannerVisible, setScannerVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const restaurantId = localStorage.getItem("restaurant_id");

  // ✅ Fetch restaurant info
  const fetchRestaurant = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/restaurants");
      const data = await res.json();

      // ✅ Access the restaurant list correctly
      const restaurantsList = data.restaurants || [];
      console.log("Fetched restaurants:", restaurantsList);

      const current = restaurantsList.find(
        (r) => String(r.id) === String(restaurantId)
      );

      if (current) {
        setRestaurant(current);
        setFoodType(current.food_type || "");
        setTokensLeft(current.tokens_left || 0);
      } else {
        console.warn("Restaurant not found in list");
        setStatus("⚠️ Restaurant not found");
      }
    } catch (err) {
      console.error("Error fetching restaurant:", err);
      setStatus("⚠️ Failed to load restaurant info");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurant();
  }, [restaurantId]);

  // ✅ Update offer (food type + tokens)
  const handleUpdateOffer = async () => {
    if (!foodType.trim()) {
      setStatus("Please enter a valid food type.");
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
        fetchRestaurant(); // Refresh the display
      } else {
        setStatus(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error("Error updating offer:", err);
      setStatus("⚠️ Server error. Try again later.");
    }
  };

  // ✅ QR Scanner setup
  useEffect(() => {
    if (!scannerVisible) return;

    const divId = "qr-reader";
    const scanner = new Html5QrcodeScanner(
      divId,
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(async (decodedText) => {
      console.log("📸 Scanned QR:", decodedText);

      let payload;
      try {
        payload = JSON.parse(decodedText);
      } catch {
        setStatus("⚠️ Invalid QR format");
        await scanner.clear();
        return;
      }

      if (!payload.claim_id) {
        setStatus("⚠️ Missing claim ID in QR");
        await scanner.clear();
        return;
      }

      try {
        const res = await fetch("http://127.0.0.1:5000/verify-claim", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ claim_id: payload.claim_id }),
        });

        const verify = await res.json();
        console.log("🔍 Verification Response:", verify);

        if (verify.success) {
          setStatus(`✅ Verified claim #${payload.claim_id}`);
        } else {
          setStatus(`❌ ${verify.message}`);
        }

        await scanner.clear();
        setScannerVisible(false);
      } catch (err) {
        console.error("Error verifying claim:", err);
        setStatus("⚠️ Server or network error");
        await scanner.clear();
      }
    });

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [scannerVisible]);

  // ✅ Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4FFF4]">
        <Loader2 className="animate-spin text-gray-500 w-8 h-8" />
      </div>
    );
  }

  // ✅ No restaurant case
  if (!restaurant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4FFF4]">
        <p className="text-gray-700 mb-3">Restaurant not found.</p>
        <button
          onClick={() => navigate("/restaurant/login")}
          className="bg-[#6ECF68] text-white px-5 py-2 rounded-xl"
        >
          Go to Login
        </button>
      </div>
    );
  }

  // ✅ Main dashboard UI
  return (
    <div className="min-h-screen bg-[#F4FFF4] flex flex-col items-center py-6 px-4">
      {/* Header */}
      <img src={logo} alt="RePlate" className="w-36 mb-3" />
      <h1 className="text-2xl font-bold text-gray-800 mb-1">
        {restaurant.name}
      </h1>
      <p className="text-gray-600 mb-6 text-sm">{restaurant.address}</p>

      {/* Offer Editor */}
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
        <div className="flex items-center gap-2 mb-4">
          <UtensilsCrossed className="text-[#6ECF68]" />
          <h2 className="font-semibold text-lg text-gray-800">Today’s Offer</h2>
        </div>

        <label className="block mb-2 text-sm font-medium text-gray-600">
          Food Type
        </label>
        <input
          type="text"
          value={foodType}
          onChange={(e) => setFoodType(e.target.value)}
          placeholder="e.g. Chicken Sandwiches"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-[#6ECF68]"
        />

        <label className="block mb-2 text-sm font-medium text-gray-600">
          Servings Left
        </label>
        <input
          type="number"
          value={tokensLeft}
          onChange={(e) => setTokensLeft(Number(e.target.value))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-6 focus:ring-2 focus:ring-[#6ECF68]"
        />

        <button
          onClick={handleUpdateOffer}
          className="w-full flex items-center justify-center gap-2 bg-[#6ECF68] hover:bg-[#5ABA58] text-white font-semibold py-2.5 rounded-xl transition"
        >
          <RefreshCw className="w-4 h-4" /> Update Offer
        </button>
      </div>

      {/* QR Scanner */}
      <div className="mt-8 w-full max-w-md flex flex-col items-center">
        <button
          onClick={() => setScannerVisible(true)}
          className="flex items-center gap-2 bg-[#6ECF68] hover:bg-[#5ABA58] text-white font-semibold py-2.5 px-6 rounded-xl shadow-md transition"
        >
          <QrCode className="w-4 h-4" /> Scan Claim QR
        </button>

        {scannerVisible && (
          <div
            id="qr-reader"
            className="mt-5 w-[300px] h-[300px] border-4 border-[#6ECF68] rounded-2xl overflow-hidden shadow-lg"
          />
        )}
      </div>

      {/* Status Message */}
      {status && (
        <p className="mt-6 text-center text-sm font-medium text-gray-700 bg-white px-4 py-2 rounded-lg shadow-md">
          {status}
        </p>
      )}
    </div>
  );
}
