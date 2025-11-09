import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/RePlate.png";

export default function QRPage() {
  const [qrData, setQrData] = useState(null);
  const [isUsed, setIsUsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🧠 Load claim data from localStorage
  useEffect(() => {
    const claim = localStorage.getItem("claim_data");
    if (claim) {
      const parsed = JSON.parse(claim);
      setQrData(parsed);
      checkClaimStatus(parsed.claim_id);
    } else {
      setLoading(false);
    }
  }, []);

  // 🔍 Check if claim has been verified already
  async function checkClaimStatus(claimId) {
    try {
      const res = await fetch(`http://127.0.0.1:5000/claim-status/${claimId}`);
      const data = await res.json();
      if (data.success && data.verified) {
        setIsUsed(true);
      }
    } catch (err) {
      console.error("Error checking claim status:", err);
    } finally {
      setLoading(false);
    }
  }

  // 🔁 Regenerate new QR by claiming again (if user still has tokens)
  const handleNewClaim = async () => {
    const userId = localStorage.getItem("user_id");
    const restaurantId = qrData?.restaurant_id;
    if (!userId || !restaurantId) {
      alert("Missing user or restaurant info");
      navigate("/home");
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
        localStorage.setItem(
          "claim_data",
          JSON.stringify({
            claim_id: data.claim_id,
            restaurant_id: data.restaurant_id,
            restaurant_name: data.restaurant_name,
            food_type: data.food_type,
            tokens_left: data.tokens_left,
            user_id: data.user_id,
          })
        );
        window.location.reload(); // reload to show new QR
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      alert("⚠️ Server error while creating new claim.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#F4FFF4] text-gray-600">
        Checking claim status...
      </div>
    );
  }

  if (!qrData) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#F4FFF4] text-gray-600">
        <p>No claim found.</p>
        <button
          onClick={() => navigate("/home")}
          className="mt-4 px-4 py-2 bg-[#6ECF68] text-white rounded-xl"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4FFF4] flex justify-center items-center p-4">
      <div className="w-full max-w-md px-6 py-8 bg-white rounded-2xl shadow-md">
        <div className="flex flex-col items-center space-y-2 mb-6">
          <img src={logo} alt="RePlate Logo" className="w-65 h-40" />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
          {isUsed ? "QR Already Used" : "Your Claim QR Code"}
        </h2>
        <p className="text-sm text-gray-600 text-center mb-8">
          {isUsed
            ? "This QR has already been redeemed at the restaurant."
            : "Show this QR at the restaurant to redeem your food."}
        </p>

        {/* ✅ Show QR if still valid */}
        {!isUsed ? (
          <div className="flex flex-col items-center space-y-6">
            <div className="bg-white p-6 rounded-xl border-4 border-[#6ECF68]">
              {console.log("QR data being encoded:", qrData)}
              <QRCodeSVG
                id="qr-code"
                value={JSON.stringify(qrData)}
                size={256}
                level="H"
                fgColor="#000000"
                bgColor="#ffffff"
              />
            </div>

            <div className="w-full bg-gray-50 p-4 rounded-xl">
              <p className="text-xs text-gray-500 text-center mb-1">
                Claim Information
              </p>
              <p className="text-sm font-mono font-semibold text-center text-gray-800 break-all">
                Claim ID: {qrData.claim_id}
                <br />
                User ID: {qrData.user_id}
                <br />
                Restaurant ID: {qrData.restaurant_id}
              </p>
            </div>

            <Link to="/home">
              <button className="w-full bg-[#6ECF68] text-white font-semibold rounded-xl py-3 hover:bg-[#5BBA58] transition-all">
                Back to Dashboard
              </button>
            </Link>
          </div>
        ) : (
          // ❌ QR already used
          <div className="flex flex-col items-center space-y-4">
            <div className="w-full bg-gray-50 p-4 rounded-xl text-center">
              <p className="text-sm text-gray-700 mb-2">
                You’ve already used this QR.
              </p>
              <p className="text-sm text-gray-500">
                You can generate a new one if you still have tokens.
              </p>
            </div>

            <button
              onClick={handleNewClaim}
              className="w-full bg-[#6ECF68] text-white font-semibold rounded-xl py-3 hover:bg-[#5BBA58] transition-all"
            >
              {" "}
              Generate New QR{" "}
            </button>

            <Link to="/home">
              <button className="w-full bg-gray-200 text-gray-800 font-semibold rounded-xl py-3 hover:bg-gray-300 transition-all">
                Back to Dashboard
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
