import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/**
 * Protected route wrapper.
 * Redirects to login if not authenticated.
 * Optionally checks for a specific role.
 *
 * @param {string} role - Required role ("ADMIN" or "STAFF"). If not set, any authenticated user can access.
 */
export default function ProtectedRoute({ children, role }) {
  const { user, loading, isLoggedIn } = useAuth();

  // Show nothing while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // Check role if specified
  if (role && user.role !== role) {
    // Redirect admins to admin dashboard, staff to staff dashboard
    const redirect = user.role === "ADMIN" ? "/admin" : "/staff";
    return <Navigate to={redirect} replace />;
  }

  return children;
}
