import { AlertCircle, X, RotateCw } from "lucide-react";

export default function ErrorMessage({ message, onClose, onRetry, className = "" }) {
  if (!message) return null;
  return (
    <div
      className={`flex items-start gap-3 rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700 ${className}`}
      role="alert"
    >
      <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-error-500" />
      <p className="flex-1">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1 text-error-600 hover:text-error-800 transition-colors font-medium"
          aria-label="Retry"
        >
          <RotateCw className="h-4 w-4" />
          Retry
        </button>
      )}
      {onClose && (
        <button
          onClick={onClose}
          className="text-error-400 hover:text-error-600 transition-colors"
          aria-label="Dismiss error"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
