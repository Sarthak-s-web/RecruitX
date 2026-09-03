import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import ApplicationCard from "../components/ApplicationCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { applicationService } from "../services";
import { getErrorMessage } from "../utils/constants";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApplications = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await applicationService.getMy();
      setApplications(Array.isArray(res.data) ? res.data : res.data.applications || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">My Applications</h1>
        <p className="mt-1 text-sm text-slate-500">
          Track the status of your job applications
        </p>
      </div>

      {error ? (
        <ErrorMessage message={error} onRetry={fetchApplications} />
      ) : loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <LoadingSpinner size="xl" />
        </div>
      ) : applications.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <FileText className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-slate-900">
            No applications yet
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Start applying to jobs to see them here.
          </p>
          <Link to="/jobs" className="btn-primary mt-6">
            Browse Jobs
          </Link>
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-slate-500">
            {applications.length} {applications.length === 1 ? "application" : "applications"} submitted
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {applications.map((app) => (
              <ApplicationCard key={app._id || app.id} application={app} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
