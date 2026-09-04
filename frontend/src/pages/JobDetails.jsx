
import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  DollarSign,
  Building2,
  Calendar,
  ArrowLeft,
  User,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { jobService } from "../services";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import Button from "../components/Button";
import {
  formatJobType,
  formatSalary,
  formatDate,
  JOB_TYPE_COLORS,
  getErrorMessage,
} from "../utils/constants";

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isJobSeeker, isRecruiter } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchJob = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await jobService.getById(id);

      // Backend returns { message, job }
      // We only need the actual job object.
      setJob(res.data.job);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/jobs/${id}/apply` } });
    } else {
      navigate(`/jobs/${id}/apply`);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <ErrorMessage message={error} onRetry={fetchJob} />

        <Link to="/jobs" className="btn-secondary mt-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </Link>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <p className="text-slate-500">Job not found.</p>

        <Link to="/jobs" className="btn-secondary mt-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      <Link
        to="/jobs"
        className="mb-6 flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Jobs
      </Link>

      <div className="card p-6 sm:p-8 animate-slide-up">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-slate-900">
                {job.title}
              </h1>

              <span
                className={`badge ${
                  JOB_TYPE_COLORS[job.jobType] ||
                  "bg-slate-100 text-slate-700"
                }`}
              >
                {formatJobType(job.jobType)}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
              <span className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-slate-400" />
                {job.company}
              </span>

              {job.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  {job.location}
                </span>
              )}

              {job.salary !== undefined && job.salary !== null && (
                <span className="flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4 text-slate-400" />
                  {formatSalary(job.salary)}
                </span>
              )}

              {job.createdAt && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  Posted {formatDate(job.createdAt)}
                </span>
              )}
            </div>
          </div>

          {/* Role-aware Apply button */}
          {isAuthenticated && isJobSeeker && (
            <Button onClick={handleApplyClick} className="flex-shrink-0">
              Apply Now
            </Button>
          )}

          {isAuthenticated && isRecruiter && (
            <span className="inline-flex items-center rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600">
              Logged in as Recruiter
            </span>
          )}

          {!isAuthenticated && (
            <Button onClick={handleApplyClick} className="flex-shrink-0">
              Login to Apply
            </Button>
          )}
        </div>

        {/* Description */}
        {job.description && (
          <div className="mt-8 border-t border-slate-100 pt-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Job Description
            </h2>

            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
              {job.description}
            </p>
          </div>
        )}

        {/* Skills */}
        {job.skills && job.skills.length > 0 && (
          <div className="mt-8 border-t border-slate-100 pt-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Required Skills
            </h2>

            <div className="mt-3 flex flex-wrap gap-2">
              {job.skills.map((skill, i) => (
                <span
                  key={i}
                  className="badge bg-primary-50 text-primary-700 border border-primary-100"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Recruiter info */}
        {job.recruiter && (
          <div className="mt-8 border-t border-slate-100 pt-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Posted By
            </h2>

            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
                <User className="h-5 w-5 text-primary-600" />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-900">
                  {job.recruiter.name || "Recruiter"}
                </p>

                {job.recruiter.email && (
                  <p className="text-xs text-slate-500">
                    {job.recruiter.email}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

