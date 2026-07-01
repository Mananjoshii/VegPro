import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import SummaryCard from "../components/SummaryCard";
import Card from "../components/Card";
import Button from "../components/Button";
import attendanceService from "../services/attendanceService";

/**
 * Admin Dashboard — overview with summary stats and today's attendance.
 * Navigation links to Staff Management, Admin Management, and Attendance History.
 */
export default function AdminDashboard() {
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

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <SummaryCard
            title="Total Staff"
            value={todayData?.totalStaff || 0}
            icon="👥"
            color="primary"
          />
          <SummaryCard
            title="Present"
            value={todayData?.presentToday || 0}
            icon="✅"
            color="primary"
          />
          <SummaryCard
            title="Absent"
            value={todayData?.absentToday || 0}
            icon="❌"
            color="danger"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="secondary"
            size="md"
            fullWidth
            onClick={() => navigate("/admin/staff")}
          >
            👥 Manage Staff
          </Button>
          <Button
            variant="secondary"
            size="md"
            fullWidth
            onClick={() => navigate("/admin/admins")}
          >
            🔑 Manage Admins
          </Button>
          <Button
            variant="secondary"
            size="md"
            fullWidth
            onClick={() => navigate("/admin/history")}
            className="col-span-2"
          >
            📋 Attendance History
          </Button>
        </div>

        {/* Today's Attendance */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-3">
            Today's Attendance
          </h3>

          {todayData?.records?.length === 0 ? (
            <Card className="text-center py-8">
              <p className="text-gray-400 text-lg">No attendance yet today</p>
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
                    <p className="text-xs text-gray-400">{record.status}</p>
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
