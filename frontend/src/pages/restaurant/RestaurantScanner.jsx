import { useState } from "react";
import { QrReader } from "react-qr-reader";

export default function RestaurantScanner() {
  const [status, setStatus] = useState(null);

  const handleScan = async (result) => {
    if (!result?.text) return;

    try {
      const qrData = JSON.parse(result.text);
      const claim_id = qrData.claim_id;

      const res = await fetch("http://127.0.0.1:5000/verify-claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claim_id }),
      });

      const data = await res.json();
      setStatus(data.success ? "✅ Claim verified!" : "❌ " + data.message);
    } catch (err) {
      console.error("Scan error:", err);
      setStatus("⚠️ Invalid QR code.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#F4FFF4] p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Scan User QR Code
      </h2>

      <div className="bg-white p-4 rounded-2xl shadow-md w-full max-w-md">
        <QrReader
          constraints={{ facingMode: "environment" }}
          onResult={(result, error) => {
            if (!!result) handleScan(result);
          }}
          className="w-full h-64 rounded-xl overflow-hidden"
        />
      </div>

      {status && (
        <p className="mt-4 text-lg font-semibold text-gray-700">{status}</p>
      )}
    </div>
  );
}
