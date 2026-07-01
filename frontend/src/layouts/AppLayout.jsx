import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

/**
 * Main app layout with header.
 * Shows VegPro branding, today's date, and logout button.
 */
export default function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
            <h1
              className="text-xl font-bold text-primary cursor-pointer"
              onClick={() =>
                navigate(user?.role === "ADMIN" ? "/admin" : "/staff")
              }
            >
              🌿 VegPro
            </h1>
            <p className="text-xs text-gray-500">{today}</p>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-danger hover:bg-red-50 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-lg mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
