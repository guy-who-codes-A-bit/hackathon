
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Link } from "react-router-dom";
import logo from "../assets/RePlate.png";

export default function QRPage() {

  const [qrData, setQrData] = useState("");
  const [showQR, setShowQR] = useState(false);

  // Generate unique QR data and show QR code
  const generateQR = () => {
    // Generate unique code based on timestamp + random string
    const uniqueCode = `REPLATE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setQrData(uniqueCode);
    setShowQR(true);
  };

  // Handle QR code download
  const downloadQR = () => {
    const svg = document.getElementById("qr-code");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.download = "replate-qr-code.png";
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };
  return (
    <div className="min-h-screen bg-[#F4FFF4] flex justify-center items-center p-4">
      <div className="w-full max-w-md px-6 py-8 bg-white rounded-2xl shadow-md">
        {/* Logo */}
        <div className="flex flex-col items-center space-y-2 mb-6">
          <img src={logo} alt="RePlate Logo" className="w-65 h-40" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
          Scan QR Code
        </h2>
        <p className="text-sm text-gray-600 text-center mb-8">
          {showQR
            ? "Show this QR code at the restaurant to claim your food"
            : "Generate a QR code to pick up your order"
          }
        </p>

        {/* QR Code Display */}
        {showQR ? (
          <div className="flex flex-col items-center space-y-6">
            {/* QR Code */}
            <div className="bg-white p-6 rounded-xl border-4 border-[#6ECF68]">
              <QRCodeSVG
                id="qr-code"
                value={qrData}
                size={256}
                level="H"
                fgColor="#000000"
                bgColor="#ffffff"
              />
            </div>

            {/* QR Code Info */}
            <div className="w-full bg-gray-50 p-4 rounded-xl">
              <p className="text-xs text-gray-500 text-center mb-1">Order Code</p>
              <p className="text-sm font-mono font-semibold text-center text-gray-800 break-all">
                {qrData}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="w-full space-y-3">

              <Link to="/home">
                <button
                  className="w-full bg-[#6ECF68] text-white font-semibold rounded-xl py-3 
                             hover:bg-[#5BBA58] transition-all"
                >
                  Back to Dashboard
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Generate Button */}
            <button
              onClick={generateQR}
              className="w-full bg-[#6ECF68] text-white font-semibold rounded-xl py-4 
                         hover:bg-[#5BBA58] transition-all text-lg"
            >
              Generate QR Code
            </button>

            {/* Back Link */}
            <Link to="/home">
              <button
                className="w-full bg-[#6ECF68] text-white font-semibold rounded-xl py-4 
                         hover:bg-[#5BBA58] transition-all text-lg"
              >
                Back to Dashboard
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

