import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/Button";
import Input from "../components/Input";
import Logo from "../components/Logo";

export default function LoginPage() {
  const { t } = useTranslation();
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

    if (!/^\d{10}$/.test(mobile)) {
      setError(t("validMobileError"));
      return;
    }

    setLoading(true);

    try {
      const result = await login(mobile, showPassword ? password : null);

      if (result.requirePassword) {
        setShowPassword(true);
        setLoading(false);
        return;
      }

      if (result.user.role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/staff", { replace: true });
      }
    } catch (err) {
      const message = err.response?.data?.error?.message || t("invalidCredentials");
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
          <div className="inline-flex items-center justify-center w-24 h-24 mb-4">
            <Logo className="w-full h-full drop-shadow-sm" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">{t("vegpro")}</h1>
          <p className="text-gray-500 mt-1">{t("attendanceManagement")}</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleContinue} className="space-y-4">
          <Input
            id="login-mobile"
            label={t("mobileNumber")}
            placeholder={t("mobilePlaceholder")}
            type="tel"
            inputMode="numeric"
            maxLength={10}
            value={mobile}
            onChange={(e) => {
              setMobile(e.target.value.replace(/\D/g, ""));
              setError("");
              if (showPassword) {
                setShowPassword(false);
                setPassword("");
              }
            }}
            autoFocus
          />

          {showPassword && (
            <div className="animate-in">
              <Input
                id="login-password"
                label={t("password")}
                placeholder={t("passwordPlaceholder")}
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

          {error && (
            <div className="bg-red-50 border border-red-200 text-danger text-sm font-medium px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <Button type="submit" fullWidth loading={loading} size="xl">
            {showPassword ? t("login") : t("continue")}
          </Button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-10">
          © {new Date().getFullYear()} {t("vegpro")}. {t("allRightsReserved")}
        </p>
      </div>
    </div>
  );
}
