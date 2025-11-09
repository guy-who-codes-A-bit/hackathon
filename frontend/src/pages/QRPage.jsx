import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Link, useNavigate } from "react-router-dom";
import { QrCode, Loader2, XCircle, ArrowLeft } from "lucide-react";
import logo from "../assets/RePlate.png";

export default function QRPage() {
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const claim = localStorage.getItem("claim_data");
    if (claim) {
      try {
        const parsed = JSON.parse(claim);
        if (parsed.claim_id && parsed.user_id) {
          setQrData(parsed);
        }
      } catch (err) {
        console.error("Invalid claim data:", err);
      }
    }
    setLoading(false);
  }, []);

  const handleGoBack = () => {
    navigate("/map"); // or /home depending on your flow
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4FFF4]">
        <Loader2 className="animate-spin w-8 h-8 text-green-600" />
        <p className="ml-2 text-gray-700">Loading QR...</p>
      </div>
    );

  if (!qrData || !qrData.claim_id) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#F4FFF4] px-4">
        <XCircle className="text-red-500 w-10 h-10 mb-2" />
        <p className="text-gray-700 text-center mb-4">
          ⚠️ No valid claim found.
        </p>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Please claim food first before scanning.
        </p>
        <button
          onClick={() => navigate("/map")}
          className="bg-[#6ECF68] text-white px-6 py-2 rounded-lg hover:bg-[#5BBA58] transition-all"
        >
          Go to Map
        </button>
      </div>
    );
  }

  const encoded = JSON.stringify({
    claim_id: qrData.claim_id,
    user_id: qrData.user_id,
    restaurant_id: qrData.restaurant_id,
  });

  return (
    <div className="min-h-screen bg-[#F4FFF4] flex flex-col justify-center items-center p-6">
      <img src={logo} alt="RePlate Logo" className="w-32 mb-6" />

      <h2 className="text-2xl font-bold text-gray-800 mb-1 flex items-center gap-2">
        <QrCode className="text-green-600 w-6 h-6" /> Your RePlate QR
      </h2>
      <p className="text-sm text-gray-600 mb-6 text-center max-w-xs">
        Show this QR at the restaurant to verify your claim.
      </p>

      <div className="p-4 bg-white border-4 border-[#6ECF68] rounded-xl shadow-md">
        <QRCodeSVG value={encoded} size={240} level="H" />
      </div>

      {/*<p className="text-xs text-gray-500 mt-4 break-all px-4 text-center">*/}
      {/*  {encoded}*/}
      {/*</p>*/}

      <div className="flex gap-4 mt-6">
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <Link
          to="/home"
          className="bg-[#6ECF68] text-white px-4 py-2 rounded-lg hover:bg-[#5BBA58] transition"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
