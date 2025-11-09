import { Link } from "react-router-dom";
import { useState } from "react";
import { apiRequest } from "../api";
import logo from "../assets/RePlate.png";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1=email, 2=code, 3=new password, 4=success
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Helper: combine 3 code boxes into one string
  const combinedCode = code.join("");

  const handleCodeChange = (index, value) => {
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value.toUpperCase();
      setCode(newCode);
      if (value && index < 2) {
        document.getElementById(`code-${index + 1}`)?.focus();
      }
    }
  };

  // 1️⃣ Send reset email
  const handleSendReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiRequest("/forgot-password", "POST", { email });
      if (res.success) {
        alert("✅ Verification code sent to your email!");
        setStep(2);
      } else {
        alert("❌ " + res.message);
      }
    } catch {
      alert("⚠️ Server error while sending email.");
    } finally {
      setLoading(false);
    }
  };

  // 2️⃣ Verify code
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (combinedCode.length !== 3) {
      alert("Please enter all 3 code characters.");
      return;
    }
    setLoading(true);
    try {
      const res = await apiRequest("/verify-code", "POST", {
        email,
        code: combinedCode,
      });
      if (res.success) {
        alert("✅ Code verified!");
        setStep(3);
      } else {
        alert("❌ " + res.message);
      }
    } catch {
      alert("⚠️ Server error verifying code.");
    } finally {
      setLoading(false);
    }
  };

  // 3️⃣ Update password
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("❌ Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await apiRequest("/reset-password", "POST", {
        email,
        password,
      });
      if (res.success) {
        alert("✅ Password updated successfully!");
        setStep(4);
      } else {
        alert("❌ " + res.message);
      }
    } catch {
      alert("⚠️ Server error updating password.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Step 1: Enter Email
  if (step === 1)
    return (
      <div className="min-h-screen bg-[#F4FFF4] flex justify-center items-center">
        <div className="w-full max-w-sm px-6 py-8 bg-white rounded-2xl shadow-md">
          <div className="flex flex-col items-center space-y-2 mb-6">
            <img src={logo} alt="RePlate Logo" className="w-65 h-40" />
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Forgot password
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Please enter your email to reset your password
          </p>

          <form onSubmit={handleSendReset} className="space-y-5">
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-800">
                Your Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 
                           focus:ring-2 focus:ring-green-400 focus:outline-none text-gray-700"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                loading ? "bg-gray-400" : "bg-[#6ECF68] hover:bg-[#5BBA58]"
              } text-white font-semibold rounded-xl py-3 transition-all`}
            >
              {loading ? "Sending..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    );

  // ✅ Step 2: Verify Code
  if (step === 2)
    return (
      <div className="min-h-screen bg-[#F4FFF4] flex justify-center items-center">
        <div className="w-full max-w-sm px-6 py-8 bg-white rounded-2xl shadow-md">
          <div className="flex flex-col items-center space-y-2 mb-6">
            <img src={logo} alt="RePlate Logo" className="w-65 h-40" />
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Check your email
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            We sent a reset code to{" "}
            <span className="font-semibold">{email}</span>. Enter it below.
          </p>

          <form onSubmit={handleVerifyCode} className="space-y-5">
            <div className="flex justify-center gap-3 mb-4">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  className="w-14 h-14 text-center text-2xl font-semibold border-2 border-gray-300 
                             rounded-xl focus:ring-2 focus:ring-green-400 focus:outline-none 
                             focus:border-green-400 uppercase"
                  required
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                loading ? "bg-gray-400" : "bg-[#6ECF68] hover:bg-[#5BBA58]"
              } text-white font-semibold rounded-xl py-3 transition-all`}
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>

            <div className="text-center text-sm text-gray-600">
              Didn’t get the email?{" "}
              <button
                type="button"
                onClick={() => handleSendReset(new Event("resend"))}
                className="text-blue-600 hover:underline font-medium"
              >
                Resend
              </button>
            </div>
          </form>
        </div>
      </div>
    );

  // ✅ Step 3: Set New Password
  if (step === 3)
    return (
      <div className="min-h-screen bg-[#F4FFF4] flex justify-center items-center">
        <div className="w-full max-w-sm px-6 py-8 bg-white rounded-2xl shadow-md">
          <div className="flex flex-col items-center space-y-2 mb-6">
            <img src={logo} alt="RePlate Logo" className="w-65 h-40" />
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Set a new password
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Create a new password that’s different from previous ones.
          </p>

          <form onSubmit={handleUpdatePassword} className="space-y-5">
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-800">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 
                           focus:ring-2 focus:ring-green-400 focus:outline-none text-gray-700"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-800">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 
                           focus:ring-2 focus:ring-green-400 focus:outline-none text-gray-700"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                loading ? "bg-gray-400" : "bg-[#6ECF68] hover:bg-[#5BBA58]"
              } text-white font-semibold rounded-xl py-3 transition-all`}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    );

  // ✅ Step 4: Success
  if (step === 4)
    return (
      <div className="min-h-screen bg-[#F4FFF4] flex justify-center items-center">
        <div className="w-full max-w-sm px-6 py-8 bg-white rounded-2xl shadow-md text-center">
          <div className="flex flex-col items-center space-y-2 mb-6">
            <img src={logo} alt="RePlate Logo" className="w-65 h-40" />
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-2">Success!</h2>
          <p className="text-sm text-gray-600 mb-6">
            Your password has been reset successfully.
          </p>

          <Link to="/login">
            <button className="w-full bg-[#6ECF68] text-white font-semibold rounded-xl py-3 hover:bg-[#5BBA58] transition-all">
              Continue to Login
            </button>
          </Link>
        </div>
      </div>
    );

  return null;
}
