import { useState, useEffect, useCallback } from "react";
import { Search, Briefcase } from "lucide-react";
import JobCard from "../components/JobCard";
import JobFilters from "../components/JobFilters";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import JobCardSkeletonList from "../components/Skeleton";
import { jobService } from "../services";
import { getErrorMessage } from "../utils/constants";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    jobType: "",
    skills: "",
  });

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.location) params.location = filters.location;
      if (filters.jobType) params.jobType = filters.jobType;
      if (filters.skills) params.skills = filters.skills;

      const res = await jobService.getAll(params);
      setJobs(Array.isArray(res.data) ? res.data : res.data.jobs || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchJobs();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchJobs]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Browse Jobs</h1>
        <p className="mt-1 text-sm text-slate-500">
          Find your next career opportunity
        </p>
      </div>

      <JobFilters filters={filters} onChange={setFilters} />

      {error ? (
        <div className="space-y-4">
          <ErrorMessage message={error} onRetry={fetchJobs} />
        </div>
      ) : loading ? (
        <JobCardSkeletonList count={6} />
      ) : jobs.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <Briefcase className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-slate-900">No jobs found</h3>
          <p className="mt-1 text-sm text-slate-500">
            Try adjusting your filters or search terms.
          </p>
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-slate-500">
            {jobs.length} {jobs.length === 1 ? "job" : "jobs"} found
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job._id || job.id} job={job} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
