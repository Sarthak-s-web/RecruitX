import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  FileText,
  Users,
  MessageSquare,
  Calendar,
} from "lucide-react";
import { applicationService } from "../services";
import StatusBadge from "../components/StatusBadge";
import Select from "../components/Select";
import ErrorMessage from "../components/ErrorMessage";
import { ApplicationRowSkeleton } from "../components/Skeleton";
import {
  APPLICATION_STATUSES,
  formatDate,
  getErrorMessage,
} from "../utils/constants";

export default function JobApplications() {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchApplications = async () => {
  setLoading(true);
  setError("");
  try {
    const res = await applicationService.getByJob(jobId);
    setApplications(Array.isArray(res.data.application) ? res.data.application : []);
  } catch (err) {
    setError(getErrorMessage(err));
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchApplications();
  }, [jobId]);

  const handleStatusChange = async (applicationId, newStatus) => {
    setUpdatingId(applicationId);
    try {
      await applicationService.updateStatus(applicationId, newStatus);
      setApplications((prev) =>
        prev.map((app) =>
          (app._id || app.id) === applicationId
            ? { ...app, status: newStatus }
            : app
        )
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      <Link
        to="/recruiter/jobs"
        className="mb-6 flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to My Jobs
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Applications</h1>
        <p className="mt-1 text-sm text-slate-500">
          Review and manage applications for this job
        </p>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchApplications} className="mb-4" />}

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <ApplicationRowSkeleton key={i} />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <Users className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-slate-900">
            No applications yet
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Applications for this job will appear here once candidates apply.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const applicant = app.applicant || app.user || {};
            const appId = app._id || app.id;
            return (
              <div key={appId} className="card-hover p-5 animate-slide-up">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Applicant info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
                        <User className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {applicant.name || "Unknown Applicant"}
                        </p>
                        <p className="flex items-center gap-1 text-xs text-slate-500">
                          <Mail className="h-3 w-3" />
                          {applicant.email || "N/A"}
                        </p>
                      </div>
                    </div>

                    {app.createdAt && (
                      <p className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                        <Calendar className="h-3 w-3" />
                        Applied on {formatDate(app.createdAt)}
                      </p>
                    )}

                    {app.coverLetter && (
                      <div className="mt-3 flex items-start gap-2">
                        <MessageSquare className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" />
                        <p className="text-sm text-slate-600 line-clamp-3">
                          {app.coverLetter}
                        </p>
                      </div>
                    )}

                    {app.resumeUrl && (
                      <div className="mt-3">
                        <a
                          href={app.resumeUrl}
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

                  {/* Status control */}
                  <div className="flex flex-col gap-2 lg:w-56">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-slate-400">Current Status</span>
                      <StatusBadge status={app.status} />
                    </div>
                    <Select
                      value={app.status}
                      onChange={(e) => handleStatusChange(appId, e.target.value)}
                      disabled={updatingId === appId}
                      className="text-sm"
                      aria-label="Change application status"
                    >
                      {APPLICATION_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0) + status.slice(1).toLowerCase()}
                        </option>
                      ))}
                    </Select>
                    {updatingId === appId && (
                      <p className="text-xs text-slate-400">Updating...</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
