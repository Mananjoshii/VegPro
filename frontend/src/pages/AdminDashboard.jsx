import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/useAuth";
import AppLayout from "../layouts/AppLayout";
import SummaryCard from "../components/SummaryCard";
import Card from "../components/Card";
import attendanceService from "../services/attendanceService";

export default function AdminDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [todayData, setTodayData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await attendanceService.getToday();
        setTodayData(data);
      } catch (err) {
        console.error("Failed to fetch today's attendance:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Helper to calculate hours between check-in and check-out for individual records
  const getWorkHours = (checkIn, checkOut) => {
    if (!checkOut) return t("na");
    const [inH, inM] = checkIn.split(":");
    const [outH, outM] = checkOut.split(":");
    const inDate = new Date(2000, 0, 1, inH, inM);
    const outDate = new Date(2000, 0, 1, outH, outM);
    const diffMs = outDate - inDate;
    if (diffMs < 0) return t("na");
    const diffHrs = Math.floor(diffMs / 3600000);
    const diffMins = Math.floor((diffMs % 3600000) / 60000);
    return `${String(diffHrs).padStart(2, '0')}:${String(diffMins).padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </AppLayout>
    );
  }

  const UserIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );

  const PresentIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const AbsentIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const ClockIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  return (
    <AppLayout>
      <div className="space-y-6 pt-4 pb-10">
        
        {/* Header Section */}
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {t("helloAdmin")}
          </h2>
        </div>

        {/* 2x2 Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <SummaryCard
            title={t("totalStaff")}
            value={todayData?.totalStaff || 0}
            icon={UserIcon}
            color="primary"
          />
          <SummaryCard
            title={t("totalWorkHours")}
            value={todayData?.totalWorkHoursStr || "0h 0m"}
            icon={ClockIcon}
            color="warning" // Let's use warning/yellow for hours to make it pop
          />
          <SummaryCard
            title={t("present")}
            value={todayData?.presentToday || 0}
            icon={PresentIcon}
            color="success" // Or primary, depending on styling
          />
          <SummaryCard
            title={t("absent")}
            value={todayData?.absentToday || 0}
            icon={AbsentIcon}
            color="danger"
          />
        </div>

        {/* Quick Actions */}
        <div className="pt-2">
          <h3 className="text-base font-bold text-gray-800 mb-3">{t("quickActions")}</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            
            {/* 1. Manage Staff */}
            <button 
              onClick={() => navigate("/admin/staff")}
              className="flex items-center gap-3 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 active:scale-95 transition-transform"
            >
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800 leading-tight">{t("manageStaff")}</p>
              </div>
            </button>

            {/* 2. Manage Admins */}
            <button 
              onClick={() => navigate("/admin/admins")}
              className="flex items-center gap-3 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 active:scale-95 transition-transform"
            >
              <div className="h-10 w-10 rounded-xl bg-indigo-500 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800 leading-tight">{t("manageAdmins")}</p>
              </div>
            </button>

            {/* 3. Attendance History */}
            <button 
              onClick={() => navigate("/admin/history")}
              className="flex items-center gap-3 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 active:scale-95 transition-transform col-span-2 sm:col-span-1"
            >
              <div className="h-10 w-10 rounded-xl bg-yellow-500 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800 leading-tight">{t("attendanceHistory")}</p>
              </div>
            </button>

          </div>
        </div>

        {/* Today's Attendance List */}
        <div>
          <h3 className="text-base font-bold text-gray-800 mb-3">
            {t("todaysAttendance")}
          </h3>

          {todayData?.records?.length === 0 ? (
            <Card className="text-center py-8 bg-gray-50 border-gray-100 shadow-none">
              <p className="text-gray-400 text-sm">{t("noAttendanceYet")}</p>
            </Card>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* List Header */}
              <div className="bg-gray-50 px-4 py-3 flex text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-100">
                <div className="flex-1">{t("staff")}</div>
                <div className="w-16 text-center">{t("workHoursListLabel")}</div>
                <div className="w-20 text-right">{t("status")}</div>
              </div>

              {/* List Body */}
              <div className="divide-y divide-gray-50">
                {todayData?.records?.map((record) => (
                  <div key={record.id} className="px-4 py-3 flex items-center">
                    
                    {/* Left Column: Name & Check In/Out details */}
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 text-sm">
                        {record.user.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-medium bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                          IN: {record.checkInTime}
                        </span>
                        {record.checkOutTime && (
                          <span className="text-[10px] font-medium bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                            OUT: {record.checkOutTime}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Middle Column: Calculated Work Hours */}
                    <div className="w-16 text-center">
                      <span className="text-xs font-bold text-gray-700 font-mono">
                        {getWorkHours(record.checkInTime, record.checkOutTime)}
                      </span>
                    </div>

                    {/* Right Column: Status Tag */}
                    <div className="w-20 text-right">
                      <span className={`inline-block text-[10px] font-bold px-2 py-1 rounded-md ${
                        record.status === "Half Day" 
                          ? "bg-yellow-100 text-yellow-700" 
                          : "bg-green-100 text-green-700"
                      }`}>
                        {record.status === "Half Day" ? t("halfDay") : t("present")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
