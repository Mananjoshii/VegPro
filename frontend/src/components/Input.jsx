/**
 * Reusable Input component with label, error display, and large touch targets.
 */
export default function Input({
  label,
  error,
  id,
  type = "text",
  className = "",
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-base font-medium text-gray-700 mb-1.5"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={`
          w-full px-4 py-3 text-lg rounded-xl border-2 
          transition-colors duration-200
          focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary
          placeholder:text-gray-400
          ${error ? "border-danger" : "border-gray-200"}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-danger font-medium">{error}</p>
      )}
    </div>
  );
}
