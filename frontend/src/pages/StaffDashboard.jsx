import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import AppLayout from "../layouts/AppLayout";
import Button from "../components/Button";
import Card from "../components/Card";
import attendanceService from "../services/attendanceService";

/**
 * Staff Dashboard — minimal interface for marking attendance.
 * Shows greeting, date/time, and a large MARK ATTENDANCE button.
 */
export default function StaffDashboard() {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [markedToday, setMarkedToday] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [message, setMessage] = useState("");

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Check if already marked today
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await attendanceService.getMyStatus();
        if (status.markedToday) {
          setMarkedToday(true);
          setCheckInTime(status.attendance.checkInTime);
        }
      } catch (err) {
        console.error("Failed to check status:", err);
      } finally {
        setChecking(false);
      }
    };
    checkStatus();
  }, []);

  const handleMarkAttendance = async () => {
    setLoading(true);
    setMessage("");

    try {
      const result = await attendanceService.checkIn();
      setMarkedToday(true);
      setCheckInTime(result.checkInTime);
      setMessage("Attendance marked successfully! ✅");
    } catch (err) {
      const errorCode = err.response?.data?.error?.code;
      if (errorCode === "ALREADY_MARKED") {
        setMarkedToday(true);
        setMessage("Attendance already marked today.");
      } else {
        setMessage("Failed to mark attendance. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  if (checking) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="text-center space-y-8 pt-4">
        {/* Greeting */}
        <div>
          <p className="text-lg text-gray-500">{getGreeting()},</p>
          <h2 className="text-2xl font-bold text-gray-800 mt-1">
            {user?.name} 👋
          </h2>
        </div>

        {/* Date & Time */}
        <Card className="text-center">
          <p className="text-sm text-gray-500 mb-1">{formatDate(currentTime)}</p>
          <p className="text-4xl font-bold text-gray-800 font-mono">
            {formatTime(currentTime)}
          </p>
        </Card>

        {/* Attendance Button or Status */}
        {markedToday ? (
          <Card className="text-center bg-primary-50 border-primary/20">
            <div className="text-5xl mb-3">✅</div>
            <h3 className="text-xl font-bold text-primary-dark">
              Attendance Marked
            </h3>
            {checkInTime && (
              <p className="text-gray-600 mt-2">
                Check-in Time:{" "}
                <span className="font-semibold">{checkInTime}</span>
              </p>
            )}
          </Card>
        ) : (
          <div className="space-y-4">
            <Button
              onClick={handleMarkAttendance}
              loading={loading}
              fullWidth
              size="xl"
              className="py-6 text-2xl font-bold shadow-lg shadow-primary/30"
            >
              ✋ MARK ATTENDANCE
            </Button>
          </div>
        )}

        {/* Status message */}
        {message && !markedToday && (
          <div className="bg-red-50 border border-red-200 text-danger text-sm font-medium px-4 py-3 rounded-xl">
            {message}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
