import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import staffService from "../services/staffService";
import attendanceService from "../services/attendanceService";

/**
 * Attendance History page — select a staff member and view their attendance history.
 * Optional date filtering.
 */
export default function AttendanceHistory() {
  const navigate = useNavigate();
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Fetch staff list
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const data = await staffService.getAll();
        setStaffList(data);
      } catch (err) {
        console.error("Failed to fetch staff:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

  // Fetch history when staff is selected or filters change
  const fetchHistory = async (userId, filters = {}) => {
    setHistoryLoading(true);
    try {
      const data = await attendanceService.getUserHistory(userId, filters);
      setHistory(data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleSelectStaff = (member) => {
    setSelectedStaff(member);
    setStartDate("");
    setEndDate("");
    fetchHistory(member.id);
  };

  const handleFilter = () => {
    if (selectedStaff) {
      fetchHistory(selectedStaff.id, { startDate, endDate });
    }
  };

  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
    if (selectedStaff) {
      fetchHistory(selectedStaff.id);
    }
  };

  const handleBack = () => {
    if (selectedStaff) {
      setSelectedStaff(null);
      setHistory(null);
    } else {
      navigate("/admin");
    }
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

  return (
    <AppLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <h2 className="text-xl font-bold text-gray-800">
            {selectedStaff
              ? `${selectedStaff.name}'s Attendance`
              : "Attendance History"}
          </h2>
        </div>

        {/* Staff selection or History view */}
        {!selectedStaff ? (
          // Staff List for Selection
          <div className="space-y-2">
            <p className="text-sm text-gray-500 mb-2">
              Select a staff member to view their attendance history:
            </p>
            {staffList.length === 0 ? (
              <Card className="text-center py-8">
                <p className="text-gray-400">No staff members found</p>
              </Card>
            ) : (
              staffList.map((member) => (
                <Card
                  key={member.id}
                  onClick={() => handleSelectStaff(member)}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-gray-800">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.mobile}</p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Card>
              ))
            )}
          </div>
        ) : (
          // History View
          <div className="space-y-4">
            {/* Staff Info */}
            <Card className="bg-primary-50 border-primary/20">
              <p className="font-semibold text-gray-800">
                {selectedStaff.name}
              </p>
              <p className="text-sm text-gray-500">{selectedStaff.mobile}</p>
            </Card>

            {/* Date Filter */}
            <Card>
              <p className="text-sm font-medium text-gray-600 mb-3">
                Filter by Date
              </p>
              <div className="flex gap-2 mb-3">
                <div className="flex-1">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border-2 border-gray-200 focus:outline-none focus:border-primary"
                    placeholder="From"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border-2 border-gray-200 focus:outline-none focus:border-primary"
                    placeholder="To"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleFilter} className="flex-1">
                  Apply Filter
                </Button>
                {(startDate || endDate) && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleClearFilter}
                  >
                    Clear
                  </Button>
                )}
              </div>
            </Card>

            {/* History Records */}
            {historyLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : history?.records?.length === 0 ? (
              <Card className="text-center py-8">
                <p className="text-gray-400">No attendance records found</p>
              </Card>
            ) : (
              <div className="space-y-2">
                {history?.records?.map((record) => (
                  <Card
                    key={record.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">
                        {record.date}
                      </p>
                      <p className="text-sm text-gray-500">
                        Check-in: {record.checkInTime}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-primary-50 text-primary-dark text-sm font-medium rounded-full">
                      {record.status}
                    </span>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
