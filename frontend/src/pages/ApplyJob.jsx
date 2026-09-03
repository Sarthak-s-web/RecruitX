import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Upload, FileText, ArrowLeft, CheckCircle2 } from "lucide-react";
import { applicationService, jobService } from "../services";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import Textarea from "../components/Textarea";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import { getErrorMessage } from "../utils/constants";

export default function ApplyJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isJobSeeker } = useAuth();

  const [job, setJob] = useState(null);
  const [loadingJob, setLoadingJob] = useState(true);
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await jobService.getById(id);

        // Backend returns { message, job }
        setJob(res.data.job);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoadingJob(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Resume file must be smaller than 5MB.");
        return;
      }

      if (file.type !== "application/pdf") {
        setError("Only PDF files are allowed.");
        return;
      }

      setResume(file);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!resume) {
      setError("Please upload your resume.");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("resume", resume);
      formData.append("coverLetter", coverLetter);

      await applicationService.apply(id, formData);

      setSuccess(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 animate-fade-in">
        <div className="card p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-100">
            <CheckCircle2 className="h-8 w-8 text-success-600" />
          </div>

          <h1 className="mt-4 text-2xl font-bold text-slate-900">
            Application Submitted!
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Your application for {job?.title} at {job?.company} has been
            submitted successfully.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/my-applications" className="btn-primary">
              View My Applications
            </Link>

            <Link to="/jobs" className="btn-secondary">
              Browse More Jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loadingJob) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      <Link
        to={`/jobs/${id}`}
        className="mb-6 flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Job
      </Link>

      <div className="card p-6 sm:p-8 animate-slide-up">
        <h1 className="text-2xl font-bold text-slate-900">
          Apply for this position
        </h1>

        {job && (
          <p className="mt-1 text-sm text-slate-500">
            {job.title} at {job.company}
          </p>
        )}

        {error && <ErrorMessage message={error} className="mt-4" />}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Resume upload */}
          <div>
            <label className="label">
              Resume (PDF - max 5MB)
            </label>

            <div className="mt-1 flex items-center gap-3">
              <label className="btn-secondary cursor-pointer">
                <Upload className="h-4 w-4" />
                Choose File

                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {resume && (
                <span className="flex items-center gap-1.5 text-sm text-slate-600">
                  <FileText className="h-4 w-4 text-primary-600" />
                  {resume.name}
                </span>
              )}
            </div>

            <p className="mt-1 text-xs text-slate-400">
              Only PDF files up to 5MB are allowed.
            </p>
          </div>

          {/* Cover letter */}
          <Textarea
            label="Cover Letter (optional)"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Tell the recruiter why you're a great fit for this role..."
            rows={6}
          />

          <Button
            type="submit"
            loading={submitting}
            className="w-full"
          >
            Submit Application
          </Button>
        </form>
      </div>
    </div>
  );
}

