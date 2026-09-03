import { useId } from "react";

export default function Select({ label, error, children, className = "", id, ...props }) {
  const generatedId = useId();
  const selectId = id || generatedId;
  return (
    <div>
      {label && (
        <label htmlFor={selectId} className="label">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`input ${error ? "border-error-400 focus:border-error-500 focus:ring-error-500/20" : ""} ${className}`}
        aria-invalid={error ? true : undefined}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="mt-1 text-xs text-error-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
