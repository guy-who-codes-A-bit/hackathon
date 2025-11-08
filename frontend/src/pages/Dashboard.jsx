// frontend/src/pages/Dashboard.jsx
import MapView from "../components/MapView";
import AIBox from "../components/AIBox";

export default function Dashboard() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r shadow-md p-4 overflow-y-auto">
        <h2 className="text-2xl font-bold text-green-700 mb-3">
          Available Restaurants
        </h2>
        <input
          type="text"
          placeholder="Search restaurants..."
          className="w-full mb-4 p-2 border rounded focus:ring-2 focus:ring-green-400 outline-none"
        />
        <ul className="space-y-3 text-sm">
          <li>🍝 The Green Spoon – 6 tokens</li>
          <li>🍣 Sushi Corner – 4 tokens</li>
        </ul>
      </aside>

      {/* Map */}
      <main className="flex-1 relative">
        <MapView />
      </main>

      {/* ✅ AI Assistant box */}
      <AIBox />
    </div>
  );
}
