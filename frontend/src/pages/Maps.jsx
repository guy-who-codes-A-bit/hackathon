// frontend/src/pages/MapPage.jsx
import MapView from "../components/MapView";

export default function Maps() {
  return (
    <div className="w-full h-screen relative bg-gray-50">
      {/* Optional header bar */}
      <header className="absolute top-0 left-0 right-0 z-20 p-4 flex items-center justify-between bg-white/70 backdrop-blur-md border-b">
        <h1 className="text-xl font-bold text-green-700 tracking-tight">
          🍴 RePlate Map
        </h1>
        <nav className="flex gap-3">
          <a
            href="/home"
            className="text-m pt-1 text-green-600 hover:text-green-800 transition-colors"
          >
            Home
          </a>
          <a
            href="/profile"
            className="text-m pt-1 text-green-600 hover:text-green-800 transition-colors"
          >
            Profile
          </a>
        </nav>
      </header>

      {/* Main 3D Map */}
      <div className="absolute inset-0">
        <MapView />
      </div>
    </div>
  );
}
