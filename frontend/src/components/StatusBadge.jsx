import { STATUS_COLORS } from "../utils/constants";

export default function StatusBadge({ status, className = "" }) {
  const colorClass = STATUS_COLORS[status] || "bg-slate-100 text-slate-700";
  return (
    <span className={`badge ${colorClass} ${className}`}>
      {status
        ? status.charAt(0) + status.slice(1).toLowerCase()
        : "Unknown"}
    </span>
  );
}
