import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Logo from "../components/Logo";

/**
 * Main app layout with header.
 * Shows VegPro branding, today's date, language toggle, and logout button.
 */
export default function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "hi" : "en";
    i18n.changeLanguage(newLang);
    localStorage.setItem("vegpro_lang", newLang);
  };

  const today = new Date().toLocaleDateString(
    i18n.language === "hi" ? "hi-IN" : "en-IN",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Logo className="h-8 w-8 drop-shadow-sm" />
              <h1
                className="text-xl font-bold text-primary cursor-pointer"
                onClick={() =>
                  navigate(user?.role === "ADMIN" ? "/admin" : "/staff")
                }
              >
                {t("vegpro")}
              </h1>
            </div>
            <p className="text-xs text-gray-500 mt-1">{today}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors border border-gray-200"
            >
              {i18n.language === "en" ? "हिन्दी" : "English"}
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-danger hover:bg-red-50 rounded-lg transition-colors"
            >
              {t("logout")}
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-lg mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
