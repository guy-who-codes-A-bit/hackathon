import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/RePlate.png";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: email, 2: verify code, 3: reset password, 4: success
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleCodeChange = (index, value) => {
    if (value.length <= 1) {
      const newCode = [...code]; 
      newCode[index] = value;
      setCode(newCode);

      // Auto-focus next input
      if (value && index < 2) {
        document.getElementById(`code-${index + 1}`)?.focus();
      }
    }
  };

  const handleSendReset = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleVerifyCode = (e) => {
    e.preventDefault();
    setStep(3);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setStep(4);
    }
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    // Handle final password update
    setStep(4);
  };

  // Step 1: Enter Email
  if (step === 1) {
    return (
      <div className="min-h-screen bg-[#F4FFF4] flex justify-center items-center">
        <div className="w-full max-w-sm px-6 py-8 bg-white rounded-2xl shadow-md">
          {/* Logo */}
          <div className="flex flex-col items-center space-y-2 mb-6">
            <img src={logo} alt="RePlate Logo" className="w-20 h-20" />
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-800 mb-2">Forgot password</h2>
          <p className="text-sm text-gray-600 mb-6">
            Please enter your email to reset the password
          </p>

          {/* Form */}
          <form onSubmit={handleSendReset} className="space-y-5">
            {/* Email field */}
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

            {/* Reset Password button */}
            <button
              type="submit"
              className="w-full bg-[#6ECF68] text-white font-semibold rounded-xl py-3 
                         hover:bg-[#5BBA58] transition-all"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Step 2: Check Email / Verify Code
  if (step === 2) {
    return (
      <div className="min-h-screen bg-[#F4FFF4] flex justify-center items-center">
        <div className="w-full max-w-sm px-6 py-8 bg-white rounded-2xl shadow-md">
          {/* Logo */}
          <div className="flex flex-col items-center space-y-2 mb-6">
            <img src={logo} alt="RePlate Logo" className="w-20 h-20" />
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-800 mb-2">Check your email</h2>
          <p className="text-sm text-gray-600 mb-6">
            We sent a reset link to <span className="font-semibold">{email || "contact@dscode.com"}</span>
            <br />
            Please enter digit code sent to your email
          </p>

          {/* Form */}
          <form onSubmit={handleVerifyCode} className="space-y-5">
            {/* Code inputs */}
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
                             focus:border-green-400"
                  required
                />
              ))}
            </div>

            {/* Verify Code button */}
            <button
              type="submit"
              className="w-full bg-[#6ECF68] text-white font-semibold rounded-xl py-3 
                         hover:bg-[#5BBA58] transition-all"
            >
              Verify Code
            </button>

            {/* Resend link */}
            <div className="text-center text-sm text-gray-600">
              Haven't got the email yet?{" "}
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-blue-600 hover:underline font-medium"
              >
                Resend email
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Step 3: Set New Password
  if (step === 3) {
    return (
      <div className="min-h-screen bg-[#F4FFF4] flex justify-center items-center">
        <div className="w-full max-w-sm px-6 py-8 bg-white rounded-2xl shadow-md">
          {/* Logo */}
          <div className="flex flex-col items-center space-y-2 mb-6">
            <img src={logo} alt="RePlate Logo" className="w-20 h-20" />
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-800 mb-2">Set a new password</h2>
          <p className="text-sm text-gray-600 mb-6">
            Create a new password. Ensure it differs from previous ones for security
          </p>

          {/* Form */}
          <form onSubmit={handleUpdatePassword} className="space-y-5">
            {/* Password field */}
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-800">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your new password"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 
                           focus:ring-2 focus:ring-green-400 focus:outline-none text-gray-700"
                required
              />
            </div>

            {/* Confirm Password field */}
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

            {/* Update Password button */}
            <button
              type="submit"
              className="w-full bg-[#6ECF68] text-white font-semibold rounded-xl py-3 
                         hover:bg-[#5BBA58] transition-all"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Step 4: Success
  if (step === 4) {
    return (
      <div className="min-h-screen bg-[#F4FFF4] flex justify-center items-center">
        <div className="w-full max-w-sm px-6 py-8 bg-white rounded-2xl shadow-md">
          {/* Logo */}
          <div className="flex flex-col items-center space-y-2 mb-6">
            <img src={logo} alt="RePlate Logo" className="w-20 h-20" />
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-800 mb-2">Successful</h2>
          <p className="text-sm text-gray-600 mb-6">
            Your password has been reset successfully
          </p>

          {/* Continue button */}
          <Link to="/login">
            <button
              className="w-full bg-[#6ECF68] text-white font-semibold rounded-xl py-3 
                         hover:bg-[#5BBA58] transition-all"
            >
              Continue
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return null;
}