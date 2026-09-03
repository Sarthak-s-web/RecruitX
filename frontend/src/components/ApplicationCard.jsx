import { Link } from "react-router-dom";
import { FileText, Building2, MapPin, Calendar } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { formatDate } from "../utils/constants";

export default function ApplicationCard({ application }) {
  const job = application.job || {};
  const resumeUrl = application.resume;

  return (
    <div className="card-hover p-5 flex flex-col gap-3 animate-slide-up">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <Link
            to={`/jobs/${job._id || job.id}`}
            className="text-base font-semibold text-slate-900 hover:text-primary-600 transition-colors"
          >
            {job.title || "Untitled Position"}
          </Link>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-500">
            <Building2 className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{job.company || "N/A"}</span>
          </p>
        </div>
        <StatusBadge status={application.status} />
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-slate-600">
        {job.location && (
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            {job.location}
          </span>
        )}
        {application.createdAt && (
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            Applied {formatDate(application.createdAt)}
          </span>
        )}
      </div>

      {application.coverLetter && (
        <p className="text-sm text-slate-600 line-clamp-2">
          {application.coverLetter}
        </p>
      )}

      {resumeUrl && (
        <div className="pt-2 border-t border-slate-100">
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 transition-colors"
          >
            <FileText className="h-4 w-4" />
            View Resume
          </a>
        </div>
      )}
    </div>
  );
}
