/**
 * Reusable Button component with VegPro styling.
 * Large, touch-friendly with multiple variants.
 *
 * @param {string} variant - "primary" | "secondary" | "danger" | "ghost"
 * @param {string} size - "sm" | "md" | "lg" | "xl"
 * @param {boolean} fullWidth - Whether button spans full width
 * @param {boolean} loading - Shows loading state
 */
export default function Button({
  children,
  variant = "primary",
  size = "lg",
  fullWidth = false,
  loading = false,
  disabled = false,
  onClick,
  type = "button",
  className = "",
  ...props
}) {
  const baseClasses =
    "font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";

  const variants = {
    primary:
      "bg-primary text-white hover:bg-primary-dark focus:ring-primary shadow-sm hover:shadow-md",
    secondary:
      "bg-white text-gray-700 border-2 border-gray-200 hover:border-primary hover:text-primary focus:ring-primary",
    danger:
      "bg-danger text-white hover:bg-danger-dark focus:ring-danger shadow-sm",
    ghost:
      "bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-300",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-6 py-3 text-lg",
    xl: "px-8 py-4 text-xl",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Please wait...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
