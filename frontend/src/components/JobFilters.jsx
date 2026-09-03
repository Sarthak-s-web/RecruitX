import { Search, MapPin, Briefcase, X } from "lucide-react";
import { JOB_TYPES, formatJobType } from "../utils/constants";

export default function JobFilters({ filters, onChange }) {
  const handleSearch = (e) => {
    onChange({ ...filters, search: e.target.value });
  };

  const handleLocation = (e) => {
    onChange({ ...filters, location: e.target.value });
  };

  const handleJobType = (e) => {
    onChange({ ...filters, jobType: e.target.value });
  };

  const handleSkills = (e) => {
    onChange({ ...filters, skills: e.target.value });
  };

  const clearFilters = () => {
    onChange({ search: "", location: "", jobType: "", skills: "" });
  };

  const hasFilters = filters.search || filters.location || filters.jobType || filters.skills;

  return (
    <div className="card p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search jobs..."
            value={filters.search || ""}
            onChange={handleSearch}
            className="input pl-10"
          />
        </div>

        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Location"
            value={filters.location || ""}
            onChange={handleLocation}
            className="input pl-10"
          />
        </div>

        <select
          value={filters.jobType || ""}
          onChange={handleJobType}
          className="input"
        >
          <option value="">All Job Types</option>
          {JOB_TYPES.map((type) => (
            <option key={type} value={type}>
              {formatJobType(type)}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Skills (comma separated)"
          value={filters.skills || ""}
          onChange={handleSkills}
          className="input"
        />
      </div>

      {hasFilters && (
        <div className="mt-3 flex justify-end">
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
