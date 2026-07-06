import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import StaffDashboard from "./pages/StaffDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import StaffManagement from "./pages/StaffManagement";
import AdminManagement from "./pages/AdminManagement";
import AttendanceHistory from "./pages/AttendanceHistory";
import StaffAttendance from "./pages/StaffAttendance";
import FreeTierLock from "./components/FreeTierLock";

/**
 * Root redirect — sends authenticated users to their dashboard.
 */
function RootRedirect() {
  const { isLoggedIn, user } = useAuth();

  if (isLoggedIn) {
    return (
      <Navigate to={user?.role === "ADMIN" ? "/admin" : "/staff"} replace />
    );
  }

  return <LoginPage />;
}

/**
 * App component with routing configuration.
 */
function App() {
  // Toggle this flag to show/hide the pseudo pricing lock screen
  const isFreeTierOver = true;

  return (
    <BrowserRouter>
      <AuthProvider>
        {isFreeTierOver && <FreeTierLock />}
        <Routes>
          {/* Public route */}
          <Route path="/" element={<RootRedirect />} />

          {/* Staff routes */}
          <Route
            path="/staff"
            element={
              <ProtectedRoute role="STAFF">
                <StaffDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/attendance"
            element={
              <ProtectedRoute role="STAFF">
                <StaffAttendance />
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/staff"
            element={
              <ProtectedRoute role="ADMIN">
                <StaffManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/admins"
            element={
              <ProtectedRoute role="ADMIN">
                <AdminManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/history"
            element={
              <ProtectedRoute role="ADMIN">
                <AttendanceHistory />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
