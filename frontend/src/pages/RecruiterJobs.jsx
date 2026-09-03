import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  Users,
  Briefcase,
  MapPin,
  DollarSign,
} from "lucide-react";
import { jobService } from "../services";
import Button from "../components/Button";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import Modal from "../components/Modal";
import {
  formatJobType,
  formatSalary,
  formatDate,
  JOB_TYPE_COLORS,
  getErrorMessage,
} from "../utils/constants";

export default function RecruiterJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await jobService.getMy();

      // Backend returns { message, jobs }
      setJobs(Array.isArray(res.data.jobs) ? res.data.jobs : []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);

    try {
      const jobId = deleteTarget._id || deleteTarget.id;

      await jobService.delete(jobId);

      setJobs((prevJobs) =>
        prevJobs.filter(
          (job) => (job._id || job.id) !== jobId
        )
      );

      setDeleteTarget(null);
    } catch (err) {
      setError(getErrorMessage(err));
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            My Jobs
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your job postings
          </p>
        </div>

        <Link
          to="/recruiter/jobs/create"
          className="btn-primary"
        >
          <Plus className="h-4 w-4" />
          Post New Job
        </Link>
      </div>

      {error && (
        <ErrorMessage
          message={error}
          onRetry={fetchJobs}
          className="mb-4"
        />
      )}

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <LoadingSpinner size="xl" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <Briefcase className="h-8 w-8 text-slate-400" />
          </div>

          <h3 className="mt-4 text-lg font-semibold text-slate-900">
            No jobs posted yet
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Create your first job posting to start receiving applications.
          </p>

          <Link
            to="/recruiter/jobs/create"
            className="btn-primary mt-6"
          >
            <Plus className="h-4 w-4" />
            Post New Job
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => {
            const jobId = job._id || job.id;

            return (
              <div
                key={jobId}
                className="card-hover p-5 animate-slide-up"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-base font-semibold text-slate-900">
                        {job.title}
                      </h3>

                      <span
                        className={`badge ${
                          JOB_TYPE_COLORS[job.jobType] ||
                          "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {formatJobType(job.jobType)}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                        {job.company}
                      </span>

                      {job.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          {job.location}
                        </span>
                      )}

                      {job.salary !== undefined &&
                        job.salary !== null && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3.5 w-3.5 text-slate-400" />
                            {formatSalary(job.salary)}
                          </span>
                        )}

                      {job.createdAt && (
                        <span className="text-slate-400">
                          Posted {formatDate(job.createdAt)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/jobs/${jobId}`}
                      className="btn-secondary text-xs px-3 py-2"
                      aria-label={`View ${job.title}`}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </Link>

                    <Link
                      to={`/recruiter/jobs/${jobId}/edit`}
                      className="btn-secondary text-xs px-3 py-2"
                      aria-label={`Edit ${job.title}`}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Link>

                    <Link
                      to={`/recruiter/jobs/${jobId}/applications`}
                      className="btn-secondary text-xs px-3 py-2"
                      aria-label={`View applications for ${job.title}`}
                    >
                      <Users className="h-3.5 w-3.5" />
                      Applications
                    </Link>

                    <button
                      onClick={() => setDeleteTarget(job)}
                      className="btn-danger text-xs px-3 py-2"
                      aria-label={`Delete ${job.title}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete confirmation */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Job Posting"
      >
        <p className="text-sm text-slate-600">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-slate-900">
            {deleteTarget?.title}
          </span>
          ? This action cannot be undone. All applications for this
          job will also be deleted.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={() => setDeleteTarget(null)}
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            loading={deleting}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}

