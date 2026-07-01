import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AppLayout from "../layouts/AppLayout";
import SummaryCard from "../components/SummaryCard";
import Card from "../components/Card";
import Button from "../components/Button";
import attendanceService from "../services/attendanceService";

export default function AdminDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
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

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-3">
          <SummaryCard
            title={t("totalStaff")}
            value={todayData?.totalStaff || 0}
            icon={UserIcon}
            color="primary"
          />
          <SummaryCard
            title={t("present")}
            value={todayData?.presentToday || 0}
            icon={PresentIcon}
            color="primary"
          />
          <SummaryCard
            title={t("absent")}
            value={todayData?.absentToday || 0}
            icon={AbsentIcon}
            color="danger"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="secondary"
            size="md"
            fullWidth
            onClick={() => navigate("/admin/staff")}
          >
            <span className="flex items-center gap-2">
              {UserIcon}
              {t("manageStaff")}
            </span>
          </Button>
          <Button
            variant="secondary"
            size="md"
            fullWidth
            onClick={() => navigate("/admin/admins")}
          >
            <span className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              {t("manageAdmins")}
            </span>
          </Button>
          <Button
            variant="secondary"
            size="md"
            fullWidth
            onClick={() => navigate("/admin/history")}
            className="col-span-2"
          >
            <span className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {t("attendanceHistory")}
            </span>
          </Button>
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-3">
            {t("todaysAttendance")}
          </h3>

          {todayData?.records?.length === 0 ? (
            <Card className="text-center py-8">
              <p className="text-gray-400 text-lg">{t("noAttendanceYet")}</p>
            </Card>
          ) : (
            <div className="space-y-2">
              {todayData?.records?.map((record) => (
                <Card key={record.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {record.user.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {record.user.mobile}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-primary">
                      {record.checkInTime}
                    </p>
                    <p className="text-xs text-gray-400">
                      {record.status === "Present" ? t("present") : t("absent")}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
