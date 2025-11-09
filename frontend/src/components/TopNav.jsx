// frontend/src/components/TopNav.jsx
export default function TopNav() {
  return (
    <header className="hidden md:flex items-center justify-between px-10 py-4 bg-white shadow-sm">
      <h1 className="text-xl font-bold text-gray-900">CityBite</h1>
      <nav className="flex gap-6 text-sm text-gray-600">
        <a href="/" className="hover:text-gray-900">Home</a>
        <a href="/maps" className="hover:text-gray-900">Maps</a>
        <a href="/dashboard" className="hover:text-gray-900">Dashboard</a>
      </nav>
      <button className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600">
        Profile
      </button>
    </header>
  );
}
