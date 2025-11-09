// frontend/src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import QRPage from "./pages/QRPage";
import ForgetPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Maps from "./pages/Maps";
import EditProfile from "./pages/EditProfile"; //NEW !!!! EDIT PROFILE
import RestaurantSignup from "./pages/restaurant/RestaurantSignup";
import RestaurantLogin from "./pages/restaurant/RestaurantLogin";
import RestaurantDashboard from "./pages/restaurant/RestaurantDashboard";
import RestaurantScanner from "./pages/restaurant/RestaurantScanner";

function App() {
  return (
    <BrowserRouter>
      {/* app background */}
      <div className="min-h-screen bg-green-300">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/qrpage" element={<QRPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/forgetpassword" element={<ForgetPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/maps" element={<Maps />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/restaurant/signup" element={<RestaurantSignup />} />
          <Route path="/restaurant/login" element={<RestaurantLogin />} />
          <Route path="/restaurant/scanner" element={<RestaurantScanner />} />
          <Route
            path="/restaurant/dashboard"
            element={<RestaurantDashboard />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
