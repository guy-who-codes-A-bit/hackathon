import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function RestaurantScanner() {
  const [result, setResult] = useState("");
  const qrRef = useRef(null); // 👈 reference to the div

  useEffect(() => {
    if (!qrRef.current) return; // wait until div is mounted

    const scanner = new Html5QrcodeScanner(
      qrRef.current.id, // 👈 use the ID from the actual element
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(
      async (decodedText) => {
        console.log("📸 Scanned QR:", decodedText);

        let payload;
        try {
          payload = JSON.parse(decodedText);
        } catch {
          setResult("⚠️ Invalid QR format");
          await scanner.clear();
          return;
        }

        if (!payload.claim_id) {
          setResult("⚠️ Missing claim ID in QR");
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
            setResult(`✅ Verified claim #${payload.claim_id}`);
          } else {
            setResult(`❌ ${verify.message}`);
          }

          await scanner.clear();
        } catch (err) {
          console.error("Error verifying claim:", err);
          setResult("⚠️ Server or network error");
          await scanner.clear();
        }
      },
      (error) => {
        // Ignore repeated scan errors
      }
    );

    return () => {
      // Clean up when leaving
      scanner.clear().catch(() => {});
      qrRef.current?.remove();
    };
  }, [qrRef]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4FFF4]">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Scan User QR Code
      </h1>
      <p className="text-gray-600 mb-4">
        Hold a user's QR code in front of the camera
      </p>

      {/* 👇 Attach a ref instead of relying on querySelector */}
      <div
        ref={qrRef}
        id="qr-reader"
        className="w-[300px] h-[300px] border border-gray-300 rounded-xl"
      />

      {result && (
        <p className="mt-4 text-sm font-semibold text-gray-800">{result}</p>
      )}
    </div>
  );
}
