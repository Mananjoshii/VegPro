/**
 * Reusable Card component with clean shadow and rounded corners.
 */
export default function Card({ children, className = "", onClick, ...props }) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-5 ${
        onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""
      } ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}
