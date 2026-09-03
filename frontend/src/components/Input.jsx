import { useId } from "react";

export default function Input({ label, error, className = "", id, ...props }) {
  const generatedId = useId();
  const inputId = id || generatedId;
  return (
    <div>
      {label && (
        <label htmlFor={inputId} className="label">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`input ${error ? "border-error-400 focus:border-error-500 focus:ring-error-500/20" : ""} ${className}`}
        aria-invalid={error ? true : undefined}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-error-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
