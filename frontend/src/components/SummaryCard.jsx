/**
 * Summary card for dashboard stats (Total Staff, Present, Absent).
 */
export default function SummaryCard({ title, value, icon, color = "primary" }) {
  const colors = {
    primary: "bg-primary-50 text-primary-dark",
    danger: "bg-red-50 text-danger",
    warning: "bg-amber-50 text-amber-600",
    gray: "bg-gray-50 text-gray-600",
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center gap-3">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${colors[color]}`}
        >
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );
}
