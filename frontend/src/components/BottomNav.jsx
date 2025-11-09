import { Link, useLocation } from "react-router-dom";
import { IoQrCodeOutline, IoHomeOutline, IoMapOutline } from 'react-icons/io5';

export default function BottomNav() {
  const location = useLocation();
  const current = location.pathname; // e.g. "/", "/maps"

  // This function checks if the current URL path matches the link's path
  const isActive = (path) => current === path || (current === "/" && path === "/");

  return (
    <div className="fixed bottom-0 w-full max-w-sm bg-white border-t border-gray-200 flex justify-around py-2 left-1/2 -translate-x-1/2 z-10 rounded-t-3xl shadow-lg">
      
      {/* Home Link */}
      <Link
        to="/Home"
        className={`flex flex-col items-center text-xs pt-1 transition-colors duration-200 ${
          // Highlight Home if active
          isActive("/Home") ? "text-green-600 font-bold" : "text-gray-900 font-medium"
        }`}
      >
        <IoHomeOutline className="text-2xl mb-1" />
        <span className="text-sm">Home</span>
      </Link>

      {/* Scan (Center QR Code) */}
      <Link
        to="/scan"
        className={`flex flex-col items-center -mt-8 ${
          // The scan button is always visually prominent, but we'll apply
          // a subtle highlight to its text if it's the active page.
          isActive("/scan") ? "text-green-600 font-bold" : "text-gray-900 font-medium"
        }`}
      >
        {/* The icon container is designed to float above the nav bar */}
        <div className="w-16 h-16 bg-white rounded-full shadow-xl flex items-center justify-center border-2 border-gray-200">
            {/* The QR code icon is always green in the design */}
            <IoQrCodeOutline className="text-4xl text-green-500" />
        </div>
        
        <span className="text-sm pt-1">scan</span>
      </Link>

      {/* Maps Link */}
      <Link
        to="/maps"
        className={`flex flex-col items-center text-xs pt-1 transition-colors duration-200 ${
          // Highlight Maps if active
          isActive("/maps") ? "text-green-600 font-bold" : "text-gray-900 font-medium"
        }`}
      >
        <IoMapOutline className="text-2xl mb-1" />
        <span className="text-sm">Maps</span>
      </Link>
    </div>
  );
}