import { useId } from "react";

export default function Textarea({ label, error, className = "", id, ...props }) {
  const generatedId = useId();
  const textareaId = id || generatedId;
  return (
    <div>
      {label && (
        <label htmlFor={textareaId} className="label">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
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
