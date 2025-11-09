import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/RePlate.png";

export default function QRPage() {
  const [qrData, setQrData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const claim = localStorage.getItem("claim_data");
    if (claim) setQrData(JSON.parse(claim));
  }, []);

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
          Your Claim QR Code
        </h2>
        <p className="text-sm text-gray-600 text-center mb-8">
          Show this QR at the restaurant to redeem your food
        </p>

        <div className="flex flex-col items-center space-y-6">
          <div className="bg-white p-6 rounded-xl border-4 border-[#6ECF68]">
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
            <p className="text-xs text-gray-500 text-center mb-1">Claim Info</p>
            <p className="text-sm font-mono font-semibold text-center text-gray-800 break-all">
              Claim ID: {qrData.claim_id} <br />
              Food ID: {qrData.food_id} <br />
              User ID: {qrData.user_id}
            </p>
          </div>

          <Link to="/home">
            <button className="w-full bg-[#6ECF68] text-white font-semibold rounded-xl py-3 hover:bg-[#5BBA58] transition-all">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
