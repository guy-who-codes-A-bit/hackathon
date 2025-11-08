import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-500 to-blue-400 text-white text-center px-4">
      <h1 className="text-5xl font-bold mb-4">CityBite 🍱</h1>
      <p className="max-w-md text-lg mb-6">
        Turning restaurant leftovers into community meals.
      </p>

      {/* ✅ This should be the correct Link */}
      <Link to="/dashboard">
        <button className="bg-white text-green-700 px-6 py-3 rounded-full font-semibold hover:bg-green-50 transition">
          Find Food Near Me
        </button>
      </Link>
    </div>
  );
}
