import { Link } from "react-router-dom";
import { MapPin, Briefcase, DollarSign, Calendar, Building2 } from "lucide-react";
import { formatJobType, formatSalary, formatDate, JOB_TYPE_COLORS } from "../utils/constants";

export default function JobCard({ job }) {
  return (
    <div className="card-hover p-5 flex flex-col gap-3 animate-slide-up">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-slate-900 truncate">
            {job.title}
          </h3>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-500">
            <Building2 className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{job.company}</span>
          </p>
        </div>
        <span className={`badge flex-shrink-0 ${JOB_TYPE_COLORS[job.jobType] || "bg-slate-100 text-slate-700"}`}>
          {formatJobType(job.jobType)}
        </span>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-slate-600">
        {job.location && (
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            {job.location}
          </span>
        )}
        {job.salary !== undefined && job.salary !== null && (
          <span className="flex items-center gap-1">
            <DollarSign className="h-3.5 w-3.5 text-slate-400" />
            {formatSalary(job.salary)}
          </span>
        )}
      </div>

      {job.skills && job.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {job.skills.slice(0, 4).map((skill, i) => (
            <span
              key={i}
              className="badge bg-slate-100 text-slate-600"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 4 && (
            <span className="badge bg-slate-100 text-slate-500">
              +{job.skills.length - 4} more
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        {job.createdAt ? (
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Calendar className="h-3 w-3" />
            {formatDate(job.createdAt)}
          </span>
        ) : (
          <span />
        )}
        <Link
          to={`/jobs/${job._id || job.id}`}
          className="btn-primary text-xs px-3 py-2"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
