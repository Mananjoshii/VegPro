import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AppLayout from "../layouts/AppLayout";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import staffService from "../services/staffService";
import attendanceService from "../services/attendanceService";

export default function AttendanceHistory() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [staff, setStaff] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchLoading, setFetchLoading] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        const staffData = await staffService.getAll();
        setStaff(staffData);
        if (staffData.length > 0) {
          setSelectedStaffId(staffData[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch staff:", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const fetchHistory = async () => {
    if (!selectedStaffId) return;
    setFetchLoading(true);
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const data = await attendanceService.getUserHistory(selectedStaffId, params);
      setHistory(data.records);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStaffId]);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchHistory();
  };

  // Calculate summary based on current history and date range
  const presentCount = history.length;
  let absentCount = null;
  let totalDays = null;

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end >= start) {
      totalDays = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
      absentCount = Math.max(0, totalDays - presentCount);
    }
  }

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
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin")}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <h2 className="text-xl font-bold text-gray-800">
            {t("attendanceHistory")}
          </h2>
        </div>

        {staff.length === 0 ? (
          <Card className="text-center py-10">
            <p className="text-gray-400 text-lg">{t("noStaffFound")}</p>
          </Card>
        ) : (
          <>
            <Card className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("selectStaffHint")}
                </label>
                <select
                  value={selectedStaffId}
                  onChange={(e) => setSelectedStaffId(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                >
                  {staff.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.mobile})
                    </option>
                  ))}
                </select>
              </div>

              <form onSubmit={handleFilter} className="pt-2 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {t("filterByDate")}
                </p>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <Input
                    id="startDate"
                    label={t("from")}
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <Input
                    id="endDate"
                    label={t("to")}
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" size="sm" className="flex-1">
                    {t("applyFilter")}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setStartDate("");
                      setEndDate("");
                      setTimeout(() => fetchHistory(), 0);
                    }}
                  >
                    {t("clear")}
                  </Button>
                </div>
              </form>
            </Card>

            {/* Summary Section */}
            {!fetchLoading && (
              <div className="grid grid-cols-2 gap-3">
                <Card className="text-center py-4 bg-primary-50 border border-primary/20">
                  <p className="text-sm font-semibold text-primary">{t("present")}</p>
                  <p className="text-2xl font-bold text-primary-dark mt-1">
                    {presentCount} {t("days", { defaultValue: "Days" })}
                  </p>
                </Card>
                
                {absentCount !== null ? (
                  <Card className="text-center py-4 bg-red-50 border border-red-200">
                    <p className="text-sm font-semibold text-danger">{t("absent")}</p>
                    <p className="text-2xl font-bold text-red-700 mt-1">
                      {absentCount} {t("days", { defaultValue: "Days" })}
                    </p>
                  </Card>
                ) : (
                  <Card className="text-center py-4 bg-gray-50 border border-gray-200 opacity-60">
                    <p className="text-sm font-semibold text-gray-500">{t("absent")}</p>
                    <p className="text-xs text-gray-400 mt-1 leading-tight">
                      Select date range to calculate
                    </p>
                  </Card>
                )}
              </div>
            )}

            <div className="space-y-2">
              {fetchLoading ? (
                <div className="flex items-center justify-center py-10">
                  <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
                </div>
              ) : history.length === 0 ? (
                <Card className="text-center py-10">
                  <p className="text-gray-400">{t("noRecords")}</p>
                </Card>
              ) : (
                history.map((record) => (
                  <Card key={record.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {record.date}
                      </p>
                      <p className="text-sm text-gray-500">
                        In: <span className="text-primary font-medium">{record.checkInTime}</span>
                        {record.checkOutTime && (
                          <> | Out: <span className="text-gray-700 font-medium">{record.checkOutTime}</span></>
                        )}
                      </p>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                        record.status === "Half Day" 
                          ? "bg-yellow-100 text-yellow-700" 
                          : "bg-green-100 text-green-700"
                      }`}>
                        {record.status === "Half Day" ? t("halfDay") : t("present")}
                      </span>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
