import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AppLayout from "../layouts/AppLayout";
import Card from "../components/Card";
import Button from "../components/Button";
import attendanceService from "../services/attendanceService";

export default function StaffAttendance() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("last7"); // last7, thisMonth, custom
  const [statusFilter, setStatusFilter] = useState("All"); // All, Present, Absent, Half Day
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Example selected dates for custom
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchHistory = async () => {
    setLoading(true);
    try {
      let params = {};
      const today = new Date();
      
      if (activeTab === "last7") {
        const last7 = new Date(today);
        last7.setDate(today.getDate() - 7);
        params.startDate = last7.toISOString().split("T")[0];
        params.endDate = today.toISOString().split("T")[0];
      } else if (activeTab === "thisMonth") {
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        params.startDate = firstDay.toISOString().split("T")[0];
        params.endDate = today.toISOString().split("T")[0];
      } else if (activeTab === "custom") {
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
      }

      const data = await attendanceService.getMyHistory(params);
      setHistory(data.records || []);
    } catch (err) {
      console.error("Failed to fetch my history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab !== "custom" || (startDate && endDate)) {
      fetchHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleCustomFilter = (e) => {
    e.preventDefault();
    fetchHistory();
  };

  // Calculate summaries for filters based on fetched history
  const summary = useMemo(() => {
    let present = 0;
    let absent = 0;
    let halfDay = 0;

    history.forEach((record) => {
      if (record.status === "Present") present++;
      else if (record.status === "Half Day") halfDay++;
      else absent++; // Technically our DB doesn't store explicit "Absent" rows yet, so this will be 0 based on DB records.
    });

    return { present, absent, halfDay, all: history.length };
  }, [history]);

  // Filter records based on selected status filter
  const filteredRecords = useMemo(() => {
    if (statusFilter === "All") return history;
    return history.filter((r) => r.status === statusFilter);
  }, [history, statusFilter]);

  // Helper to calculate hours between check-in and check-out
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

  return (
    <AppLayout>
      <div className="bg-gray-50 min-h-screen pb-20">
        {/* Header */}
        <div className="bg-white px-4 py-4 flex items-center border-b border-gray-100 sticky top-0 z-10 shadow-sm">
          <button onClick={() => navigate("/staff")} className="p-2 -ml-2 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-800 ml-2">Today</h1>
        </div>

        <div className="px-4 py-5 space-y-5">
          <h2 className="text-xl font-bold text-gray-800">{t("myAttendance")}</h2>

          {/* Date Tabs */}
          <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
            <button
              onClick={() => setActiveTab("last7")}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${
                activeTab === "last7" ? "bg-gray-800 text-white shadow" : "text-gray-500"
              }`}
            >
              {t("last7Days")}
            </button>
            <button
              onClick={() => setActiveTab("thisMonth")}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${
                activeTab === "thisMonth" ? "bg-gray-800 text-white shadow" : "text-gray-500"
              }`}
            >
              {t("thisMonth")}
            </button>
            <button
              onClick={() => setActiveTab("custom")}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${
                activeTab === "custom" ? "bg-gray-800 text-white shadow" : "text-gray-500"
              }`}
            >
              {t("custom")}
            </button>
          </div>

          {activeTab === "custom" && (
            <form onSubmit={handleCustomFilter} className="flex gap-2 items-end">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">{t("from")}</label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full text-sm p-2 border rounded-lg" required />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">{t("to")}</label>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full text-sm p-2 border rounded-lg" required />
              </div>
              <Button type="submit" size="sm" className="mb-0.5">{t("applyFilter")}</Button>
            </form>
          )}

          {/* Status Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setStatusFilter("All")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
                statusFilter === "All" ? "bg-gray-700 text-white" : "bg-white text-gray-600 border border-gray-200"
              }`}
            >
              {t("all")}
            </button>
            <button
              onClick={() => setStatusFilter("Present")}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
                statusFilter === "Present" ? "bg-gray-700 text-white" : "bg-white text-gray-600 border border-gray-200"
              }`}
            >
              {t("present")} <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-md text-xs">{summary.present}</span>
            </button>
            <button
              onClick={() => setStatusFilter("Absent")}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
                statusFilter === "Absent" ? "bg-gray-700 text-white" : "bg-white text-gray-600 border border-gray-200"
              }`}
            >
              {t("absent")} <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-md text-xs">{summary.absent}</span>
            </button>
            <button
              onClick={() => setStatusFilter("Half Day")}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
                statusFilter === "Half Day" ? "bg-gray-700 text-white" : "bg-white text-gray-600 border border-gray-200"
              }`}
            >
              {t("halfDay")} <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-md text-xs">{summary.halfDay}</span>
            </button>
          </div>

          {/* List Header */}
          <div className="bg-yellow-500 rounded-t-xl px-4 py-3 flex text-white text-sm font-bold shadow-sm">
            <div className="flex-1">{t("date")}</div>
            <div className="w-24 text-center">{t("workHours")}</div>
            <div className="w-16 text-center">{t("status")}</div>
            <div className="w-8"></div>
          </div>

          {/* Records List */}
          <div className="bg-white rounded-b-xl shadow-sm border border-t-0 border-gray-100 -mt-5 pt-2">
            {loading ? (
              <div className="py-10 text-center text-gray-400">
                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto" />
              </div>
            ) : filteredRecords.length === 0 ? (
              <div className="py-10 text-center text-gray-400">{t("noRecords")}</div>
            ) : (
              filteredRecords.map((record, idx) => (
                <div key={record.id} className={`p-4 flex items-center ${idx !== filteredRecords.length - 1 ? 'border-b border-gray-50' : ''}`}>
                  
                  {/* Left Column: Date & Tags */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                      <span className="text-gray-600 font-medium">{record.date}</span>
                    </div>
                    <div className="mt-2 ml-7">
                      <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
                        {t("approved")}
                      </span>
                    </div>
                  </div>

                  {/* Middle Column: Work Hours */}
                  <div className="w-24 text-center text-gray-700 font-medium text-sm">
                    {getWorkHours(record.checkInTime, record.checkOutTime)}
                  </div>

                  {/* Right Column: Status */}
                  <div className="w-16 text-center">
                    <span className={`inline-flex items-center justify-center h-6 w-6 rounded text-xs font-bold ${
                      record.status === "Present" ? "bg-green-100 text-green-700" :
                      record.status === "Half Day" ? "bg-yellow-100 text-yellow-700" :
                      "bg-gray-100 text-gray-500" // For WO or Absent
                    }`}>
                      {record.status === "Present" ? t("p") : record.status === "Half Day" ? t("hd") : t("a")}
                    </span>
                  </div>

                  {/* Chevron */}
                  <div className="w-8 text-right text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              ))
            )}
            
            {/* Regularize Button at the bottom of the list */}
            <div className="p-4 border-t border-gray-100">
              <Button variant="secondary" fullWidth className="bg-gray-200 text-gray-500 border-none hover:bg-gray-200 cursor-not-allowed">
                {t("regularize")}
              </Button>
            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}
