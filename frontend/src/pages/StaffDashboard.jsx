import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/useAuth";
import AppLayout from "../layouts/AppLayout";
import Button from "../components/Button";
import Card from "../components/Card";
import attendanceService from "../services/attendanceService";

export default function StaffDashboard() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [markedToday, setMarkedToday] = useState(false);
  const [checkedOutToday, setCheckedOutToday] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [statusType, setStatusType] = useState(null); // "Present" or "Half Day"
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const initData = async () => {
      try {
        const [status, summaryData] = await Promise.all([
          attendanceService.getMyStatus(),
          attendanceService.getMySummary()
        ]);
        
        if (status.markedToday) {
          setMarkedToday(true);
          setCheckInTime(status.attendance.checkInTime);
          setStatusType(status.attendance.status);
          if (status.attendance.checkOutTime) {
            setCheckedOutToday(true);
            setCheckOutTime(status.attendance.checkOutTime);
          }
        }

        setSummary(summaryData);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setChecking(false);
      }
    };
    initData();
  }, []);

  const handleMarkAttendance = async (isHalfDay = false) => {
    setLoading(true);
    setMessage("");

    try {
      const result = await attendanceService.checkIn(isHalfDay);
      setMarkedToday(true);
      setCheckInTime(result.checkInTime);
      setStatusType(result.status);
      setMessage(t("attendanceSuccess"));
      
      // Update summary locally for immediate feedback
      setSummary(prev => prev ? {
        ...prev,
        [isHalfDay ? 'halfDay' : 'present']: prev[isHalfDay ? 'halfDay' : 'present'] + 1,
        total: prev.total + 1
      } : null);
      
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

  const handleCheckOut = async () => {
    setLoading(true);
    setMessage("");

    try {
      const result = await attendanceService.checkOut();
      setCheckedOutToday(true);
      setCheckOutTime(result.checkOutTime);
      setMessage(t("checkOutSuccess"));
    } catch (err) {
      const errorCode = err.response?.data?.error?.code;
      if (errorCode === "ALREADY_CHECKED_OUT") {
        setCheckedOutToday(true);
        setMessage(t("alreadyCheckedOut"));
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
      <div className="space-y-6 pt-4 pb-10">
        
        {/* Header Section */}
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Hello, {user?.name}
          </h2>
        </div>

        {/* Suggested For You - Horizontal Scroll Section */}
        <div>
          <h3 className="text-base font-bold text-gray-800 mb-3">{t("suggestedForYou")}</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
            
            {/* 1. My Attendance */}
            <button 
              onClick={() => navigate("/staff/attendance")}
              className="snap-start flex items-center gap-3 bg-white p-3 rounded-2xl min-w-[180px] shadow-sm border border-gray-100 active:scale-95 transition-transform"
            >
              <div className="h-12 w-12 rounded-xl bg-yellow-400 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-gray-800 leading-tight whitespace-nowrap">{t("myAttendance")}</p>
              </div>
            </button>

            {/* 2. Apply Leave (Dummy) */}
            <button 
              onClick={() => alert("Apply Leave feature coming soon!")}
              className="snap-start flex items-center gap-3 bg-white p-3 rounded-2xl min-w-[180px] shadow-sm border border-gray-100 active:scale-95 transition-transform"
            >
              <div className="h-12 w-12 rounded-xl bg-orange-400 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-gray-800 leading-tight whitespace-nowrap">{t("applyLeave")}</p>
                <p className="text-[10px] text-gray-400 font-medium">{t("comingSoon")}</p>
              </div>
            </button>

            {/* 3. Salary Slip (Dummy) */}
            <button 
              onClick={() => alert("Download Salary Slip feature coming soon!")}
              className="snap-start flex items-center gap-3 bg-white p-3 rounded-2xl min-w-[180px] shadow-sm border border-gray-100 active:scale-95 transition-transform"
            >
              <div className="h-12 w-12 rounded-xl bg-blue-500 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-gray-800 leading-tight whitespace-nowrap">{t("downloadSalarySlip")}</p>
                <p className="text-[10px] text-gray-400 font-medium">{t("comingSoon")}</p>
              </div>
            </button>

          </div>
        </div>

        {/* Clock Card - Compact */}
        <Card className="text-center py-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 mb-1 font-medium">{formatDate(currentTime)}</p>
          <p className="text-3xl font-bold text-gray-800 font-mono tracking-tight">
            {formatTime(currentTime)}
          </p>
        </Card>

        {/* Action Buttons Section */}
        {checkedOutToday ? (
          <Card className="text-center bg-gray-50 border-gray-200 py-4">
            <div className="flex justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800">
              {t("checkOutSuccess")}
            </h3>
            <div className="flex justify-center gap-4 mt-3 text-xs">
              <p className="text-gray-500">
                {t("checkInTime")}: <span className="font-semibold text-gray-800">{checkInTime}</span>
              </p>
              <p className="text-gray-500">
                {t("checkOutTime")}: <span className="font-semibold text-gray-800">{checkOutTime}</span>
              </p>
            </div>
          </Card>
        ) : markedToday ? (
          <div className="space-y-3">
            <Card className="text-center bg-primary-50 border-primary/20 py-4">
              <div className="flex justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-primary-dark">
                {t("attendanceMarked")}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {t("checkInTime")}: <span className="font-semibold">{checkInTime}</span>
              </p>
            </Card>

            <Button
              onClick={handleCheckOut}
              loading={loading}
              fullWidth
              size="lg"
              variant="secondary"
              className="py-3 text-lg font-bold shadow-sm"
            >
              {t("checkOutBtn")}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <Button
              onClick={() => handleMarkAttendance(false)}
              loading={loading}
              fullWidth
              size="lg"
              className="py-3 text-lg font-bold shadow-md shadow-primary/20"
            >
              {t("markAttendance")}
            </Button>
            
            <Button
              onClick={() => handleMarkAttendance(true)}
              loading={loading}
              fullWidth
              size="md"
              variant="secondary"
              className="py-2.5 text-base font-bold text-yellow-700 bg-yellow-50 hover:bg-yellow-100 border-yellow-200"
            >
              {t("markHalfDay")}
            </Button>
          </div>
        )}

        {message && !markedToday && !checkedOutToday && (
          <div className="bg-red-50 border border-red-200 text-danger text-sm font-medium px-4 py-3 rounded-xl">
            {message}
          </div>
        )}

        {/* Monthly Summary Block (Compact) */}
        {summary && (
          <div className="grid grid-cols-2 gap-3 mt-6">
            <Card className="text-center py-3 bg-primary-50 border border-primary/20 shadow-sm">
              <p className="text-xs font-semibold text-primary">{t("monthlySummary")} ({t("present")})</p>
              <p className="text-xl font-bold text-primary-dark mt-0.5">
                {summary.present}
              </p>
            </Card>
            <Card className="text-center py-3 bg-yellow-50 border border-yellow-200 shadow-sm">
              <p className="text-xs font-semibold text-yellow-700">{t("monthlySummary")} ({t("halfDay")})</p>
              <p className="text-xl font-bold text-yellow-800 mt-0.5">
                {summary.halfDay}
              </p>
            </Card>
          </div>
        )}

      </div>
    </AppLayout>
  );
}
