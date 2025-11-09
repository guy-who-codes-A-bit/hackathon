import { useState } from "react";
import BottomNav from "../components/BottomNav";

const dummyRestaurants = [
  { id: 1, name: "McDonalds", distance: "3933 University Ave NW", tokens: 2, url: "https://maps.app.goo.gl/1aHmrmqsDPxLFgwA6" },
  { id: 2, name: "COBS Bread", distance: "4023 University Ave NW", tokens: 2, url: "https://maps.app.goo.gl/c9hnPkUkzxST78Gr9"},
  { id: 3, name: "Save On Foods", distance: "4163 University Ave NW", tokens: 2, url: "https://maps.app.goo.gl/t8yEPh4gmR4Vqt6K6"},
  { id: 4, name: "KFC", distance: "5012 16 Ave NW", tokens: 2, url: "https://maps.app.goo.gl/tbCArdZCErFS55gs6"},
  { id: 5, name: "Starbucks", distance: "402 Collegiate Blvd NW", tokens: 2, url: "https://maps.app.goo.gl/UYZmCFYuPw2Esvn67" },
  { id: 6, name: "Subway", distance: "85 Bowridge Dr NW", tokens: 2, url: "https://maps.app.goo.gl/CwnB3zVD7DywUnwa7"},
  { id: 7, name: "Tim Hortons", distance: "6428 Bowness Rd NW", tokens: 2, url: "https://maps.app.goo.gl/9PMzmMxysMdtaDXk7"},
  { id: 8, name: "Pizza Hut", distance: "5012 16 Ave NW", tokens: 2, url: "https://maps.app.goo.gl/iS9kP3TgTomdfpn17"},
  { id: 9, name: "A&W", distance: "5120 Shaganappi Trail NW", tokens: 2, url: "https://maps.app.goo.gl/MumwXLRcedbSDQor5"},
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleProfileClick = () => {
    alert("Profile clicked! (connect to backend later)");
  };


  const filteredRestaurants = dummyRestaurants.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    // gray background for outside the phone
    <div className="min-h-screen bg-[#f4fff4] flex justify-center items-center py-4">
      {/* PHONE FRAME (expands on larger screens) */}
      <div className="relative w-full bg-white rounded-3xl shadow-md flex flex-col overflow-hidden max-w-sm h-[90vh] md:max-w-5xl md:h-[85vh] md:rounded-2xl">
        {/* TOP SECTION (non-scrollable) */}
        <div className="p-5 pb-0">
          {/* header */}
          <div className="flex items-center justify-between mb-5">
            <button
              onClick={handleProfileClick}
              className="focus:outline-none"
            >
              <h1 className="text-xl font-medium text-gray-900">Profile</h1>
            </button>

            <div className="flex items-center">
              <span className="text-2xl text-orange-500 mr-1">⭐</span>
              <span className="font-bold text-gray-900 text-2xl">2</span>
            </div>
          </div>
        </div>

        {/* stats */}
        <div className="px-5 pb-5 flex gap-3 md:grid md:grid-cols-3 md:gap-4">
          <div className="flex-1 border border-gray-200 rounded-xl p-3">
            <p className="text-sm text-gray-700">Meals Saved</p>
            <p className="text-2xl font-semibold text-gray-900">62</p>
          </div>
          <div className="flex-1 border border-gray-200 rounded-xl p-3">
            <p className="text-sm text-gray-700">Active Restaurants</p>
            <p className="text-2xl font-semibold text-gray-900">15</p>
          </div>
          <div className="hidden md:block border border-gray-200 rounded-xl p-3">
            <p className="text-sm text-gray-700">Nearby</p>
            <p className="text-2xl font-semibold text-gray-900">8</p>
          </div>
        </div>

        {/* search */}
        <div className="px-5 pb-3">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 border border-gray-300 rounded-lg text-sm px-4 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* SCROLLABLE LIST */}
        <div className="flex-1 overflow-y-auto px-5 pb-24 md:pb-6">
          <div className="border border-gray-200 rounded-2xl p-4 space-y-3 md:space-y-0 md:grid md:grid-cols-2 md:gap-3">
            {filteredRestaurants.map((r) => (
              <div
                key={r.id}
                className="flex justify-between items-center py-2 border-b last:border-b-0 border-gray-100 md:border md:rounded-xl md:p-4 md:shadow-sm md:border-gray-200 md:gap-4 md:border-b-0"
              >
                <div>
                  <p className="font-semibold text-gray-900">{r.name}</p>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <span className="text-green-500 mr-1">📍</span>
                    <p>{r.distance}</p>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="text-orange-500 mr-1">⭐</span>
                    <p>{r.tokens} tokens available</p>
                  </div>
                </div>

                <a
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-green-500 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-green-600 transition min-w-[80px] text-center"
                >
                  VIEW
                </a>
              </div>
            ))}

            {filteredRestaurants.length === 0 && (
              <p className="text-center text-gray-500 py-4 col-span-full">
                No restaurants found matching “{searchTerm}”
              </p>
            )}
          </div>
        </div>

        {/* BOTTOM NAV INSIDE PHONE */}
        <BottomNav />
      </div>
    </div>
  );
}