import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/Button";
import Input from "../components/Input";

/**
 * Login page — single entry point for both staff and admin.
 * Staff: enter mobile → auto-login.
 * Admin: enter mobile → show password field → verify → login.
 */
export default function LoginPage() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleContinue = async (e) => {
    e.preventDefault();
    setError("");

    // Validate mobile
    if (!/^\d{10}$/.test(mobile)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);

    try {
      const result = await login(mobile, showPassword ? password : null);

      if (result.requirePassword) {
        // Admin detected — show password field
        setShowPassword(true);
        setLoading(false);
        return;
      }

      // Successful login — redirect based on role
      if (result.user.role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/staff", { replace: true });
      }
    } catch (err) {
      const message =
        err.response?.data?.error?.message || "Something went wrong.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-50 rounded-3xl mb-4">
            <span className="text-4xl">🌿</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">VegPro</h1>
          <p className="text-gray-500 mt-1">Attendance Management</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleContinue} className="space-y-4">
          <Input
            id="login-mobile"
            label="Mobile Number"
            placeholder="Enter your 10-digit number"
            type="tel"
            inputMode="numeric"
            maxLength={10}
            value={mobile}
            onChange={(e) => {
              setMobile(e.target.value.replace(/\D/g, ""));
              setError("");
              // Reset password field if mobile changes
              if (showPassword) {
                setShowPassword(false);
                setPassword("");
              }
            }}
            autoFocus
          />

          {/* Password field — only shown for admin */}
          {showPassword && (
            <div className="animate-in">
              <Input
                id="login-password"
                label="Password"
                placeholder="Enter your password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                autoFocus
              />
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-danger text-sm font-medium px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <Button type="submit" fullWidth loading={loading} size="xl">
            {showPassword ? "Login" : "Continue"}
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-10">
          © {new Date().getFullYear()} VegPro. All rights reserved.
        </p>
      </div>
    </div>
  );
}
