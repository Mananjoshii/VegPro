import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/useAuth";
import AppLayout from "../layouts/AppLayout";
import Button from "../components/Button";
import Card from "../components/Card";
import attendanceService from "../services/attendanceService";

export default function StaffDashboard() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [markedToday, setMarkedToday] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
      setMessage(t("attendanceSuccess"));
    } catch (err) {
      const errorCode = err.response?.data?.error?.code;
      if (errorCode === "ALREADY_MARKED") {
        setMarkedToday(true);
        setMessage(t("alreadyMarked"));
      } else {
        setMessage(t("markFailed"));
      }
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString(i18n.language === "hi" ? "hi-IN" : "en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString(i18n.language === "hi" ? "hi-IN" : "en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return t("goodMorning");
    if (hour < 17) return t("goodAfternoon");
    return t("goodEvening");
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
        <div>
          <p className="text-lg text-gray-500">{getGreeting()},</p>
          <div className="flex items-center justify-center gap-2 mt-1">
            <h2 className="text-2xl font-bold text-gray-800">
              {user?.name}
            </h2>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <Card className="text-center">
          <p className="text-sm text-gray-500 mb-1">{formatDate(currentTime)}</p>
          <p className="text-4xl font-bold text-gray-800 font-mono">
            {formatTime(currentTime)}
          </p>
        </Card>

        {markedToday ? (
          <Card className="text-center bg-primary-50 border-primary/20">
            <div className="flex justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-primary-dark">
              {t("attendanceMarked")}
            </h3>
            {checkInTime && (
              <p className="text-gray-600 mt-2">
                {t("checkInTime")}:{" "}
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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {t("markAttendance")}
            </Button>
          </div>
        )}

        {message && !markedToday && (
          <div className="bg-red-50 border border-red-200 text-danger text-sm font-medium px-4 py-3 rounded-xl">
            {message}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
