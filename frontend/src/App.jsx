// frontend/src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import QRPage from "./pages/QRPage";
import ForgetPassword from "./pages/ForgotPassword";

function App() {
  return (
    <BrowserRouter>
      {/* app background */}
      <div className="min-h-screen bg-green-300">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/qrpage" element={<QRPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgetpassword" element={<ForgetPassword />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
