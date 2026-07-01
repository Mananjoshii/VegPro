import { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";

/**
 * Auth context for managing user authentication state.
 */
const AuthContext = createContext(null);

/**
 * Auth provider component — wraps the app to provide auth state.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = authService.getCurrentUser();
    if (savedUser && authService.isLoggedIn()) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  /**
   * Login handler
   */
  const login = async (mobile, password = null) => {
    const result = await authService.login(mobile, password);

    // If we got a token, set the user
    if (result.token) {
      setUser(result.user);
    }

    return result;
  };

  /**
   * Logout handler
   */
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isLoggedIn: !!user,
    isAdmin: user?.role === "ADMIN",
    isStaff: user?.role === "STAFF",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth context.
 * Must be used within an AuthProvider.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
