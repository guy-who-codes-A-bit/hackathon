import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Link, useNavigate } from "react-router-dom";
import { QrCode, Loader2, XCircle } from "lucide-react";
import logo from "../assets/RePlate.png";

export default function QRPage() {
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const claim = localStorage.getItem("claim_data");
    if (claim) {
      setQrData(JSON.parse(claim));
    }
    setLoading(false);
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4FFF4]">
        <p>Loading QR...</p>
      </div>
    );

  if (!qrData || !qrData.claim_id) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#F4FFF4]">
        <p className="text-gray-700 text-center mb-4">
          ⚠️ No valid claim found.
        </p>
        <p className="text-sm text-gray-500">
          Please claim food first before scanning.
        </p>
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
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Your RePlate QR</h2>
      <p className="text-sm text-gray-600 mb-6 text-center">
        Show this QR at the restaurant to verify your claim.
      </p>

      <div className="p-4 bg-white border-4 border-[#6ECF68] rounded-xl shadow-md">
        <QRCodeSVG value={encoded} size={240} level="H" />
      </div>

      {/* Debug text */}
      <p className="text-xs text-gray-500 mt-4 break-all px-4">{encoded}</p>
    </div>
  );
}
