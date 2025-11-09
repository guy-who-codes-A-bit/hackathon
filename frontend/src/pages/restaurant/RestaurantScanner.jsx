import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import logo from "../../assets/RePlate.png";

export default function RestaurantScanner() {
  const [status, setStatus] = useState("ready"); // ready | scanning | success | error
  const [message, setMessage] = useState("");
  const qrRef = useRef(null);

  useEffect(() => {
    if (!qrRef.current) return;

    const scanner = new Html5QrcodeScanner(
      qrRef.current.id,
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(
      async (decodedText) => {
        console.log("📸 Scanned QR:", decodedText);
        setStatus("scanning");
        setMessage("Verifying claim...");

        let payload;
        try {
          payload = JSON.parse(decodedText);
        } catch {
          setStatus("error");
          setMessage("⚠️ Invalid QR format (not JSON)");
          await scanner.clear();
          return;
        }

        const claimId = payload?.claim_id;
        if (!claimId) {
          setStatus("error");
          setMessage("⚠️ Missing claim ID in QR");
          await scanner.clear();
          return;
        }

        try {
          const res = await fetch("http://127.0.0.1:5000/verify-claim", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ claim_id: claimId }),
          });
          const data = await res.json();

          if (data.success) {
            setStatus("success");
            setMessage(`✅ Claim #${claimId} verified for ${data.user.name}`);
          } else {
            setStatus("error");
            setMessage(`❌ ${data.message}`);
          }
        } catch (err) {
          console.error(err);
          setStatus("error");
          setMessage("⚠️ Network or server error");
        } finally {
          await scanner.clear();
        }
      },
      (err) => console.log("Scanner error:", err)
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4FFF4] p-4">
      <img src={logo} alt="RePlate Logo" className="w-40 mb-3" />
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Scan User QR Code
      </h1>
      <p className="text-gray-600 mb-6 text-center">
        Hold a customer’s QR code in front of your camera
      </p>

      <div
        ref={qrRef}
        id="qr-reader"
        className="w-[320px] h-[320px] border-4 border-[#6ECF68] rounded-2xl overflow-hidden shadow-lg"
      />

      {status !== "ready" && (
        <div className="mt-6 flex flex-col items-center gap-2 bg-white p-4 rounded-xl shadow-md w-full max-w-xs">
          {status === "scanning" && (
            <Loader2 className="animate-spin text-gray-500 w-8 h-8" />
          )}
          {status === "success" && (
            <CheckCircle2 className="text-green-600 w-8 h-8" />
          )}
          {status === "error" && <XCircle className="text-red-500 w-8 h-8" />}
          <p className="text-gray-700 text-sm text-center">{message}</p>
        </div>
      )}
    </div>
  );
}
